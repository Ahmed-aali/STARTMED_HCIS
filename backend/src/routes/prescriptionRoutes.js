const express = require('express');
const {
  createPrescription,
  getPrescription,
  getPatientPrescriptions,
  getMyPrescriptions,
  updatePrescription,
  downloadPrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/my-prescriptions', protect, authorize('patient'), getMyPrescriptions);
router.get('/patient/:patientId', protect, getPatientPrescriptions);
router.get('/download/:id', protect, downloadPrescription);
router.get('/:id', protect, getPrescription);
router.put('/:id', protect, authorize('doctor', 'admin'), updatePrescription);

module.exports = router;
