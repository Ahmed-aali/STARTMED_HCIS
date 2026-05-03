const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

exports.createMedicalRecord = asyncHandler(async (req, res, next) => {
  const { patientId, diagnosis, symptoms, treatmentPlan, vitals, labResults, followUpDate } =
    req.body;

  const doctor = await Doctor.findOne({ userId: req.user.id });
  if (!doctor) {
    return next(new ErrorHandler('Doctor profile not found', 404));
  }

  const medicalRecord = await MedicalRecord.create({
    patientId,
    doctorId: doctor._id,
    diagnosis,
    symptoms: symptoms || [],
    treatmentPlan,
    vitals: vitals || {},
    labResults: labResults || [],
    followUpDate,
  });

  res.status(201).json({
    success: true,
    data: medicalRecord,
  });
});

exports.getMedicalRecord = asyncHandler(async (req, res, next) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .populate({ path: 'doctorId', populate: { path: 'userId' } });

  if (!record) {
    return next(new ErrorHandler('Medical record not found', 404));
  }

  res.status(200).json({
    success: true,
    data: record,
  });
});

exports.getPatientMedicalRecords = asyncHandler(async (req, res, next) => {
  const records = await MedicalRecord.find({ patientId: req.params.patientId })
    .populate({ path: 'doctorId', populate: { path: 'userId' } })
    .sort({ visitDate: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

exports.getMyMedicalRecords = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({ userId: req.user.id });

  if (!patient) {
    return next(new ErrorHandler('Patient profile not found', 404));
  }

  const records = await MedicalRecord.find({ patientId: patient._id })
    .populate({ path: 'doctorId', populate: { path: 'userId' } })
    .sort({ visitDate: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

exports.updateMedicalRecord = asyncHandler(async (req, res, next) => {
  let record = await MedicalRecord.findById(req.params.id);

  if (!record) {
    return next(new ErrorHandler('Medical record not found', 404));
  }

  record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: record,
  });
});
