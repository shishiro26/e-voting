import env from '../config/env.js';
import { UN_AUTHENTICATED, UN_AUTHORIZED } from '../constants/index.js';
import { extractUser } from '../utils/user.js';
import cookie from 'cookie';
import AppError from '../utils/AppError.js';

export const verifySocketToken = async (socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie);
  const token = cookies['access_token'];

  if (!token) {
    return next(new AppError({ message: 'No Authorization token found' }, UN_AUTHORIZED));
  }

  try {
    const decodedUser = await extractUser(token, env.jwt.access_secret);
    socket.user = decodedUser;
    next();
  } catch (error) {
    return next(new AppError({ message: 'Invalid token' }, UN_AUTHENTICATED));
  }
};
