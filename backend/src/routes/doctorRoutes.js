const express = require('express');
const {
  registerDoctor,
  getDoctor,
  getAllDoctors,
  getMyProfile,
  updateDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, registerDoctor);
router.get('/profile/me', protect, authorize('doctor'), getMyProfile);
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);
router.put('/:id', protect, updateDoctor);

module.exports = router;
