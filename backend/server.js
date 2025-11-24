import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import "dotenv/config";
import cors from 'cors';
import config from './config/index.js';
import configurePassport from './config/passport.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import walletRoutes from './routes/wallet.js';
import tasksRoutes from './routes/tasks.js';
import { startCronJobs } from './jobs/cronJobs.js';

const app = express();

app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Credentials', 'true'); next(); });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

// Configure passport strategies
configurePassport();

// Mount routes
app.use('/', authRoutes);
app.use('/', usersRoutes);
app.use('/', walletRoutes);
app.use('/', tasksRoutes);

// Start cron jobs
startCronJobs();

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Error handler
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).send('Something broke!'); });

app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${config.PORT}`);
});