const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/authMiddleware');
const ratingsController = require('../controllers/ratingsController');

router.post('/ratings', authenticateToken, ratingsController.createRating);
router.get('/ratings/:route_id', ratingsController.getRatingsByRoute);

module.exports = router;