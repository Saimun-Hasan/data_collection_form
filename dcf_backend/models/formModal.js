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
                INSERT INTO submitted_forms (
                    name, 
                    email, 
                    question_1, 
                    question_2, 
                    question_3, 
                    question_4, 
                    question_5, 
                    question_6, 
                    question_7, 
                    question_8, 
                    question_9, 
                    question_10, 
                    question_11,
                    status,
                    created_at,
                    updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
                RETURNING id, name, email, status
            `;
            const values = [
                name,
                email,
                question_1,
                question_2,
                question_3,
                question_4,
                question_5,
                question_6,
                question_7,
                question_8,
                question_9,
                question_10,
                question_11,
                'processing' // Initial status
            ];

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
                SELECT id, name, email, status, 
                       question_1, question_2, question_3, question_4, question_5, 
                       question_6, question_7, question_8, question_9, question_10, question_11
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

    // Find submission by ID
    findById: async (id) => {
        try {
            const query = `
                SELECT id, name, email, status,
                       question_1, question_2, question_3, question_4, question_5,
                       question_6, question_7, question_8, question_9, question_10, question_11,
                       created_at, updated_at
                FROM submitted_forms
                WHERE id = $1
            `;
            const values = [id];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding submission by ID:', error);
            throw error;
        }
    },

    // Update file link for a specific question
    updateFileLink: async (submissionId, questionField, fileLink) => {
        try {
            // Validate the question field name to prevent SQL injection
            const validQuestionFields = Array.from({ length: 11 }, (_, i) => `question_${i + 1}`);
            if (!validQuestionFields.includes(questionField)) {
                throw new Error('Invalid question field name');
            }

            const query = `
                UPDATE submitted_forms 
                SET ${questionField} = $1,
                    updated_at = NOW()
                WHERE id = $2
                RETURNING *
            `;
            const values = [fileLink, submissionId];

            console.log(`Updating file link for submission ID ${submissionId}, field ${questionField}...`);
            const result = await pool.query(query, values);
            console.log('File link updated. Checking if all files are uploaded...');

            const submission = result.rows[0];
            const allUploaded = validQuestionFields.every(field => submission[field] !== null);
            console.log('All uploaded:', allUploaded);

            if (allUploaded) {
                console.log('All files uploaded. Updating status to completed...');
                await pool.query(
                    `UPDATE submitted_forms 
                 SET status = 'completed',
                     updated_at = NOW()
                 WHERE id = $1`,
                    [submissionId]
                );
                console.log('Status updated to completed.');
            }

            return result.rows[0];
        } catch (error) {
            console.error('Error updating file link:', error);
            throw error;
        }
    },

    // Get submission status
    getSubmissionStatus: async (submissionId) => {
        try {
            const query = `
                SELECT id, name, email, status,
                       question_1, question_2, question_3, question_4, question_5,
                       question_6, question_7, question_8, question_9, question_10, question_11,
                       created_at, updated_at
                FROM submitted_forms
                WHERE id = $1
            `;
            const values = [submissionId];

            const result = await pool.query(query, values);
            if (!result.rows[0]) {
                return null;
            }

            const submission = result.rows[0];
            const questionFields = Array.from({ length: 11 }, (_, i) => `question_${i + 1}`);

            return {
                id: submission.id,
                name: submission.name,
                email: submission.email,
                status: submission.status,
                fileLinks: questionFields.reduce((acc, field) => {
                    acc[field] = submission[field];
                    return acc;
                }, {}),
                created_at: submission.created_at,
                updated_at: submission.updated_at
            };
        } catch (error) {
            console.error('Error getting submission status:', error);
            throw error;
        }
    }
};

export default formModel;