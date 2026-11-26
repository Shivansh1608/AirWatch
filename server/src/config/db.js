import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/airwatch';

  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection skipped (${error.message}). Running with resilient mock/in-memory fallback.`);
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
