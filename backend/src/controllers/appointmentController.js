const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

exports.bookAppointment = asyncHandler(async (req, res, next) => {
  const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

  const patient = await Patient.findOne({ userId: req.user.id });
  if (!patient) {
    return next(new ErrorHandler('Patient profile not found', 404));
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler('Doctor not found', 404));
  }

  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason,
    consultationFee: doctor.consultationFee,
  });

  res.status(201).json({
    success: true,
    data: appointment,
  });
});

exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .populate({ path: 'doctorId', populate: { path: 'userId' } });

  if (!appointment) {
    return next(new ErrorHandler('Appointment not found', 404));
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

exports.getMyAppointments = asyncHandler(async (req, res, next) => {
  let appointments;

  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user.id });
    appointments = await Appointment.find({ patientId: patient._id })
      .populate({ path: 'patientId', populate: { path: 'userId' } })
      .populate({ path: 'doctorId', populate: { path: 'userId' } })
      .sort({ appointmentDate: 1 });
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    appointments = await Appointment.find({ doctorId: doctor._id })
      .populate({ path: 'patientId', populate: { path: 'userId' } })
      .populate({ path: 'doctorId', populate: { path: 'userId' } })
      .sort({ appointmentDate: 1 });
  }

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

exports.updateAppointment = asyncHandler(async (req, res, next) => {
  const { status, notes, doctorNotes, prescriptionDetails } = req.body;

  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler('Appointment not found', 404));
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;
  if (doctorNotes) updateData.doctorNotes = doctorNotes;
  if (prescriptionDetails) updateData.prescriptionDetails = prescriptionDetails;

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

exports.getAllAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .populate({ path: 'doctorId', populate: { path: 'userId' } })
    .sort({ appointmentDate: 1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'Cancelled' },
    { new: true }
  );

  if (!appointment) {
    return next(new ErrorHandler('Appointment not found', 404));
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});
