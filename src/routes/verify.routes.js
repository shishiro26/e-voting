import express from 'express';
import { verifyEmail, verifyCollegeEmail } from '../controller/verify.controller.js';

const router = express.Router();

router.get('/email', verifyEmail);
router.get('/college_email', verifyCollegeEmail);

export default router;
