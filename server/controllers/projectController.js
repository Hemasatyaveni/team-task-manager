const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, description, members = [] } = req.body;
  try {
    const validMembers = await User.find({ _id: { $in: members } }).select('_id');
    const project = new Project({
      name,
      description,
      members: validMembers.map((user) => user._id),
      createdBy: req.user._id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, description, members } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.members = Array.isArray(members) ? members : project.members;

    await project.save();
    const updatedProject = await Project.findById(id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.remove();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
