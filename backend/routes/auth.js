import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import { registerLimiter } from '../middlewares/rateLimiter.js';
import configurePassport from '../config/passport.js';
import config from '../config/index.js';

const router = express.Router();

// Ensure passport strategies configured
configurePassport();

router.post('/register', registerLimiter, authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/signin', authController.signin);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/send-reset-otp', authController.sendResetOtp);
router.post('/reset-password', authController.resetPassword);

router.get('/auth/google', authController.startGoogleAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/dashboard', passport.authenticate('google', { session: false, failureRedirect: `${config.FRONTEND_URL}/signin` }), authController.googleCallback);

export default router;