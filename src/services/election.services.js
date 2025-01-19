import prisma from '../config/db.js';

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
  try {
    const candidate = await prisma.candidate.create({
      data: payload,
    });
    return candidate;
  } catch (error) {
    return error;
  }
};
