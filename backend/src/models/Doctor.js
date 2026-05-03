const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Practice', 'Dermatology', 'Surgery', 'X-Ray', 'Dentist', 'ENT', 'Neurological', 'Other'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please provide license number'],
      unique: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
    },
    qualifications: [String],
    hospital: {
      type: String,
      required: true,
    },
    availabilityDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availabilityStartTime: {
      type: String,
      default: '09:00',
    },
    availabilityEndTime: {
      type: String,
      default: '17:00',
    },
    consultationFee: {
      type: Number,
      required: true,
      default: 500,
    },
    bio: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
