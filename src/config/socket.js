import logger from './logger.js';
import { getUserById } from '../services/auth.services.js';
import {
  getElectionById,
  getCandidateById,
  getVoteByUserIdAndElectionId,
} from '../services/election.services.js';
import { votingQueue, votingQueueName } from '../jobs/voting.queue.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info('User connected', socket.id);
    socket.on('disconnect', () => {
      logger.info('User disconnected', socket.id);
    });

    const { id, college_id } = socket.user;

    socket.on('vote', async (vote_data) => {
      try {
        const { candidate_id, election_id } = vote_data;
        const user = await getUserById(id, 'id college_id');

        if (user.college_id !== college_id) {
          socket.emit('error', { message: 'User does not belong to college' });
          return;
        }

        const vote = await getVoteByUserIdAndElectionId(id, election_id);

        if (vote) {
          socket.emit('error', { message: 'You have already voted' });
          return;
        }

        const election = await getElectionById(election_id);

        if (!election) {
          socket.emit('error', { message: 'Election not found' });
          return;
        }

        if (!election.active) {
          socket.emit('error', { message: 'Election is not active' });
          return;
        }

        const candidate = await getCandidateById(candidate_id);

        if (!candidate) {
          socket.emit('error', { message: 'Candidate not found' });
          return;
        }

        await votingQueue.add(votingQueueName, {
          user_id: id,
          candidate_id,
          election_id,
        });

        socket.emit('vote-success', { message: 'Voting successful' });
        socket.disconnect();
      } catch (error) {
        logger.error('Error in voting in websocket', error);
        socket.emit('vote-error', { message: 'Error in voting in websocket' });
      }
    });
  });
};
