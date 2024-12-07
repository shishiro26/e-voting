import mongoose from 'mongoose';

import app from './config/app.js';
import env from './config/env.js';
import logger from './config/logger.js';

let server = null;

mongoose
  .connect(env.mongo.uri)
  .then(() => {
    logger.info('MongoDB connected');

    server = app.listen(env.port, () => {
      logger.info(`Server started at http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    logger.error(`An error occurred connecting to DB: ${err}`);
  });

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  exitHandler();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  exitHandler();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
