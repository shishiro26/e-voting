import express from 'express';
import {
  createUser,
  loginUser,
  logOut,
  refreshTokenSets,
  verifyEmail,
} from '../controller/auth.controller.js';
import { getUserDetails } from '../controller/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/login', loginUser);
router.get('/refresh', refreshTokenSets);
router.get('/log-out', logOut);
router.post('/verify/email/', verifyEmail);
router.get('/get-user/', verifyToken, getUserDetails);

export default router;
