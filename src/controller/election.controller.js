import { INTERNAL_SERVER, BAD_REQUEST } from '../constants/index.js';
import AppError from '../utils/AppError.js';
import { addCandidateSchema, createElectionSchema } from '../validations/election.validation.js';
import { getElectionById, saveElection } from '../services/election.services.js';
import { getCollegeById } from '../services/college.services.js';
import { getUserById } from '../services/auth.services.js';
import { formatError } from '../utils/user.js';
import logger from '../config/logger.js';
import { renderEmailEjs } from '../utils/helper.js';
import { emailQueue, emailQueueName } from '../jobs/email.queue.js';

export const createElection = async (req, res, next) => {
  try {
    const { title, description, start_date, end_date } = createElectionSchema.parse(req.body);
    const college_id = req.user.college_id;

    const college = await getCollegeById(college_id);
    if (!college) {
      return next(new AppError('College not found', INTERNAL_SERVER));
    }

    const payload = {
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      college_id,
    };

    saveElection(payload).then((election) => {
      return res.status(201).json({
        message: 'Election created successfully',
        data: election,
      });
    });
  } catch (error) {
    console.log('I am in this error', error);
    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }
    logger.error('Error in creating election', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const addCandidate = async (req, res, next) => {
  try {
    const { election_id, tagline } = addCandidateSchema.parse(req.body);
    const { id, college_id } = req.user;

    const user = await getUserById(id, 'email first_name last_name');

    const college = await getCollegeById(college_id, 'email');
    if (!college) {
      return next(new AppError('College not found', INTERNAL_SERVER));
    }

    const election = await getElectionById(election_id, 'start_date end_date');

    if (!election) {
      return next(new AppError('Election not found', INTERNAL_SERVER));
    }

    const currentDate = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (startDate > currentDate || endDate < currentDate) {
      return next(new AppError('Election is not active', BAD_REQUEST));
    }

    const payload = {
      election_id,
      user_id: id,
      tagline,
    };
    saveElection(payload).then(async (candidate) => {
      const candidate_html = await renderEmailEjs('emails/election/candidate-mail', {
        candidateName: `${user.first_name} ${user.last_name}`,
        tagline,
      });

      const admin_html = await renderEmailEjs('emails/election/admin-mail', {
        candidateName: `${user.first_name} ${user.last_name}`,
        candidateEmail: user.email,
        candidateTagline: tagline,
        supportEmail: college.email,
        adminDashboardUrl: 'http://localhost:3000/',
      });

      emailQueue.add(emailQueueName, {
        to: user.email,
        subject: 'Thank you for registering as a candidate - E voting',
        supportEmail: college.email,
        candidate_html,
      });

      emailQueue.add(emailQueueName, {
        to: college.email,
        subject: 'New candidate registered - E voting',
        candidate_html: admin_html,
      });

      return res.status(201).json({
        message: 'Candidate added successfully',
        data: candidate,
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }
    logger.error('Error in adding candidate', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
