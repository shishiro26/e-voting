import { Server } from 'socket.io';
import app from './config/app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import prisma from './config/db.js';

let server = null;
let io = null;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Prisma connected to database');

    server = app.listen(env.port, () => {
      logger.info(`Server started at http://localhost:${env.port}`);
    });

    io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    logger.info('Socket.io server started');
  } catch (err) {
    logger.error(`An error occurred connecting to DB: ${err.message}`);
    process.exit(1);
  }
};

// Global error handling
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  exitHandler();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  exitHandler();
});

// Graceful shutdown
const exitHandler = async () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }

  try {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected');
  } catch (err) {
    logger.error(`Error disconnecting Prisma: ${err.message}`);
  }
};

export { io };
startServer();
export default prisma;
