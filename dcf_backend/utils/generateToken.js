import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token and sets it as an HTTP-only cookie in the response.
 * @param {Object} res - The Express response object
 * @param {string} userId - The user ID to be encoded in the token
 */
const generateToken = (res, userId) => {
    // Generate a JWT token
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
    );

    // Set the token as an HTTP-only cookie
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        path: '/',
    });

    res.status(200).json({
        message: 'Authentication successful',
    });
};

export default generateToken;
