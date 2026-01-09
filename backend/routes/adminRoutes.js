const express = require('express');
const {
  getAllUsers,
  getAllTasks,
  banUser
} = require('../controllers/adminController');

const protect = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/tasks', protect, adminOnly, getAllTasks);
router.put('/ban/:id', protect, adminOnly, banUser);

module.exports = router;
