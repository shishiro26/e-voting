import express from 'express';
import { addCandidate, createElection } from '../controller/election.controller.js';
import { isAdmin, isUser, verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create_election', verifyToken, isAdmin, createElection);
router.post('/add_candidate', verifyToken, isUser, addCandidate);

export default router;
