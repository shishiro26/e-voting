import express from 'express';
import { addCollege } from '../controller/college.controller.js';

const router = express.Router();

router.post('/add', addCollege);

export default router;
