const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const ratingsController = require('../controllers/ratingsController');

router.post('/', verifyToken, ratingsController.createRating);
router.get('/:route_id', ratingsController.getRatingsByRoute);

module.exports = router;