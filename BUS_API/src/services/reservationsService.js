const db = require('../config/db');
const crypto = require('crypto');
const db = require('../config/db');
const crypto = require('crypto');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.createReservation = async (
  user_id,
  route_id,
  departure_date,
  dni,
  origin_node_id,
  destination_node_id
) => {

  const dni_hash = crypto
    .createHash('sha256')
    .update(dni)
    .digest('hex');

  const banned = await db.query(
    `
    SELECT * FROM bans
    WHERE dni_hash = $1
    AND status = 'activo'
    AND (expires_at IS NULL OR expires_at > NOW())
    `,
    [dni_hash]
  );

  if (banned.rowCount > 0) {
    throw new Error("DNI bloqueado");
  }

  const route = await db.query(
    `SELECT base_price, capacity FROM routes WHERE id = $1`,
    [route_id]
  );

  if (route.rowCount === 0) {
    throw new Error("Ruta no encontrada");
  }

  const { base_price, capacity } = route.rows[0];
  const nodesOrder = await db.query(
    `
    SELECT node_id, node_order
    FROM route_nodes
    WHERE route_id = $1
    AND node_id IN ($2, $3)
    `,
    [route_id, origin_node_id, destination_node_id]
  );

  if (nodesOrder.rowCount !== 2) {
    throw new Error("Origen o destino no pertenecen a la ruta");
  }

  let originOrder, destOrder;

  nodesOrder.rows.forEach(n => {
    if (n.node_id == origin_node_id) originOrder = n.node_order;
    if (n.node_id == destination_node_id) destOrder = n.node_order;
  });

  if (originOrder === undefined || destOrder === undefined) {
    throw new Error("Error en nodos");
  }

  const minOrder = Math.min(originOrder, destOrder);
  const maxOrder = Math.max(originOrder, destOrder);
  const nodes = await db.query(
    `
    SELECT n.latitude, n.longitude, rn.node_order
    FROM route_nodes rn
    JOIN nodes n ON rn.node_id = n.id
    WHERE rn.route_id = $1
    AND rn.node_order BETWEEN $2 AND $3
    ORDER BY rn.node_order
    `,
    [route_id, minOrder, maxOrder]
  );

  let totalDistance = 0;

  for (let i = 0; i < nodes.rows.length - 1; i++) {
    const n1 = nodes.rows[i];
    const n2 = nodes.rows[i + 1];
    totalDistance += getDistance(
      n1.latitude,
      n1.longitude,
      n2.latitude,
      n2.longitude
    );
  }

  const reservationsCount = await db.query(
    `
    SELECT COUNT(*) 
    FROM reservations
    WHERE route_id = $1
    AND departure_date = $2
    AND status != 'cancelado'
    `,
    [route_id, departure_date]
  );

  if (parseInt(reservationsCount.rows[0].count) >= capacity) {
    throw new Error("No hay plazas disponibles");
  }

  let price = totalDistance * 0.1 * base_price;

  const completedTrips = await db.query(
    `
    SELECT COUNT(*) 
    FROM reservations
    WHERE user_id = $1
    AND status = 'completed'
    `,
    [user_id]
  );

  if (parseInt(completedTrips.rows[0].count) >= 5) {
    price *= 0.9;
  }

  const result = await db.query(
    `
    INSERT INTO reservations 
    (user_id, route_id, origin_node_id, destination_node_id, dni_hash, total_price, status, departure_date)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
    RETURNING *
    `,
    [
      user_id,
      route_id,
      origin_node_id,
      destination_node_id,
      dni_hash,
      price,
      departure_date
    ]
  );

  return result.rows[0];
};

exports.getUserReservations = async (user_id) => {
  const result = await db.query(
    `
    SELECT *
    FROM reservations
    WHERE user_id = $1
    ORDER BY departure_date DESC
    `,
    [user_id]
  );
  return result.rows;
};

exports.deleteReservation = async (id, user_id) => {
  const reservation = await db.query(
    `SELECT * FROM reservations WHERE id = $1`,
    [id]
  );

  if (reservation.rowCount === 0) {
    throw new Error("Reserva no encontrada");
  }

  const resData = reservation.rows[0];

  if (resData.user_id !== user_id) {
    throw new Error("No puedes eliminar esta reserva");
  }

  if (resData.status === 'completed') {
    throw new Error("No puedes eliminar una reserva completada");
  }

  await db.query(
    `UPDATE reservations SET status = 'cancelado' WHERE id = $1`,
    [id]
  );
};