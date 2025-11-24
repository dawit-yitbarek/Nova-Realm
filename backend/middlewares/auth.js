import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Access token missing' });

    try {
        const decoded = jwt.verify(token, config.ACCESS_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Access token invalid or expired' });
    }
};