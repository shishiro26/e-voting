import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import * as path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import logger from './logger.js';

import authRoutes from '../routes/auth.routes.js';
import adminRoutes from '../routes/user.routes.js';
import collegeRoutes from '../routes/college.routes.js';
import verifyRoutes from '../routes/verify.routes.js';
import electionRoutes from '../routes/election.routes.js';
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views'));

app.get('/', (req, res) => {
  return res.render('home');
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/college', collegeRoutes);
app.use('/api/v1/verify', verifyRoutes);
app.use('/api/v1/election', electionRoutes);

export default app;
