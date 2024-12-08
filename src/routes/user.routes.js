import express from 'express';
import { isAdmin, verifyToken } from '../middlewares/auth.js';
import { getStaff, getUsers } from '../controller/user.controller.js';

const router = express.Router();
//admin
router.get('/get-users/', verifyToken, isAdmin, getUsers);

// staff 
router.get('/get-staff/', verifyToken, isAdmin, getStaff);

export default router;
