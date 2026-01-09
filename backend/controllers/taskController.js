	const Task = require('../models/Task');
	const User = require('../models/User');

	exports.createTask = async (req, res) => {
	  try {
		const { title, description } = req.body;

		if (!title) {
		  return res.status(400).json({ message: 'Title is required' });
		}

		const task = await Task.create({
		  title,
		  description,
		  createdBy: req.user.id, // ✅ FIXED
		  location: req.user.location // ✅ required for geo queries
		});

		res.status(201).json(task);
	  } catch (err) {
		console.error('CREATE TASK ERROR:', err);
		res.status(500).json({ message: 'Failed to create task' });
	  }
	};

	exports.getTasks = async (req, res) => {
	  const page = Number(req.query.page) || 1;
	  const limit = 5;
	  const skip = (page - 1) * limit;

	  const user = req.user;

	  const tasks = await Task.find({
		location: {
		  $near: {
			$geometry: user.location,
			$maxDistance: 10000 // 10 km
		  }
		}
	  })
		.skip(skip)
		.limit(limit)
		.populate('createdBy', 'name');

	  res.json({ page, tasks });
	};

	exports.acceptTask = async (req, res) => {
	  const task = await Task.findById(req.params.id);

	  if (!task)
		return res.status(404).json({ message: 'Task not found' });

	  if (task.status !== 'OPEN')
		return res.status(400).json({ message: 'Task not available' });

	  if (task.createdBy.toString() === req.user.id) {
		return res.status(403).json({ message: 'You cannot accept your own task' });
	  }

	  task.status = 'ACCEPTED';
	  task.acceptedBy = req.user.id;
	  await task.save();

	  res.json(task);
	};

	exports.completeTask = async (req, res) => {
	  const task = await Task.findById(req.params.id);

	  if (!task)
		return res.status(404).json({ message: 'Task not found' });

	  if (task.createdBy.toString() !== req.user.id)
		return res.status(403).json({ message: 'Not authorized' });

	  if (task.status !== 'ACCEPTED')
		return res.status(400).json({ message: 'Task not in progress' });

	  task.status = 'COMPLETED';
	  await task.save();

	  await User.findByIdAndUpdate(task.createdBy, {
		$inc: { trustScore: 2 }
	  });

	  await User.findByIdAndUpdate(task.acceptedBy, {
		$inc: { trustScore: 5 }
	  });

	  res.json({
		message: 'Task completed successfully',
		task
	  });
	};
