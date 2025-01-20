import prisma from '../config/db.js';
import { paginate } from '../plugins/paginate.js';

export const saveElection = async (payload) => {
  try {
    console.log('payload', payload);
    const election = await prisma.election.create({
      data: payload,
    });
    return election;
  } catch (error) {
    return error;
  }
};

export const updateElection = async (id, payload) => {
  try {
    const election = await prisma.election.update({
      where: { id: id },
      data: payload,
    });
    return election;
  } catch (error) {
    return error;
  }
};

export const getElectionById = async (id, fields = '') => {
  const election = await prisma.election.findUnique({
    where: { id: id },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return election;
};

export const saveCandidate = async (payload) => {
  console.log('payload', payload);
  try {
    const candidate = await prisma.candidate.create({
      data: payload,
    });
    return candidate;
  } catch (error) {
    return error;
  }
};

export const approve_candidate = async (id) => {
  const candidate = await prisma.candidate.update({
    where: { id: id },
    data: { status: 'approved' },
    include: {
      user: true,
      election: true,
    },
  });
  return candidate;
};

export const reject_candidate = async (id) => {
  const candidate = await prisma.candidate.update({
    where: { id: id },
    data: { status: 'rejected' },
    include: {
      election: true,
      user: true,
    },
  });
  return candidate;
};

export const getCandidateByUserId = async (user_id, election_id, fields = '') => {
  const candidate = await prisma.candidate.findFirst({
    where: { user_id: user_id, election_id: election_id },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return candidate;
};

export const getCandidateById = async (id, fields = '') => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: id },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return candidate;
};

export const countApprovedCandidates = async (election_id) => {
  const candidateCount = await prisma.candidate.count({
    where: {
      election_id: election_id,
      status: 'approved',
    },
  });
  return candidateCount;
};

export const queryCandidates = async (filter, options) => {
  const candidates = paginate('candidate', filter, options);
  return candidates;
};

export const getVoteByUserIdAndElectionId = async (user_id, election_id) => {
  const vote = await prisma.vote.findFirst({
    where: { user_id: user_id, election_id: election_id },
  });
  return vote;
};
