const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/jwt');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');
const { validateEmail, validatePassword, validatePhone, validateName } = require('../utils/validators');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  // Validation
  if (!validateEmail(email)) {
    return next(new ErrorHandler('Invalid email format', 400));
  }
  if (!validatePassword(password)) {
    return next(new ErrorHandler('Password must be at least 6 characters', 400));
  }
  if (!validateName(firstName) || !validateName(lastName)) {
    return next(new ErrorHandler('First name and last name must be at least 2 characters', 400));
  }
  if (!validatePhone(phone)) {
    return next(new ErrorHandler('Invalid phone number', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('Email already registered', 400));
  }

  // Create user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || 'patient',
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});
