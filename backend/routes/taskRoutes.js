const express = require('express');
const {
  createTask,
  getTasks,
  acceptTask,
  completeTask
} = require('../controllers/taskController');

const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id/accept', protect, acceptTask);
router.put('/:id/complete', protect, completeTask);

module.exports = router;
