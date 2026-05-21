const { body } = require('express-validator');

const taskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be Pending, In Progress, or Completed'),
  body('deadline').isISO8601().toDate().withMessage('Deadline must be a valid date'),
  body('assignedTo').notEmpty().withMessage('Assigned user is required'),
  body('project').notEmpty().withMessage('Project is required'),
];

module.exports = { taskValidator };
