import { Queue, Worker } from 'bullmq';
import { defaultQueueConfig, redisConnection } from '../config/queue.js';
import logger from '../config/logger.js';
import { sendMail } from '../config/mail.js';

export const emailQueueName = 'email';

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

logger.info(`Queue ${emailQueueName} created`);

export const handler = new Worker(
  emailQueueName,
  async (job) => {
    const data = job.data;
    await sendMail(data.to, data.subject, data.html);
  },
  {
    connection: redisConnection,
  }
);
