const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

exports.createPrescription = asyncHandler(async (req, res, next) => {
  const { patientId, medicines, expiryDate, notes } = req.body;

  const doctor = await Doctor.findOne({ userId: req.user.id });
  if (!doctor) {
    return next(new ErrorHandler('Doctor profile not found', 404));
  }

  const prescription = await Prescription.create({
    patientId,
    doctorId: doctor._id,
    medicines,
    expiryDate,
    notes,
  });

  res.status(201).json({
    success: true,
    data: prescription,
  });
});

exports.getPrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .populate({ path: 'doctorId', populate: { path: 'userId' } });

  if (!prescription) {
    return next(new ErrorHandler('Prescription not found', 404));
  }

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

exports.getPatientPrescriptions = asyncHandler(async (req, res, next) => {
  const prescriptions = await Prescription.find({ patientId: req.params.patientId })
    .populate({ path: 'doctorId', populate: { path: 'userId' } })
    .sort({ issuedDate: -1 });

  res.status(200).json({
    success: true,
    count: prescriptions.length,
    data: prescriptions,
  });
});

exports.getMyPrescriptions = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({ userId: req.user.id });

  if (!patient) {
    return next(new ErrorHandler('Patient profile not found', 404));
  }

  const prescriptions = await Prescription.find({ patientId: patient._id })
    .populate({ path: 'doctorId', populate: { path: 'userId' } })
    .sort({ issuedDate: -1 });

  res.status(200).json({
    success: true,
    count: prescriptions.length,
    data: prescriptions,
  });
});

exports.updatePrescription = asyncHandler(async (req, res, next) => {
  let prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    return next(new ErrorHandler('Prescription not found', 404));
  }

  prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

exports.downloadPrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .populate({ path: 'doctorId', populate: { path: 'userId' } });

  if (!prescription) {
    return next(new ErrorHandler('Prescription not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Prescription download link would be generated here',
    data: prescription,
  });
});
