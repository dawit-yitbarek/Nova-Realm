import express from 'express';
import { verifyAccessToken } from '../middlewares/auth.js';
import tasksController from '../controllers/tasksController.js';

const router = express.Router();

router.get('/user-task', verifyAccessToken, tasksController.userTask);
router.get('/investment-tasks', verifyAccessToken, tasksController.investmentTasks);
router.get('/referral-tasks', verifyAccessToken, tasksController.referralTasks);
router.post('/complete-task', verifyAccessToken, tasksController.completeTask);
router.post('/claim-daily-reward', verifyAccessToken, tasksController.claimDailyReward);

export default router;
