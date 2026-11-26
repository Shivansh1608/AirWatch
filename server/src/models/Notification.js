import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City'
    },
    cityName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    aqi: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
