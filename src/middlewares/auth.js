import env from '../config/env.js';
import { UN_AUTHENTICATED, UN_AUTHORIZED } from '../constants/index.js';
import AppError from '../utils/AppError.js';
import { extractUser } from '../utils/user.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    next(
      AppError(
        {
          message: 'No Authorization token found',
        },
        UN_AUTHORIZED
      )
    );
  }

  try {
    const decodedUser = extractUser(token, env.jwt.access_secret);
    req.user = decodedUser;
    return next();
  } catch (error) {
    next(
      new AppError(
        {
          message: 'Invalid token',
        },
        UN_AUTHENTICATED
      )
    );
  }
};
