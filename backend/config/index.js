import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60 * 24 * 30 * 5
};

const CLEAR_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'None' : 'Lax'
};

export default {
    NODE_ENV,
    PORT,
    FRONTEND_URL,
    BACKEND_URL,
    COOKIE_OPTIONS,
    CLEAR_COOKIE_OPTIONS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS,
    EMAIL_USER: process.env.EMAIL_USER,
    DATABASE_URL: process.env.DATABASE_URL,
    RPC_URL: process.env.RPC_URL,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};