const express = require('express');
const authMiddleware = require('../middleware/auth');
const permit = require('../middleware/role');
const { taskValidator } = require('../validators/taskValidator');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getTasks);
router.post('/', permit('admin'), taskValidator, createTask);
router.put('/:id', permit('admin', 'member'), taskValidator, updateTask);
router.delete('/:id', permit('admin'), deleteTask);

module.exports = router;
