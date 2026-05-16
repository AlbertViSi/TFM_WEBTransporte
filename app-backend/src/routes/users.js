const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/register', usersController.registerUser);
router.get(
  '/profile',
  verifyToken,
  usersController.getProfile
);

module.exports = router;