import { INTERNAL_SERVER, BAD_REQUEST, NOT_FOUND } from '../constants/index.js';
import AppError from '../utils/AppError.js';
import {
  addCandidateSchema,
  approveCandidateSchema,
  createElectionSchema,
  rejectCandidateSchema,
} from '../validations/election.validation.js';
import {
  approve_candidate,
  getCandidateById,
  getCandidateByUserId,
  getElectionById,
  queryCandidates,
  reject_candidate,
  saveCandidate,
  saveElection,
} from '../services/election.services.js';
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
    const { id: user_id, college_id } = req.user;

    const candidate = await getCandidateByUserId(user_id, election_id, 'id status');
    console.log('Candidate', candidate);
    if (candidate && candidate.id) {
      if (candidate.status === 'pending') {
        return next(new AppError('Your candidate request is pending', BAD_REQUEST));
      }
      if (candidate.status === 'rejected') {
        return next(new AppError('Your candidate request is rejected', BAD_REQUEST));
      }
      return next(new AppError('You are already a candidate', BAD_REQUEST));
    }

    const user = await getUserById(user_id, 'email first_name last_name');

    const college = await getCollegeById(college_id, 'email');
    if (!college) {
      return next(new AppError('College not found', NOT_FOUND));
    }

    const election = await getElectionById(election_id, 'start_date end_date');

    if (!election) {
      return next(new AppError('Election not found', NOT_FOUND));
    }

    const currentDate = new Date().toLocaleDateString('en-In', { timeZone: 'Asia/Kolkata' });
    const startDate = new Date(election.start_date).toLocaleDateString();
    const endDate = new Date(election.end_date).toLocaleDateString();

    if (startDate > currentDate || endDate < currentDate) {
      return next(new AppError('Election is not active', BAD_REQUEST));
    }

    const payload = {
      election_id,
      user_id: user_id,
      tagline,
    };
    saveCandidate(payload)
      .then(async (candidate) => {
        const candidate_html = await renderEmailEjs('emails/election/candidate-mail', {
          candidateName: `${user.first_name} ${user.last_name}`,
          tagline,
          supportEmail: college.email,
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
          html: candidate_html,
        });

        emailQueue.add(emailQueueName, {
          to: college.email,
          subject: 'New candidate registered - E voting',
          html: admin_html,
        });

        return res.status(201).json({
          message: 'Candidate added successfully',
          data: candidate,
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  } catch (error) {
    console.log('I am in this error', error);
    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }
    logger.error('Error in adding candidate', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const approveCandidate = async (req, res, next) => {
  try {
    const { candidate_id } = approveCandidateSchema.parse(req.body);
    const candidate = await getCandidateById(candidate_id, 'user_id status');

    if (!candidate) {
      return next(new AppError('Candidate not found', NOT_FOUND));
    }

    if (candidate.status === 'approved') {
      return next(new AppError('Candidate already approved', BAD_REQUEST));
    }

    if (candidate.status === 'rejected') {
      return next(new AppError('Candidate already rejected', BAD_REQUEST));
    }

    const approved = await approve_candidate(candidate_id);

    if (!approved) {
      return next(new AppError('Candidate not approved', BAD_REQUEST));
    }
    console.log('Approved User', approved);
    const html = await renderEmailEjs('emails/election/approve-candidate-mail', {
      candidateName: `${approved.user.first_name} ${approved.user.last_name}`,
      startDate: new Date(approved.election.start_date).toLocaleDateString(),
      endDate: new Date(approved.election.end_date).toLocaleDateString(),
    });

    emailQueue.add(emailQueueName, {
      to: approved.user.email,
      subject: 'Candidate approved - E voting',
      html,
    });

    return res.status(200).json({
      message: 'Candidate approved successfully',
    });
  } catch (error) {
    console.log('This is the error', error);
    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }
    logger.error('Error in approving candidate', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const rejectCandidate = async (req, res, next) => {
  try {
    const { candidate_id } = rejectCandidateSchema.parse(req.body);
    const candidate = await getCandidateById(candidate_id, 'user_id status');

    if (!candidate) {
      return next(new AppError('Candidate not found', NOT_FOUND));
    }

    if (candidate.status === 'approved') {
      return next(new AppError('Candidate already approved', BAD_REQUEST));
    }

    if (candidate.status === 'rejected') {
      return next(new AppError('Candidate already rejected', BAD_REQUEST));
    }

    const rejected = await reject_candidate(candidate_id);

    if (!rejected) {
      return next(new AppError('Candidate not rejected', BAD_REQUEST));
    }

    const html = await renderEmailEjs('emails/election/reject-candidate-mail', {
      candidateName: `${rejected.user.first_name} ${rejected.user.last_name}`,
    });

    emailQueue.add(emailQueueName, {
      to: rejected.user.email,
      subject: 'Candidate rejected - E voting',
      html,
    });

    return res.status(200).json({
      message: 'Candidate rejected successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      const formattedError = formatError(error);
      return next(new AppError(formattedError, BAD_REQUEST));
    }
    logger.error('Error in rejecting candidate', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const getPendingCandidates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;
    const { college_id } = req.user;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortBy,
    };

    const filter = {
      status: 'pending',
      election: {
        college_id,
      },
    };

    const result = await queryCandidates(filter, options);

    return res.status(200).send({
      page: result.page,
      limit: result.limit,
      total: result.totalResults,
      data: result.results,
    });
  } catch (error) {
    console.log('I am in this error', error);
    logger.error('Error in getting pending candidates', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
