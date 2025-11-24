import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import pool from '../db/index.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/mailService.js';
import authService from '../services/authService.js';
import config from '../config/index.js';

const saltRounds = 10;

export async function register(req, res) {
    const { email, password, referralCode } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const existing = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rowCount > 0) {
            await client.query('ROLLBACK');
            return res.json({ success: false, message: 'User already registered, please login' });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const code = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');

        await client.query(`
      INSERT INTO pending_verifications (email, hashed_password, code, invited_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET hashed_password = $2, code = $3, created_at = NOW()
    `, [email, hash, code, referralCode]);

        const verificationCode = await sendVerificationEmail(email, code);
        if (!verificationCode.success) {
            await client.query('ROLLBACK');
            return res.json({ success: false, message: 'Failed to send verification code' });
        }

        await client.query('COMMIT');
        res.json({ success: true, message: 'Verification code sent to your email.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error occurred on registering user:', error.message);
        res.json({ success: false, message: 'Registration failed' });
    } finally {
        client.release();
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;
    try {
        const selectUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (selectUser.rowCount === 0) return res.json({ success: false, message: 'User not found with this email' });

        const user = selectUser.rows[0];
        if (user.authenticator === 'google') return res.json({ success: false, message: 'you login with this email using google before. please login using google again' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.json({ success: false, message: 'Incorrect password' });

        const accessToken = authService.signAccessToken({ id: user.id });
        const refreshToken = authService.signRefreshToken({ id: user.id });

        res.cookie('refreshToken', refreshToken, config.COOKIE_OPTIONS);

        return res.json({ success: true, accessToken });
    } catch (err) {
        console.error('Error during authentication:', err.message);
        return res.json({ success: false, message: 'Server error' });
    }
}

export async function refresh(req, res) {
    const refreshtoken = req.cookies?.refreshToken;
    if (!refreshtoken) return res.json({ success: false, message: 'No refresh token provided' });
    try {
        const decodedTok = jwt.verify(refreshtoken, config.REFRESH_SECRET);
        const newAccessToken = authService.signAccessToken({ id: decodedTok.id });
        return res.json({ newAccessToken, success: true });
    } catch (error) {
        console.log('Error on refresh route', error.message);
        res.clearCookie('refreshToken', config.CLEAR_COOKIE_OPTIONS);
        return res.json({ success: false, message: 'Server error' });
    }
}

export async function logout(req, res) {
    const token = req.cookies?.refreshToken;
    if (!token) return res.sendStatus(204);
    res.clearCookie('refreshToken', config.CLEAR_COOKIE_OPTIONS);
    res.sendStatus(204);
}

export async function verifyEmail(req, res) {
    const { email, code, name } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(`
      SELECT * FROM pending_verifications
      WHERE email = $1 AND code = $2 AND created_at > NOW() - INTERVAL '10 minutes'
    `, [email, code]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.json({ success: false, message: 'Invalid or expired verification token' });
        }

        const { hashed_password, invited_by } = result.rows[0];
        let point;
        const users = await pool.query('SELECT email FROM users');
        users.rowCount > 500 ? point = 30 : point = 250;

        const user = await client.query(`
      INSERT INTO users (email, password, name, authenticator, invited_by, point)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [email, hashed_password, name, 'email', invited_by, point]);

        const referralCode = nanoid(6) + user.rows[0].id.toString();
        const randomAvatar = `https://robohash.org/${user.rows[0].id}?set=set3`;

        await client.query('UPDATE users SET referral_code = $1, avatar_url = $2 WHERE id = $3', [referralCode, randomAvatar, user.rows[0].id]);
        await client.query('INSERT INTO wallet (address, user_id) VALUES ($1, $2)', [null, user.rows[0].id]);
        await client.query('INSERT INTO daily_reward (user_id) VALUES ($1)', [user.rows[0].id]);
        await client.query('DELETE FROM pending_verifications WHERE email = $1', [email]);
        await client.query('update users SET referral_number = referral_number + 1, point = point + 50 WHERE referral_code = $1', [invited_by]);
        await client.query('INSERT INTO referral_bonus (user_id) VALUES ($1)', [user.rows[0].id]);

        await client.query('COMMIT');

        const refreshToken = authService.signRefreshToken({ id: user.rows[0].id });
        const accessToken = authService.signAccessToken({ id: user.rows[0].id });

        res.cookie('refreshToken', refreshToken, config.COOKIE_OPTIONS);

        res.json({ success: true, accessToken, message: '' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error verifying email:', error.message);
        res.json({ success: false, message: 'Failed to verify email' });
    } finally {
        client.release();
    }
}

export async function sendResetOtp(req, res) {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
        if (user.rowCount === 0) return res.json({ success: false, message: 'User not found with this email' });

        const code = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
        const tempPassword = String(Math.floor(Math.random() * 999999) + 1).padStart(10, '0');
        const hashedTemp = await bcrypt.hash(tempPassword, saltRounds);

        const verificationCode = await sendVerificationEmail(email, code);
        if (!verificationCode.success) return res.json({ success: false, message: 'Failed to send verification code' });

        await pool.query(`
      INSERT INTO pending_verifications (email, hashed_password, code)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET hashed_password = $2, code = $3, created_at = NOW()
    `, [email, hashedTemp, code]);

        res.json({ success: true, message: 'Verification code sent to your email.' });
    } catch (error) {
        console.log('Error occurred on sending reset OTP:', error.message);
        res.json({ success: false, message: 'Failed to send reset OTP' });
    }
}

export async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    try {
        const result = await pool.query(`
      SELECT * FROM pending_verifications
      WHERE email = $1 AND code = $2 AND created_at > NOW() - INTERVAL '10 minutes'
    `, [email, otp]);

        if (result.rowCount === 0) return res.json({ success: false, message: 'Invalid or expired verification code' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
        await pool.query('DELETE FROM pending_verifications WHERE email = $1', [email]);

        res.json({ success: true, message: 'Password reset successfully! now you can login' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.json({ success: false, message: 'Failed to reset password' });
    }
}

export async function startGoogleAuth(req, res, next) {
    const referral = req.query.ref;
    if (referral) {
        res.cookie('referralCode', referral, config.COOKIE_OPTIONS);
    }
    next();
}

export async function googleCallback(req, res) {
    try {
        const { accessToken, refreshToken } = req.user;
        res.cookie('refreshToken', refreshToken, config.COOKIE_OPTIONS);
        res.cookie("accessToken", accessToken, {
            httpOnly: false, // able frontend JS to access it
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.redirect(config.FRONTEND_URL)
    } catch (err) {
        console.log("error on google callback ", err.message)
    }
}

export default {
    register,
    signin,
    refresh,
    logout,
    verifyEmail,
    sendResetOtp,
    resetPassword,
    startGoogleAuth,
    googleCallback
};