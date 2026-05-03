const express = require('express');
const {
  createMedicalRecord,
  getMedicalRecord,
  getPatientMedicalRecords,
  getMyMedicalRecords,
  updateMedicalRecord,
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('doctor'), createMedicalRecord);
router.get('/my-records', protect, authorize('patient'), getMyMedicalRecords);
router.get('/patient/:patientId', protect, getPatientMedicalRecords);
router.get('/:id', protect, getMedicalRecord);
router.put('/:id', protect, authorize('doctor', 'admin'), updateMedicalRecord);

module.exports = router;
