import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../db/index.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import config from './index.js';

export default function configurePassport() {
    passport.use(
        'google',
        new GoogleStrategy(
            {
                clientID: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                callbackURL: `${config.BACKEND_URL}/auth/google/dashboard`,
                userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, cb) => {
                try {
                    const referredBy = (!req.cookies?.referralCode || req.cookies?.referralCode === 'undefined') ? null : req.cookies.referralCode;

                    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [profile.emails[0].value]);
                    let user;
                    if (existingUser.rowCount === 0) {
                        let point;
                        const users = await pool.query('SELECT email FROM users');
                        users.rowCount > 500 ? point = 30 : point = 250;

                        const newUser = await pool.query(
                            'INSERT INTO users (email, name, authenticator, invited_by, point) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                            [profile.emails[0].value, profile.displayName, 'google', referredBy, point]
                        );
                        await pool.query('INSERT INTO wallet ( user_id ) VALUES ($1)', [newUser.rows[0].id]);
                        await pool.query('INSERT INTO daily_reward (user_id) VALUES ($1)', [newUser.rows[0].id]);
                        await pool.query('INSERT INTO referral_bonus (user_id) VALUES ($1)', [newUser.rows[0].id]);
                        await pool.query('UPDATE users SET referral_number = referral_number + 1, point = point + 50 WHERE referral_code = $1', [referredBy]);

                        user = newUser.rows[0];

                        const newReferralCode = nanoid(6) + user.id.toString();
                        const randomAvatar = `https://robohash.org/${user.id}?set=set3`;
                        await pool.query('UPDATE users SET referral_code = $1, avatar_url = $2  WHERE id = $3', [newReferralCode, randomAvatar, user.id]);
                    } else {
                        user = existingUser.rows[0];
                    }

                    const access = jwt.sign({ id: user.id }, config.ACCESS_SECRET, { expiresIn: '15m' });
                    const refresh = jwt.sign({ id: user.id }, config.REFRESH_SECRET, { expiresIn: '150d' });
                    req.res.clearCookie('referralCode', config.CLEAR_COOKIE_OPTIONS);

                    return cb(null, { accessToken: access, refreshToken: refresh });
                } catch (err) {
                    return cb(err);
                }
            }
        )
    );
}