import pool from '../db/index.js';
import { verifySolanaTransaction } from '../services/solanaService.js';

export async function connectWallet(req, res) {
    const userId = req.user?.id;
    const { address, walletName } = req.body;
    try {
        const existingWallet = await pool.query('SELECT 1 FROM wallet WHERE address = $1 AND user_id != $2', [address, userId]);
        if (existingWallet.rowCount > 0) return res.json({ success: false, message: 'This wallet address is already connected to another account' });

        const insertAddress = await pool.query('UPDATE wallet SET address = $1, wallet_name = $2 WHERE user_id = $3 RETURNING *', [address, walletName, userId]);
        res.json({ insertedAddress: insertAddress.rows[0], success: true });
    } catch (error) {
        console.error('error on connecting wallet ', error.message);
        res.json({ success: false, message: 'Failed to connect wallet' });
    }
}

export async function disconnectWallet(req, res) {
    const userId = req.user?.id;
    try {
        await pool.query('UPDATE wallet SET address = $1, wallet_name = $2 WHERE user_id = $3 RETURNING *', [null, null, userId]);
        res.json({ success: true });
    } catch (error) {
        console.error('error on disconnecting wallet ', error.message);
        res.json({ message: 'Failed to disconnect wallet', success: false });
    }
}

export async function getWalletAddress(req, res) {
    const userId = req.user?.id;
    try {
        const userWallet = await pool.query('SELECT address from wallet WHERE user_id = $1', [userId]);
        res.json({ address: userWallet.rows[0]?.address || null });
    } catch (error) {
        console.error('error on getting user wallet address for mobile ', error.message);
        res.status(500).json({ success: false });
    }
}

export async function verifyTransaction(req, res) {
    const { signature, reference, amount, taskId, reward } = req.body;
    const userId = req.user?.id;

    try {
        const result = await verifySolanaTransaction({ signature, reference, amount });
        if (!result.success) return res.status(400).json({ success: false, message: result.message });

        const fromPubkey = result.data.from;
        await pool.query('INSERT INTO completed_investment (user_id, task_id, address, reward_point) VALUES ($1,$2,$3,$4)', [userId, taskId, fromPubkey, reward]);
        await pool.query('UPDATE users SET point = point + $1 WHERE id = $2', [reward, userId]);

        return res.status(200).json({ success: true, message: 'Transaction verified' });
    } catch (err) {
        console.error('Verification error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error verifying transaction' });
    }
}

export default { connectWallet, disconnectWallet, getWalletAddress, verifyTransaction };
