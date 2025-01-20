import express from 'express';
import {
  addCandidate,
  approveCandidate,
  createElection,
  rejectCandidate,
} from '../controller/election.controller.js';
import { isAdmin, isUser, verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create_election', verifyToken, isAdmin, createElection);
router.post('/add_candidate', verifyToken, isUser, addCandidate);
router.put('/approve_candidate', verifyToken, isAdmin, approveCandidate);
router.put('/reject_candidate', verifyToken, isAdmin, rejectCandidate);

export default router;
