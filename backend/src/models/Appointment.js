const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Please provide appointment time'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    reason: {
      type: String,
      required: true,
    },
    notes: String,
    consultationFee: {
      type: Number,
      required: true,
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    doctorNotes: String,
    prescriptionDetails: [
      {
        medicationName: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
