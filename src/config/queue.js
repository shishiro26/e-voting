import IORedis from 'ioredis';
import env from './env.js';

export const redisConnection = new IORedis({
  host: env.redis.host,
  port: env.redis.port,
  maxLoadingRetryTime: null,
  maxRetriesPerRequest: null,
});

export const defaultQueueConfig = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};
