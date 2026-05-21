const express = require('express');
const authMiddleware = require('../middleware/auth');
const permit = require('../middleware/role');
const { projectValidator } = require('../validators/projectValidator');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getProjects);
router.post('/', permit('admin'), projectValidator, createProject);
router.put('/:id', permit('admin'), projectValidator, updateProject);
router.delete('/:id', permit('admin'), deleteProject);

module.exports = router;
