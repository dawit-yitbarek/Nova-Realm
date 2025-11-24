import express from 'express';
import { verifyAccessToken } from '../middlewares/auth.js';
import walletController from '../controllers/walletController.js';

const router = express.Router();

router.post('/connect-wallet', verifyAccessToken, walletController.connectWallet);
router.post('/disconnect-wallet', verifyAccessToken, walletController.disconnectWallet);
router.get('/get-wallet-address', verifyAccessToken, walletController.getWalletAddress);
router.post('/verify-transaction', verifyAccessToken, walletController.verifyTransaction);

export default router;
