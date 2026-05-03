const express = require('express');
const {
  bookAppointment,
  getAppointment,
  getMyAppointments,
  updateAppointment,
  getAllAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/all', protect, authorize('admin'), getAllAppointments);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, authorize('doctor', 'admin'), updateAppointment);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
