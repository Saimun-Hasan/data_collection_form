import pool from '../config/db.js';

const formModel = {
    // Get all form submissions
    getAllSubmissions: async () => {
        try {
            const query = `SELECT * FROM submitted_forms`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error retrieving all submissions:', error);
            throw error;
        }
    },

    // Create a new user form submission
    create: async (name, email, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10, question_11) => {
        try {
            const query = `
                INSERT INTO submitted_forms (name, email, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10, question_11)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id, name, email
            `;
            const values = [name, email, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10, question_11];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user submission:', error);
            throw error;
        }
    },

    // Find a user by email
    findByEmail: async (email) => {
        try {
            const query = `
                SELECT id, name, email, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10, question_11
                FROM submitted_forms
                WHERE email = $1
            `;
            const values = [email];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    },
};

export default formModel;
