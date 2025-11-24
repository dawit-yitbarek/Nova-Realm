import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => res.status(429).json({ success: false, message: 'Too many registration attempts. Please try again later.' }),
    standardHeaders: true,
    legacyHeaders: false,
});