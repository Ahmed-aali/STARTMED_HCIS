const express = require('express');
const {
  registerPatient,
  getPatient,
  getMyProfile,
  updatePatient,
  getAllPatients,
  searchPatients,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, registerPatient);
router.get('/profile/me', protect, authorize('patient'), getMyProfile);
router.get('/search', protect, authorize('admin', 'doctor'), searchPatients);
router.get('/', protect, authorize('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, getPatient);
router.put('/:id', protect, updatePatient);

module.exports = router;
