const reservationsService = require('../services/reservationsService');

exports.createReservation = async (req, res) => {
  try {
    const {
      route_id,
      departure_date,
      dni,
      origin_node_id,
      destination_node_id
    } = req.body;
    const user_id = req.user.id;

    if (!route_id || !departure_date || !dni || !origin_node_id || !destination_node_id) {
      return res.status(400).json({
        error: "Faltan parámetros obligatorios"
      });
    }

    const reservation = await reservationsService.createReservation(
      user_id,
      route_id,
      departure_date,
      dni,
      origin_node_id,
      destination_node_id
    );

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const reservations = await reservationsService.getUserReservations(user_id);
    res.json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.user.id;
    await reservationsService.deleteReservation(id, user_id);
    res.json({ message: "Reserva cancelada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};