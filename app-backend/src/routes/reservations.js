const express = require('express');
const router = express.Router();

const reservationsController = require('../controllers/reservationsController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, reservationsController.createReservation);

router.get('/user', verifyToken, reservationsController.getUserReservations);

router.delete('/:id', verifyToken, reservationsController.deleteReservation);

module.exports = router;