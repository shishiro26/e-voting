import { Queue, Worker } from 'bullmq';
import { defaultQueueConfig, redisConnection } from '../config/queue.js';
import logger from '../config/logger.js';
import prisma from '../config/db.js';

export const votingQueueName = 'voting';

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueConfig,
    delay: 500,
  },
});

logger.info(`Queue ${votingQueueName} created`);

export const handler = new Worker(
  votingQueueName,
  async (job) => {
    const { user_id, candidate_id, election_id } = job.data;
    try {
      await prisma.$transaction(async (prisma) => {
        // Increment candidate's votes
        await prisma.candidate.update({
          where: {
            id: candidate_id,
          },
          data: {
            votes: {
              increment: 1,
            },
          },
        });

        await prisma.vote.create({
          data: {
            user_id,
            candidate_id,
            election_id,
          },
        });
      });
      logger.info(`Vote successfully processed for user ${user_id} in election ${election_id}`);
    } catch (error) {
      logger.error(`Error processing vote for user ${user_id}:`, error);
      throw new Error('Error processing vote');
    }
  },
  {
    connection: redisConnection,
  }
);

handler.on('failed', (job, err) => {
  logger.error(`Job failed for user ${job.data.user_id}:`, err);
});

handler.on('completed', (job) => {
  logger.info(`Job completed for user ${job.data.user_id}`);
});
