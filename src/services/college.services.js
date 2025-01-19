import prisma from '../config/db.js';

export const getCollegeByName = async (name, fields = '') => {
  const college = await prisma.college.findUnique({
    where: { name: name },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return college;
};

export const getCollegeById = async (id, fields = '') => {
  const college = await prisma.college.findUnique({
    where: { id: id },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return college;
};

export const saveCollege = async (payload) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const college = await prisma.college.create({
        data: payload,
      });
      return college;
    } catch (err) {
      return err;
    }
  });
  return transaction;
};

export const updateCollege = async (id, payload) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const college = await prisma.college.update({
        where: { id: id },
        data: payload,
      });
      return college;
    } catch (err) {
      return err;
    }
  });
  return transaction;
};

export const getCollegeByEmail = async (email, fields = '') => {
  const college = await prisma.college.findUnique({
    where: { email: email },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return college;
};

export const removeCollegeToken = async (id) => {
  const college = await prisma.college.update({
    where: {
      id: id,
    },
    data: {
      email_verify_token: null,
      token_send_at: null,
    },
  });
  return college;
};

export const removeCollegeVerifyToken = async (id) => {
  const college = await prisma.college.update({
    where: {
      id: id,
    },
    data: {
      email_verify_token: null,
      token_send_at: null,
    },
  });
  return college;
};
