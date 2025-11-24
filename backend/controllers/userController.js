import pool from '../db/index.js';
import config from '../config/index.js';

export async function dashboard(req, res) {
    const userId = req.user?.id;
    try {
        const user = await pool.query(
            `SELECT users.*, daily_reward.claimed, daily_reward.streak
       FROM users
       JOIN daily_reward ON users.id = daily_reward.user_id
       WHERE users.id = $1`,
            [userId]
        );

        if (user.rowCount === 0) return res.json({ message: 'User not found', success: false });
        const result = user.rows[0];
        result.success = true;
        res.json(result);
    } catch (err) {
        console.error('Error in dashboard:', err.message);
        res.status(500).json({ message: 'Invalid token', success: false });
    }
}

export async function leaderboard(req, res) {
    const userId = req.user?.id;
    try {
        const leaderboard = await pool.query(`SELECT id, name, point, avatar_url, RANK() OVER (ORDER BY point DESC) AS rank FROM users ORDER BY point DESC LIMIT 10`);
        const currentUserRank = await pool.query(`SELECT * FROM ( SELECT id, name, point, avatar_url, RANK() OVER (ORDER BY point DESC) AS rank FROM users ) ranked WHERE id = $1`, [userId]);

        if (currentUserRank.rowCount === 0) {
            res.clearCookie('refreshToken', config.CLEAR_COOKIE_OPTIONS);
            return res.json({ message: 'User not found', success: false });
        }

        const topThree = leaderboard.rows.slice(0, 3);
        const others = leaderboard.rows.slice(3, 10);
        const currentUser = currentUserRank.rows[0];

        res.json({ message: 'Leaderboard fetched successfully', success: true, topThree, others, currentUser });
    } catch (err) {
        console.error('Error in leaderboard:', err.message);
        res.status(500).json({ message: 'failed to fetch leaderboard', success: false });
    }
}

export async function getTelegramId(req, res) {
    const userId = req.user?.id;
    try {
        const telegramId = await pool.query('SELECT telegram_id FROM users WHERE id = $1', [userId]);
        if (!telegramId.rows[0]?.telegram_id) return res.json({ message: 'Not connected to telegram ', success: false });
        res.json({ telegramId: telegramId.rows[0].telegram_id, success: true });
    } catch (err) {
        console.error('Error getting telegram id:', err.message);
        res.status(500).json({ message: 'Invalid token or database', success: false });
    }
}

export async function getReferralBonus(req, res) {
    const userId = req.user?.id;
    try {
        const user = await pool.query('SELECT referral_code FROM users WHERE id = $1', [userId]);
        const referedFriends = await pool.query('SELECT point FROM users WHERE invited_by = $1', [user.rows[0].referral_code]);
        const bonusTable = await pool.query('SELECT previous_total FROM referral_bonus WHERE user_id = $1', [userId]);

        let total = 0;
        for (let friend of referedFriends.rows) total += friend.point;

        const previous_total = bonusTable.rows[0]?.previous_total || 0;
        const currentTotal = total - previous_total;
        const bonusToAdd = Math.floor(currentTotal * 0.1);
        const updatedRefBonus = await pool.query('UPDATE referral_bonus SET previous_total = previous_total + $1, total_bonus = total_bonus + $2 WHERE user_id = $3 RETURNING *', [currentTotal, bonusToAdd, userId]);
        await pool.query('UPDATE users SET point = point + $1 WHERE id = $2', [bonusToAdd, userId]);

        res.json({ updated: updatedRefBonus.rows[0], success: true });
    } catch (err) {
        console.error('Error getting referral bonus:', err.message);
        res.status(500).json({ message: 'Invalid token or database', success: false });
    }
}

export default { dashboard, leaderboard, getTelegramId, getReferralBonus };