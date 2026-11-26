import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    cityName: {
      type: String,
      required: true
    },
    threshold: {
      type: Number,
      required: true,
      min: 50,
      max: 500,
      default: 200
    },
    active: {
      type: Boolean,
      default: true
    },
    lastTriggeredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
