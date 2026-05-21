const express = require('express');
const authMiddleware = require('../middleware/auth');
const permit = require('../middleware/role');
const { getUsers } = require('../controllers/userController');

const router = express.Router();
router.use(authMiddleware);
router.get('/', permit('admin'), getUsers);

module.exports = router;
