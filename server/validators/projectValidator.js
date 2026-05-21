const { body } = require('express-validator');

const projectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('members').optional().isArray().withMessage('Members must be an array of user IDs'),
];

module.exports = { projectValidator };
