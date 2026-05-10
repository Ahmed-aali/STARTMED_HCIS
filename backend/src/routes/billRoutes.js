const express = require('express');
const {
  createBill,
  getBill,
  getPatientBills,
  getMyBills,
  updateBill,
  recordPayment,
  getAllBills,
  getServiceCatalog,
  submitServicePayment,
  verifyPayment,
} = require('../controllers/billController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Service catalog (public for patients)
router.get('/services', protect, getServiceCatalog);

// Patient submits a service order with payment receipt
router.post('/service-payment', protect, authorize('patient'), submitServicePayment);

// Admin verifies/rejects a payment
router.put('/:id/verify', protect, authorize('admin'), verifyPayment);

router.post('/', protect, authorize('admin'), createBill);
router.get('/my-bills', protect, authorize('patient'), getMyBills);
router.get('/all', protect, authorize('admin'), getAllBills);
router.get('/patient/:patientId', protect, getPatientBills);
router.get('/:id', protect, getBill);
router.put('/:id/pay', protect, recordPayment);
router.put('/:id', protect, authorize('admin'), updateBill);

module.exports = router;
