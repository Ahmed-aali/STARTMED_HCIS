const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: [String],
    treatmentPlan: {
      type: String,
      required: true,
    },
    notes: String,
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
    },
    labResults: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    scans: [
      {
        scanType: String,
        fileUrl: String,
        uploadedDate: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
    prescriptions: [
      {
        medicationName: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
        prescribedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followUpDate: Date,
    recordType: {
      type: String,
      enum: ['Consultation', 'Follow-up', 'Lab Test', 'Surgery'],
      default: 'Consultation',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
