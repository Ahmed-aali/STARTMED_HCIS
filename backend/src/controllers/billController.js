const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { ErrorHandler, asyncHandler } = require('../utils/errorHandler');

const generateBillNumber = async () => {
  const lastBill = await Bill.findOne().sort({ createdAt: -1 });
  const number = lastBill ? parseInt(lastBill.billNumber.replace('BILL-', '')) + 1 : 1001;
  return `BILL-${number}`;
};

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
