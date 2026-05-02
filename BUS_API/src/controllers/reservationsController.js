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

    console.log("paso 1");
    if (route_id === undefined || route_id === null || !departure_date || !dni || !origin_node_id || !destination_node_id) {
      console.log("error 1");
      console.log(req.body);
      return res.status(400).json({
        error: "Faltan parámetros obligatorios"
      });
    }
    console.log("paso 2");
    const reservation = await reservationsService.createReservation(
      user_id,
      route_id,
      departure_date,
      dni,
      origin_node_id,
      destination_node_id
    );
    console.log("paso 3");

    res.status(201).json(reservation);
  } catch (error) {
    console.error("ERROR SQL:", error);
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