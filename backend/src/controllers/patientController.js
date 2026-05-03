const Patient = require('../models/Patient');
const User = require('../models/User');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

// @route   POST /api/patients/register
// @desc    Register patient details
// @access  Private
exports.registerPatient = asyncHandler(async (req, res, next) => {
  const {
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    city,
    state,
    zipCode,
    emergencyContact,
    allergies,
  } = req.body;

  // Check if patient already exists
  const existingPatient = await Patient.findOne({ userId: req.user.id });
  if (existingPatient) {
    return next(new ErrorHandler('Patient profile already exists', 400));
  }

  const patient = await Patient.create({
    userId: req.user.id,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    city,
    state,
    zipCode,
    emergencyContact,
    allergies: allergies || [],
  });

  res.status(201).json({
    success: true,
    data: patient,
  });
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
exports.getPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate('userId');

  if (!patient) {
    return next(new ErrorHandler('Patient not found', 404));
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// @route   GET /api/patients/profile/me
// @desc    Get current user patient profile
// @access  Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({ userId: req.user.id }).populate('userId');

  if (!patient) {
    return next(new ErrorHandler('Patient profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
exports.updatePatient = asyncHandler(async (req, res, next) => {
  let patient = await Patient.findById(req.params.id);

  if (!patient) {
    return next(new ErrorHandler('Patient not found', 404));
  }

  // Make sure user is patient owner
  if (patient.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to update this patient', 403));
  }

  patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// @route   GET /api/patients
// @desc    Get all patients (Admin only)
// @access  Private/Admin
exports.getAllPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find().populate('userId');

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});

// @route   GET /api/patients/search
// @desc    Search patients by name or email
// @access  Private/Admin
exports.searchPatients = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorHandler('Please provide a search query', 400));
  }

  const users = await User.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
    role: 'patient',
  });

  const patients = await Patient.find({
    userId: { $in: users.map((u) => u._id) },
  }).populate('userId');

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});
