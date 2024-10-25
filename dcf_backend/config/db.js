import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

// Load environment variables only if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Create a new connection pool for PostgreSQL
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || undefined,
    ...(process.env.POSTGRES_URL ? {} : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    })
});

export default pool;
