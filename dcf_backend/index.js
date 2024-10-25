// Import necessary modules
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

// Import custom modules
import userRoutes from './routes/userRoutes.js';
import formRoutes from './routes/FormRoutes.js';  // Fix: Use the correct formRoutes
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send(' Server Running ');
});
app.use('/api/users', userRoutes);
app.use('/api/forms', formRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
