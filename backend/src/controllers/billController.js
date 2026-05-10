const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

// ==============================
// Fixed-price Service Catalog
// ==============================
const SERVICE_CATALOG = [
  // Consultations
  { id: 'consult-general', category: 'Consultation', name: 'General Consultation', price: 50, icon: '🩺', description: 'General health checkup with a physician' },
  { id: 'consult-specialist', category: 'Consultation', name: 'Specialist Consultation', price: 120, icon: '👨‍⚕️', description: 'Consultation with a specialist doctor' },
  { id: 'consult-followup', category: 'Consultation', name: 'Follow-up Visit', price: 30, icon: '🔄', description: 'Follow-up after a previous consultation' },
  { id: 'consult-emergency', category: 'Consultation', name: 'Emergency Consultation', price: 200, icon: '🚨', description: 'Urgent medical consultation' },

  // Imaging & Radiology
  { id: 'xray-chest', category: 'Radiology', name: 'Chest X-Ray', price: 80, icon: '📷', description: 'Standard chest X-ray imaging' },
  { id: 'xray-bone', category: 'Radiology', name: 'Bone X-Ray', price: 90, icon: '🦴', description: 'X-ray imaging for bones and joints' },
  { id: 'mri-scan', category: 'Radiology', name: 'MRI Scan', price: 500, icon: '🧲', description: 'Magnetic Resonance Imaging scan' },
  { id: 'ct-scan', category: 'Radiology', name: 'CT Scan', price: 350, icon: '🖥️', description: 'Computed Tomography scan' },
  { id: 'ultrasound', category: 'Radiology', name: 'Ultrasound', price: 150, icon: '📡', description: 'Ultrasound imaging examination' },

  // Laboratory
  { id: 'lab-cbc', category: 'Laboratory', name: 'Complete Blood Count (CBC)', price: 25, icon: '🩸', description: 'Full blood count analysis' },
  { id: 'lab-lipid', category: 'Laboratory', name: 'Lipid Profile', price: 40, icon: '💉', description: 'Cholesterol and triglycerides panel' },
  { id: 'lab-thyroid', category: 'Laboratory', name: 'Thyroid Panel', price: 55, icon: '🔬', description: 'TSH, T3 and T4 hormone levels' },
  { id: 'lab-glucose', category: 'Laboratory', name: 'Blood Glucose Test', price: 15, icon: '🍬', description: 'Fasting or random blood sugar test' },
  { id: 'lab-urine', category: 'Laboratory', name: 'Urinalysis', price: 20, icon: '🧪', description: 'Complete urine analysis' },
  { id: 'lab-comprehensive', category: 'Laboratory', name: 'Comprehensive Metabolic Panel', price: 75, icon: '📊', description: 'Full metabolic blood panel' },

  // Procedures
  { id: 'proc-ecg', category: 'Procedures', name: 'ECG / EKG', price: 60, icon: '❤️', description: 'Electrocardiogram heart test' },
  { id: 'proc-echo', category: 'Procedures', name: 'Echocardiogram', price: 250, icon: '💓', description: 'Heart ultrasound examination' },
  { id: 'proc-vaccination', category: 'Procedures', name: 'Vaccination', price: 35, icon: '💉', description: 'Standard vaccination administration' },
  { id: 'proc-wound', category: 'Procedures', name: 'Wound Dressing', price: 45, icon: '🩹', description: 'Professional wound care and dressing' },

  // Pharmacy
  { id: 'pharm-prescription', category: 'Pharmacy', name: 'Prescription Medications', price: 30, icon: '💊', description: 'Standard prescription fulfillment' },
  { id: 'pharm-otc', category: 'Pharmacy', name: 'OTC Medications Pack', price: 15, icon: '🏥', description: 'Over-the-counter medications' },
];

const generateBillNumber = async () => {
  const lastBill = await Bill.findOne().sort({ createdAt: -1 });
  const number = lastBill ? parseInt(lastBill.billNumber.replace('BILL-', '')) + 1 : 1001;
  return `BILL-${number}`;
};

// ==============================
// NEW: Get Service Catalog
// ==============================
exports.getServiceCatalog = asyncHandler(async (req, res, next) => {
  // Group services by category
  const categories = {};
  SERVICE_CATALOG.forEach((svc) => {
    if (!categories[svc.category]) {
      categories[svc.category] = [];
    }
    categories[svc.category].push(svc);
  });

  res.status(200).json({
    success: true,
    data: {
      services: SERVICE_CATALOG,
      categories,
    },
  });
});

