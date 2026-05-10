const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  generateReports,
  verifyDoctor,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/reports', protect, authorize('admin'), generateReports);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id', protect, authorize('admin'), updateUserStatus);
router.put('/doctors/:id/verify', protect, authorize('admin'), verifyDoctor);

module.exports = router;
