import { app } from './app';
import { config } from './config/env';
import { prisma } from './utils/prisma';

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log(' Successfully connected to PostgreSQL database via Prisma');

    const server = app.listen(config.port, () => {
      console.log(` MiniLedger Backend Server is running on port ${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Local URL: http://localhost:${config.port}`);
      console.log(` Health check: http://localhost:${config.port}/api/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\nShutting down MiniLedger server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('PostgreSQL disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(' Failed to start MiniLedger server:', error);
    process.exit(1);
  }
}

startServer();
