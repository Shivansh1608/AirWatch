import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    favouriteCities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
      }
    ],
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      sensitiveGroup: {
        type: Boolean,
        default: false
      },
      emailAlertsEnabled: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
