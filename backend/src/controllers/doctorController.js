const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

// @route   POST /api/doctors/register
// @desc    Register doctor details
// @access  Private
exports.registerDoctor = asyncHandler(async (req, res, next) => {
  const {
    specialization,
    licenseNumber,
    experience,
    qualifications,
    hospital,
    consultationFee,
    bio,
  } = req.body;

  // Check if doctor already exists
  const existingDoctor = await Doctor.findOne({ userId: req.user.id });
  if (existingDoctor) {
    return next(new ErrorHandler('Doctor profile already exists', 400));
  }

  // Check if license number already exists
  const licenseExists = await Doctor.findOne({ licenseNumber });
  if (licenseExists) {
    return next(new ErrorHandler('License number already exists', 400));
  }

  const doctor = await Doctor.create({
    userId: req.user.id,
    specialization,
    licenseNumber,
    experience,
    qualifications: qualifications || [],
    hospital,
    consultationFee: consultationFee || 500,
    bio,
  });

  res.status(201).json({
    success: true,
    data: doctor,
  });
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId');

  if (!doctor) {
    return next(new ErrorHandler('Doctor not found', 404));
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const { specialization } = req.query;

  let query = {};
  if (specialization) {
    query.specialization = specialization;
  }

  const doctors = await Doctor.find(query).populate('userId');

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// @route   GET /api/doctors/profile/me
// @desc    Get current user doctor profile
// @access  Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ userId: req.user.id }).populate('userId');

  if (!doctor) {
    return next(new ErrorHandler('Doctor profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(new ErrorHandler('Doctor not found', 404));
  }

  // Make sure user is doctor owner or admin
  if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to update this doctor', 403));
  }

  doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: doctor,
  });
});
