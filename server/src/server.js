import app from './app.js';
import { connectDB } from './config/db.js';
import { initCronJobs } from './services/cronService.js';

const PORT = process.env.PORT || 5000;

// Initialize Database connection & Background tasks
connectDB();
initCronJobs();

const server = app.listen(PORT, () => {
  console.log(`🚀 AirWatch API Server running on port ${PORT}`);
  console.log(`📊 CPCB Indian AQI Standard Engine Active`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
