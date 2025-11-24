import { Pool } from 'pg';
import config from '../config/index.js';

const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ...(config.NODE_ENV === 'production' && { ssl: { rejectUnauthorized: false } }),
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err?.message || err);
});

export default pool;