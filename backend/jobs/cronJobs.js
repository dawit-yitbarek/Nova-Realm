import cron from 'node-cron';
import pool from '../db/index.js';

export function startCronJobs() {
    // Clean expired pending_verifications every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        try {
            await pool.query(`DELETE FROM pending_verifications WHERE created_at < NOW() - INTERVAL '10 minutes'`);
            console.log('✅ Expired pending_verifications cleaned up');
        } catch (err) {
            console.error('❌ Cleanup error: ', err.message);
        }
    });

    // update daily_reward every day at midnight UTC
    cron.schedule('0 0 * * *', async () => {
        try {
            await pool.query(`UPDATE daily_reward SET streak = 1, claimed = false WHERE claimed = false AND streak > 1`);
            await pool.query(`UPDATE daily_reward SET streak = streak + 1, claimed = false WHERE daily_reward.claimed = true`);
            console.log('✅ daily_reward table updated');
        } catch (err) {
            console.error('❌ Updating error: ', err.message);
        }
    }, { timezone: 'UTC' });
};
