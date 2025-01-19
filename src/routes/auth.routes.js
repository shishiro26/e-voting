import express from 'express';
import {
  createAdmin,
  createUser,
  loginUser,
  logOut,
  refreshTokenSets,
} from '../controller/auth.controller.js';
import { getUserDetails } from '../controller/user.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/login', loginUser);
router.get('/refresh', refreshTokenSets);
router.get('/log-out', logOut);
router.get('/get-user/', verifyToken, getUserDetails);
router.post('/create_admin', createAdmin);

export default router;
