const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    billDate: {
      type: Date,
      default: Date.now,
    },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid', 'Pending Verification'],
      default: 'Unpaid',
    },
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Insurance', 'Other'],
      default: 'Cash',
    },
    paymentReceipt: {
      type: String, // base64-encoded image of the payment receipt
      default: null,
    },
    notes: String,
    dueDate: Date,
  },
  { timestamps: true }
);

// Calculate remaining amount before saving
billSchema.pre('save', function (next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;
  next();
});

module.exports = mongoose.model('Bill', billSchema);
