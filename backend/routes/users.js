import express from 'express';
import { verifyAccessToken } from '../middlewares/auth.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/dashboard', verifyAccessToken, userController.dashboard);
router.get('/leaderboard', verifyAccessToken, userController.leaderboard);
router.get('/get-telegramId', verifyAccessToken, userController.getTelegramId);
router.get('/get-referral-bonus', verifyAccessToken, userController.getReferralBonus);

export default router;
