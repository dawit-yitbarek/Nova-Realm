import pool from '../db/index.js';

export async function userTask(req, res) {
    const userId = req.user?.id;
    try {
        const completedTasksRes = await pool.query('SELECT task_id FROM completed_tasks WHERE user_id = $1', [userId]);
        const completedTaskIds = completedTasksRes.rows.map(row => row.task_id);

        let completedTasks = [];
        let incompleteTasks = [];
        if (completedTaskIds.length > 0) {
            const placeholders = completedTaskIds.map((_, i) => `$${i + 1}`).join(', ');
            const completedTasksResult = await pool.query(`SELECT * FROM tasks WHERE id IN (${placeholders})`, completedTaskIds);
            const incompleteTasksResult = await pool.query(`SELECT * FROM tasks WHERE id NOT IN (${placeholders})`, completedTaskIds);
            completedTasks = completedTasksResult.rows;
            incompleteTasks = incompleteTasksResult.rows;
        } else {
            incompleteTasks = (await pool.query('SELECT * FROM tasks')).rows;
        }

        res.json({ success: true, completedTasks, incompleteTasks });
    } catch (err) {
        console.error('Error in userTask:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function investmentTasks(req, res) {
    const userId = req.user?.id;
    try {
        const completedTasksRes = await pool.query('SELECT task_id FROM completed_investment WHERE user_id = $1', [userId]);
        const completedTaskIds = completedTasksRes.rows.map(row => row.task_id);

        let completedTasks = [];
        let incompleteTasks = [];
        if (completedTaskIds.length > 0) {
            const placeholders = completedTaskIds.map((_, i) => `$${i + 1}`).join(', ');
            const completedTasksResult = await pool.query(`SELECT * FROM investment_tasks WHERE id IN (${placeholders})`, completedTaskIds);
            const incompleteTasksResult = await pool.query(`SELECT * FROM investment_tasks WHERE id NOT IN (${placeholders})`, completedTaskIds);
            completedTasks = completedTasksResult.rows;
            incompleteTasks = incompleteTasksResult.rows;
        } else {
            incompleteTasks = (await pool.query('SELECT * FROM investment_tasks')).rows;
        }

        res.json({ success: true, completedTasks, incompleteTasks });
    } catch (err) {
        console.error('Error in investmentTasks:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function referralTasks(req, res) {
    const userId = req.user?.id;
    try {
        const userRes = await pool.query('SELECT referral_number, referral_code FROM users WHERE id = $1', [userId]);
        const referredCount = userRes.rows[0]?.referral_number || 0;
        const userCompletedTasks = await pool.query('SELECT task_id FROM completed_referral WHERE user_id = $1', [userId]);
        const completedTaskIds = userCompletedTasks.rows.map(row => row.task_id);

        const eligibleTasksRes = await pool.query('SELECT * FROM referral_tasks WHERE amount <= $1', [referredCount]);
        const eligibleTasks = eligibleTasksRes.rows;

        const newTasks = eligibleTasks.filter(task => !completedTaskIds.includes(task.id));
        for (const task of newTasks) {
            await pool.query('INSERT INTO completed_referral(user_id, task_id) VALUES ($1, $2)', [userId, task.id]);
            await pool.query('UPDATE users SET point = point + $1 WHERE id = $2', [task.reward_point, userId]);
        }

        const allTasks = await pool.query('SELECT * FROM referral_tasks');
        const completedTasks = allTasks.rows.filter(task => completedTaskIds.includes(task.id) || newTasks.find(t => t.id === task.id));
        const incompleteTasks = allTasks.rows.filter(task => !completedTasks.find(t => t.id === task.id));

        res.json({ success: true, completedTasks, incompleteTasks, referralCode: userRes.rows[0]?.referral_code });
    } catch (err) {
        console.error('Error fetching referral tasks:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function completeTask(req, res) {
    const userId = req.user?.id;
    const { taskId, reward_point } = req.body;
    try {
        await pool.query('INSERT INTO completed_tasks (user_id, task_id) VALUES ($1, $2)', [userId, taskId]);
        await pool.query('UPDATE users set point = point + $1 WHERE id = $2', [reward_point, userId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error completing task:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export async function claimDailyReward(req, res) {
    const userId = req.user?.id;
    try {
        const claimedUser = await pool.query('SELECT claimed, streak FROM daily_reward WHERE user_id = $1', [userId]);
        if (!claimedUser.rows[0]?.claimed) {
            await pool.query('UPDATE daily_reward SET claimed = $1 WHERE user_id = $2', [true, userId]);
            let updatedPoint;
            claimedUser.rows[0].streak < 5 ? updatedPoint = claimedUser.rows[0].streak * 5 : updatedPoint = 25;
            await pool.query('UPDATE users SET point = point + $1 WHERE id = $2', [updatedPoint, userId]);
        }

        res.json({ message: 'Daily reward claimed successfully', success: true });
    } catch (err) {
        console.error('Error claiming daily reward:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default { userTask, investmentTasks, referralTasks, completeTask, claimDailyReward };
