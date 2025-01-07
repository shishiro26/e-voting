import prisma from '../config/db.js';

export const getUserById = async (id, fields = '') => {
  return await prisma.user.findUnique({
    where: { id: id },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
};

export const getUserByEmail = async (email, fields = '') => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: fields
      ? fields.split(' ').reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : undefined,
  });
  return user;
};

export const saveUser = async (payload) => {
  try {
    const user = await prisma.user.create({
      data: payload,
    });
    return user;
  } catch (err) {
    return err;
  }
};

export const updateUserById = async (id, payload) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return updatedUser;
};

export const assignRefreshToken = async (id, refreshToken) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: {
        create: { refresh_token: refreshToken },
      },
    },
    include: { refresh_token: true },
  });
  return updatedUser;
};

export const getSpecificDetailsUser = async (id, details) => {
  const userDetails = await prisma.user.findUnique({
    where: {
      id: id,
    },
    details,
  });

  return userDetails;
};

export const findUserByRefreshToken = async (id, refreshToken) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
      refresh_token: {
        some: {
          refresh_token: refreshToken,
        },
      },
    },
    include: {
      refresh_token: true,
    },
  });

  return user;
};

export const removeRefreshTokensUser = async (id) => {
  await prisma.refreshToken.deleteMany({
    where: { user_id: id },
  });

  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { refresh_token: true },
  });

  return user;
};

export const replaceRefreshTokenUser = async (id, oldRefreshToken, newRefreshToken) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: {
        updateMany: {
          where: {
            refresh_token: oldRefreshToken,
          },
          data: {
            refresh_token: newRefreshToken,
          },
        },
      },
    },
  });

  return updatedUser;
};

export const removeRefreshTokenUser = async (id, refreshToken) => {
  const tokenToDelete = await prisma.refreshToken.findFirst({
    where: {
      user_id: id,
      refresh_token: refreshToken,
    },
  });

  await prisma.refreshToken.delete({
    where: {
      id: tokenToDelete.id,
    },
  });

  const updatedUser = await prisma.user.findUnique({
    where: { id: id },
    include: { refresh_token: true },
  });

  return updatedUser;
};

export const assignEmailVerifyToken = async (id, token) => {
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      email_verify_token: token,
      token_send_at: Date.now(),
    },
  });
  return updatedUser;
};

export const removeVerifyToken = async (id) => {
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      email_verify_token: null,
      token_send_at: null,
    },
  });
  return updatedUser;
};

export const removeEmailVerifyToken = async (id) => {
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      email_verify_token: null,
      token_send_at: null,
      is_verified: true,
    },
  });
  return updatedUser;
};
