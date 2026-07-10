import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import connectDatabase from './config/database';
import { initializeSocket } from './socket';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    initializeSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io ready`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
