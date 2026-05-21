const { validationResult } = require('express-validator');
const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, priority, status, deadline, assignedTo, project } = req.body;
  try {
    const task = new Task({ title, description, priority, status, deadline, assignedTo, project });
    await task.save();
    const savedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name description');
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user._id };

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .sort({ deadline: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, priority, status, deadline, assignedTo, project } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      if (status !== undefined) {
        task.status = status;
      } else {
        return res.status(403).json({ message: 'Members can only update task status' });
      }
    } else {
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
      if (deadline !== undefined) task.deadline = deadline;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (project !== undefined) task.project = project;
    }

    await task.save();
    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
