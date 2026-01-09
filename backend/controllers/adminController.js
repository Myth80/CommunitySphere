const User = require('../models/User');
const Task = require('../models/Task');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate('createdBy', 'name email')
    .populate('acceptedBy', 'name email');

  res.json(tasks);
};

exports.banUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isBanned = true;
  await user.save();

  res.json({ message: 'User banned successfully' });
};
