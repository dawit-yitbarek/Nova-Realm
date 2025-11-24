import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.REFRESH_SECRET, { expiresIn: '150d' });
}

export default { signAccessToken, signRefreshToken };
