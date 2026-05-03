const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalAppointments = await Appointment.countDocuments();
  const totalBills = await Bill.countDocuments();
  const totalRevenue = await Bill.aggregate([
    { $group: { _id: null, total: { $sum: '$paidAmount' } } },
  ]);

  const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
  const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });

  res.status(200).json({
    success: true,
    data: {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalBills,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      pendingAppointments,
      completedAppointments,
    },
  });
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Also delete associated patient or doctor records
  if (user.role === 'patient') {
    await Patient.deleteOne({ userId: req.params.id });
  } else if (user.role === 'doctor') {
    await Doctor.deleteOne({ userId: req.params.id });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @route   PUT /api/admin/users/:id
// @desc    Update user status
// @access  Private/Admin
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @route   GET /api/admin/reports
// @desc    Generate reports
// @access  Private/Admin
exports.generateReports = asyncHandler(async (req, res, next) => {
  // Appointment report
  const appointmentsByStatus = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Revenue report
  const revenueByPaymentStatus = await Bill.aggregate([
    {
      $group: { _id: '$paymentStatus', total: { $sum: '$totalAmount' }, count: { $sum: 1 } },
    },
  ]);

  // Doctor workload
  const doctorWorkload = await Appointment.aggregate([
    { $group: { _id: '$doctorId', count: { $sum: 1 } } },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctor' } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      appointmentsByStatus,
      revenueByPaymentStatus,
      doctorWorkload,
    },
  });
});
