import mongoose from 'mongoose';

const aqiReadingSchema = new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
      index: true
    },
    cityName: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    pollutants: {
      pm25: Number,
      pm10: Number,
      no2: Number,
      so2: Number,
      co: Number,
      o3: Number
    },
    subIndices: {
      type: Map,
      of: Number
    },
    aqi: {
      type: Number,
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'],
      required: true
    },
    dominantPollutant: {
      type: String,
      default: 'PM2.5'
    },
    source: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['observed', 'forecast'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for timeseries city range queries
aqiReadingSchema.index({ city: 1, timestamp: -1 });

// TTL index to automatically purge entries after 90 days
aqiReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.models.AQIReading || mongoose.model('AQIReading', aqiReadingSchema);
