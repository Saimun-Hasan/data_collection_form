import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const userModel = {
    // Create a new user in the database
    create: async (firstName, lastName, userName, email, password) => {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (firstName, lastName, userName, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, firstName, lastName, userName, email
        `;
        const values = [firstName, lastName, userName, email, hashedPassword];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Find a user by userName
    findByuserName: async (userName) => {
        const query = `
            SELECT id, firstName, lastName, userName, email, password
            FROM users
            WHERE userName = $1
        `;
        const values = [userName];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Find a user by email
    findByEmail: async (email) => {
        const query = `
            SELECT id, firstName, lastName, userName, email, password
            FROM users
            WHERE email = $1
        `;
        const values = [email];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
    
    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    }
};

export default userModel;