// ==============================
// NEW: Patient submits service order with payment receipt (base64 image)
// ==============================
exports.submitServicePayment = asyncHandler(async (req, res, next) => {
  const { selectedServices, paymentReceipt, paymentMethod, notes } = req.body;

  if (!selectedServices || selectedServices.length === 0) {
    return next(new ErrorHandler('Please select at least one service', 400));
  }

  // Find patient profile
  const patient = await Patient.findOne({ userId: req.user.id });
  if (!patient) {
    return next(new ErrorHandler('Patient profile not found. Please complete your profile first.', 404));
  }

  // Map selected service IDs to catalog items and compute totals
  const items = [];
  let subtotal = 0;

  for (const sel of selectedServices) {
    const catalogItem = SERVICE_CATALOG.find((s) => s.id === sel.id);
    if (!catalogItem) {
      return next(new ErrorHandler(`Invalid service: ${sel.id}`, 400));
    }
    const qty = sel.quantity || 1;
    const total = catalogItem.price * qty;
    items.push({
      description: catalogItem.name,
      quantity: qty,
      unitPrice: catalogItem.price,
      total,
    });
    subtotal += total;
  }

  const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
  const totalAmount = subtotal + tax;
  const billNumber = await generateBillNumber();

  const bill = await Bill.create({
    patientId: patient._id,
    billNumber,
    items,
    subtotal,
    tax,
    totalAmount,
    paidAmount: totalAmount, // Patient claims full payment
    paymentStatus: 'Pending Verification',
    paymentDate: new Date(),
    paymentMethod: paymentMethod || 'Bank Transfer',
    paymentReceipt: paymentReceipt || null, // base64 image string
    notes: notes || '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  res.status(201).json({
    success: true,
    message: 'Payment submitted successfully! It will be verified by the admin.',
    data: bill,
  });
});

// ==============================
// NEW: Admin verifies or rejects a payment
// ==============================
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const { action } = req.body; // 'approve' or 'reject'

  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    return next(new ErrorHandler('Bill not found', 404));
  }

  if (action === 'approve') {
    bill.paymentStatus = 'Paid';
    bill.remainingAmount = 0;
  } else if (action === 'reject') {
    bill.paymentStatus = 'Unpaid';
    bill.paidAmount = 0;
    bill.remainingAmount = bill.totalAmount;
  } else {
    return next(new ErrorHandler('Invalid action. Use "approve" or "reject"', 400));
  }

  await bill.save();

  res.status(200).json({
    success: true,
    message: `Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    data: bill,
  });
});

// ==============================
// Existing endpoints (unchanged)
// ==============================

exports.createBill = asyncHandler(async (req, res, next) => {
  const { patientId, appointmentId, items, tax, dueDate } = req.body;

  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item.total;
  });

  totalAmount += tax || 0;

  const billNumber = await generateBillNumber();

  const bill = await Bill.create({
    patientId,
    appointmentId,
    billNumber,
    items,
    subtotal: totalAmount - (tax || 0),
    tax: tax || 0,
    totalAmount,
    dueDate,
  });

  res.status(201).json({
    success: true,
    data: bill,
  });
});

exports.getBill = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id)
    .populate({ path: 'patientId', populate: { path: 'userId' } });

  if (!bill) {
    return next(new ErrorHandler('Bill not found', 404));
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.getPatientBills = asyncHandler(async (req, res, next) => {
  const bills = await Bill.find({ patientId: req.params.patientId }).sort({ billDate: -1 });

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills,
  });
});

exports.getMyBills = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({ userId: req.user.id });

  if (!patient) {
    return next(new ErrorHandler('Patient profile not found', 404));
  }

  const bills = await Bill.find({ patientId: patient._id }).sort({ billDate: -1 });

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills,
  });
});

exports.updateBill = asyncHandler(async (req, res, next) => {
  let bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new ErrorHandler('Bill not found', 404));
  }

  bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.recordPayment = asyncHandler(async (req, res, next) => {
  const { paidAmount } = req.body;

  let bill = await Bill.findById(req.params.id);

  if (!bill) {
    return next(new ErrorHandler('Bill not found', 404));
  }

  bill.paidAmount = (bill.paidAmount || 0) + paidAmount;
  bill.remainingAmount = bill.totalAmount - bill.paidAmount;

  if (bill.remainingAmount === 0) {
    bill.paymentStatus = 'Paid';
    bill.paymentDate = new Date();
  } else if (bill.paidAmount > 0) {
    bill.paymentStatus = 'Partial';
  }

  await bill.save();

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.getAllBills = asyncHandler(async (req, res, next) => {
  const bills = await Bill.find()
    .populate({ path: 'patientId', populate: { path: 'userId' } })
    .sort({ billDate: -1 });

  res.status(200).json({
    success: true,
    count: bills.length,
    data: bills,
  });
});
