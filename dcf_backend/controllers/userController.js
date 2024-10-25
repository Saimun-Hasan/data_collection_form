import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import userModel from '../models/userModel.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  // Basic validation
  if (!password) {
    res.status(400);
    throw new Error('Please fill in all fields.');
  }

  // Check if the user already exists by email or userName
  const existingUserByEmail = await userModel.findByEmail(email);
  const existingUserByuserName = await userModel.findByuserName(userName);

  if (existingUserByEmail) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  if (existingUserByuserName) {
    return res.status(400).json({ message: 'Username already taken.' });
  }

  // Create the user
  const user = await userModel.create(firstName, lastName, userName, email, password);

  if (user) {
    generateToken(res, user.id);
    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid User Data');
  }
});


// @desc    Login user/set token
// @route   POST /api/users/
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  const user = await userModel.findByEmail(email);

  if (user && await userModel.comparePassword(password, user.password)) {
    generateToken(res, user.id);
    return res.status(200).json({
      id: user.id,
      email: user.email,
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Logout a new user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User successfully logged out.' });
});

// @desc    Get user Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    userName: req.user.userName,
    email: req.user.email,
  };

  res.status(200).json(user);
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile
};