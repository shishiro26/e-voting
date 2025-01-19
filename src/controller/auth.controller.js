import AppError from '../utils/AppError.js';
import { extractUser, generatePassword, generateTokenSet, checkPassword } from '../utils/user.js';

import { BAD_REQUEST, INTERNAL_SERVER, UN_AUTHORIZED } from '../constants/index.js';
import env from '../config/env.js';
import { handleRefreshTokenError, refreshTokenReuseDetection } from '../utils/auth.js';
import {
  assignRefreshToken,
  removeRefreshTokenUser,
  replaceRefreshTokenUser,
  saveUser,
  getUserByEmail,
  removeVerifyToken,
  updateUserById,
} from '../services/auth.services.js';
import {
  adminSchema,
  loginSchema,
  registerSchema,
  verifyEmailSchema,
} from '../validations/auth.validation.js';
import { checkTimeDifference, formatError, generateId, renderEmailEjs } from '../utils/helper.js';
import { emailQueue, emailQueueName } from '../jobs/email.queue.js';
import { getCollegeByName } from '../services/college.services.js';
import logger from '../config/logger.js';

export const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, role, password, college_name } = registerSchema.parse(
      req.body
    );

    const college = await getCollegeByName(college_name, 'id name suffix_email');

    if (!college) {
      return next(new AppError('College does not exist', BAD_REQUEST));
    }

    const isUser = await getUserByEmail(email);
    if (isUser) {
      return next(new AppError('User already exists', BAD_REQUEST));
    }

    if (email.split('@')[1] !== college.suffix_email) {
      return next(new AppError('Email does not belong to the college', BAD_REQUEST));
    }

    const hashedPassword = await generatePassword(password);
    const id = generateId();
    const verify_token = await generatePassword(id);
    const url = `${env.base_url}/api/v1/verify/email/?email=${email}&token=${verify_token}`;

    const user = {
      first_name,
      last_name,
      email,
      role,
      password: hashedPassword,
      email_verify_token: verify_token,
      token_send_at: new Date().toISOString(),
      college_id: college.id,
    };

    saveUser(user)
      .then(async (savedUser) => {
        const html = await renderEmailEjs('emails/verify-mail', {
          name: `${first_name} ${last_name}`,
          url: url,
        });
        await emailQueue.add(emailQueueName, {
          to: email,
          subject: 'Verify your email address - E-voting',
          html: html,
        });
        return res.status(201).send({
          message: 'Account Created Successfully!',
          data: savedUser,
        });
      })
      .catch((error) => {
        return next(new AppError('Something went wrong', INTERNAL_SERVER));
      });
  } catch (error) {
    if (error instanceof Error) {
      const error = formatError(error);
      return next(new AppError(error, BAD_REQUEST));
    }
    logger.error('Error while creating User', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await getUserByEmail(email, 'id email role password college_id');

    if (!user) {
      return next(new AppError('User does not exist', BAD_REQUEST));
    }

    if (!(await checkPassword(password, user.password))) {
      return next(new AppError('Email or Password is incorrect', BAD_REQUEST));
    }

    const { accessToken, refreshToken } = generateTokenSet({
      id: user.id,
      email: user.email,
      role: user.role,
      college_id: user.college_id,
    });

    await assignRefreshToken(user.id, refreshToken);

    res.cookie('accessToken', accessToken, {
      maxAge: env.jwt.accessExpirationMinutes * 60 * 1000,
      secure: env.env === 'PRODUCTION' ? true : false,
      httpOnly: true,
      samesite: 'none',
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: env.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
      secure: env.env === 'PRODUCTION' ? true : false,
      httpOnly: true,
      samesite: 'none',
    });

    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error while logging in', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const refreshTokenSets = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.clearCookie('refreshToken');
      return next(new AppError('No refresh token found', UN_AUTHORIZED));
    }

    const decodedUser = await extractUser(refreshToken, env.jwt.refresh_secret);
    req.user = decodedUser;

    const isHacker = await refreshTokenReuseDetection(decodedUser, refreshToken, res, next);
    if (isHacker) {
      return next(new AppError('Potential breach detected', UN_AUTHORIZED));
    }

    const tokenSet = generateTokenSet({
      id: decodedUser.id,
      email: decodedUser.email,
      role: decodedUser.role,
      college_id: decodedUser.college_id,
    });

    const updatedRefreshToken = await replaceRefreshTokenUser(
      decodedUser.id,
      refreshToken,
      tokenSet.refreshToken
    );

    if (updatedRefreshToken) {
      res.cookie('accessToken', tokenSet.accessToken, {
        maxAge: env.jwt.accessExpirationMinutes * 60 * 1000,
        secure: env.env === 'PRODUCTION' ? true : false,
        httpOnly: true,
        samesite: 'none',
      });

      res.cookie('refreshToken', tokenSet.refreshToken, {
        maxAge: env.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
        secure: env.env === 'PRODUCTION' ? true : false,
        httpOnly: true,
        samesite: 'none',
      });

      return res.sendStatus(201);
    }
  } catch (error) {
    logger.error('Error while generating the refresh token sets', error);
    return handleRefreshTokenError(error, req, res, next);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { email, token } = verifyEmailSchema.parse(req.query);
    const user = await getUserByEmail(email, 'id email email_verify_token token_send_at');

    const token_gap = checkTimeDifference(user.token_send_at);
    if (token_gap > 86400000) {
      await removeVerifyToken(user.id);
      return next(new AppError('Token expired', BAD_REQUEST));
    }

    if (user) {
      if (token !== user.email_verify_token) {
        return next(new AppError('Invalid Token', BAD_REQUEST));
      }
      const { first_name, last_name, password } = adminSchema.parse(req.body);
      const hashedPassword = await generatePassword(password);

      const updatedUser = await updateUserById(user.id, {
        first_name,
        last_name,
        password: hashedPassword,
        email_verify_token: null,
        token_send_at: null,
      });

      if (updatedUser) {
        const { accessToken, refreshToken } = generateTokenSet({
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          college_id: updatedUser.college_id,
        });

        await assignRefreshToken(updatedUser.id, refreshToken);

        res.cookie('accessToken', accessToken, {
          maxAge: env.jwt.accessExpirationMinutes * 60 * 1000,
          secure: env.env === 'PRODUCTION' ? true : false,
          httpOnly: true,
          samesite: 'none',
        });

        res.cookie('refreshToken', refreshToken, {
          maxAge: env.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
          secure: env.env === 'PRODUCTION' ? true : false,
          httpOnly: true,
          samesite: 'none',
        });

        return res.sendStatus(201);
      }
    }
  } catch (error) {
    console.log('Error in this', error);
    logger.error('Error while creating the admin', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError('No Refresh Token Found', UN_AUTHORIZED));
    }

    const decodedUser = await extractUser(refreshToken, env.jwt.refresh_secret);

    const isHacker = await refreshTokenReuseDetection(decodedUser, refreshToken, res);
    if (isHacker) {
      return next(new AppError('Potential breach detected', UN_AUTHORIZED));
    }

    await removeRefreshTokenUser(decodedUser.id, refreshToken);
    return res.sendStatus(204);
  } catch (error) {
    return handleRefreshTokenError(error, req, res, next);
  }
};
