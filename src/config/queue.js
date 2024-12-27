import IORedis from 'ioredis';
import env from './env.js';

export const redisConnection = new IORedis(env.redis.host, {
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
