const express = require('express');
const router = express.Router();

const reservationsController = require('../controllers/reservationsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, reservationsController.createReservation);

router.get('/user', authenticateToken, reservationsController.getUserReservations);

router.delete('/:id', authenticateToken, reservationsController.deleteReservation);

module.exports = router;