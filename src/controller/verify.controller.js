import { INTERNAL_SERVER, BAD_REQUEST } from '../constants/index.js';
import { emailQueue, emailQueueName } from '../jobs/email.queue.js';
import {
  getUserByEmail,
  removeEmailVerifyToken,
  removeVerifyToken,
  saveUser,
} from '../services/auth.services.js';
import {
  getCollegeByEmail,
  removeCollegeToken,
  removeCollegeVerifyToken,
} from '../services/college.services.js';
import AppError from '../utils/AppError.js';
import { checkTimeDifference, generateId, renderEmailEjs } from '../utils/helper.js';
import { generatePassword } from '../utils/user.js';
import { verifyEmailSchema } from '../validations/auth.validation.js';
import env from '../config/env.js';
import prisma from '../config/db.js';

export const verifyEmail = async (req, res, next) => {
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

      await removeEmailVerifyToken(user.id, token);

      return res.redirect('https://shishiro.pages.dev');
    }
  } catch (error) {
    console.log('error', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const verifyCollegeEmail = async (req, res, next) => {
  try {
    const { email, token } = verifyEmailSchema.parse(req.query);

    const college = await getCollegeByEmail(email, 'id email email_verify_token token_send_at');
    const token_gap = checkTimeDifference(college.token_send_at);

    if (token_gap > 86400000) {
      await removeCollegeToken(college.id);
      return next(new AppError('Token expired', BAD_REQUEST));
    }

    if (college) {
      if (token !== college.email_verify_token) {
        return next(new AppError('Invalid Token', BAD_REQUEST));
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.college.update({
          where: {
            id: college.id,
          },
          data: {
            email_verify_token: null,
            token_send_at: null,
          },
        });

        const id = generateId();
        const verify_token = await generatePassword(id);
        const url = `${env.base_url}/api/v1/auth/create_admin/?email=${email}&token=${verify_token}`;
        await prisma.user.create({
          data: {
            email,
            role: 'admin',
            email_verify_token: verify_token,
            token_send_at: new Date().toISOString(),
          },
        });

        const html = await renderEmailEjs('emails/create-user', {
          name: `${college.name}`,
          url: url,
        });

        await emailQueue.add(emailQueueName, {
          to: email,
          subject: 'Verify your email address - E-voting',
          html: html,
        });

        return res.sendStatus(200);
      });
    }
  } catch (error) {
    console.log('I am in this', error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
