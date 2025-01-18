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
  try {
    const college = await prisma.college.create({
      data: payload,
    });
    return college;
  } catch (err) {
    return err;
  }
};
