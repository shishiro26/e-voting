import express from 'express';
import { createUser, loginUser, logOut, refreshTokenSets } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/login', loginUser);
router.get('/refresh', refreshTokenSets);
router.get('/log-out', logOut);

export default router;
