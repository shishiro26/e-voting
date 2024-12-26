import express from 'express';
import {
  createUser,
  loginUser,
  logOut,
  refreshTokenSets,
  verifyEmail,
} from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/login', loginUser);
router.get('/refresh', refreshTokenSets);
router.get('/log-out', logOut);
router.post('/verify/email/', verifyEmail);

export default router;
