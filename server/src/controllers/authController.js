import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Resilient in-memory user registry when MongoDB is running in offline mode
const memoryUsers = new Map();

function generateTokens(user) {
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'airwatch_access_secret_32chars_key_2026';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'airwatch_refresh_secret_32chars_key_2026';

  const payload = {
    id: user._id?.toString() || user.id,
    email: user.email,
    name: user.name
  };

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

function setRefreshCookie(res, token) {
  res.cookie('airwatch_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.errors[0].message }
      });
    }

    const { name, email, password } = parsed.data;
    const lowerEmail = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    let user;

    if (isDbConnected()) {
      const existing = await User.findOne({ email: lowerEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: { message: 'An account with this email already exists.' }
        });
      }
      user = await User.create({
        name,
        email: lowerEmail,
        passwordHash,
        favouriteCities: []
      });
    } else {
      if (memoryUsers.has(lowerEmail)) {
        return res.status(409).json({
          success: false,
          error: { message: 'An account with this email already exists.' }
        });
      }
      user = {
        _id: 'usr_' + Date.now(),
        id: 'usr_' + Date.now(),
        name,
        email: lowerEmail,
        passwordHash,
        favouriteCities: [],
        preferences: { theme: 'system', sensitiveGroup: false }
      };
      memoryUsers.set(lowerEmail, user);
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        },
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.errors[0].message }
      });
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase();

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email: lowerEmail });
    } else {
      user = memoryUsers.get(lowerEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' }
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        },
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
}

export function refresh(req, res) {
  const refreshToken = req.cookies.airwatch_refresh;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: { message: 'No refresh token provided.' }
    });
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET || 'airwatch_refresh_secret_32chars_key_2026';
    const decoded = jwt.verify(refreshToken, secret);

    const accessSecret = process.env.JWT_ACCESS_SECRET || 'airwatch_access_secret_32chars_key_2026';
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, name: decoded.name },
      accessSecret,
      { expiresIn: '15m' }
    );

    return res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired refresh token.' }
    });
  }
}

export function logout(req, res) {
  res.clearCookie('airwatch_refresh');
  return res.json({
    success: true,
    message: 'Signed out successfully.'
  });
}

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    let user;

    if (isDbConnected()) {
      user = await User.findById(userId).select('-passwordHash');
    } else {
      user = Array.from(memoryUsers.values()).find((u) => u._id === userId || u.id === userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found.' }
      });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          favouriteCities: user.favouriteCities
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const { theme, sensitiveGroup, emailAlertsEnabled } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) {
        if (theme) user.preferences.theme = theme;
        if (typeof sensitiveGroup === 'boolean') user.preferences.sensitiveGroup = sensitiveGroup;
        if (typeof emailAlertsEnabled === 'boolean') user.preferences.emailAlertsEnabled = emailAlertsEnabled;
        await user.save();
        return res.json({ success: true, data: user.preferences });
      }
    }

    return res.json({
      success: true,
      data: { theme: theme || 'system', sensitiveGroup: !!sensitiveGroup, emailAlertsEnabled: !!emailAlertsEnabled }
    });
  } catch (error) {
    next(error);
  }
}
