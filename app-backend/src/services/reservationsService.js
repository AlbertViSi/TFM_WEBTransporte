const db = require('../config/db');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.DNI_SECRET, 'salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

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
  const dni_encrypted = encrypt(dni);

  const bans = await db.query(`
    SELECT dni_encrypted 
    FROM bans 
    WHERE status = 'activo'
    AND (expires_at IS NULL OR expires_at > NOW())
  `);

  for (const ban of bans.rows) {
    const bannedDni = decrypt(ban.dni_encrypted);

    if (bannedDni === dni) {
      throw new Error("DNI bloqueado");
    }
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
    AND status = 'completado'
    `,
    [user_id]
  );
  
  if (parseInt(completedTrips.rows[0].count) >= 5) {
    price *= 0.9;
  }
  
  const formattedDate = new Date(departure_date);
  
  const result = await db.query(
    `
    INSERT INTO reservations 
    (user_id, route_id, origin_node_id, destination_node_id, dni_encrypted, total_price, status, departure_date)
    VALUES ($1, $2, $3, $4, $5, $6, 'pendiente', $7)
    RETURNING *
    `,
    [
      user_id,
      route_id,
      origin_node_id,
      destination_node_id,
      dni_encrypted,
      price,
      formattedDate
    ]
  );
  
  return result.rows[0];
};

exports.getUserReservations = async (user_id) => {
  const result = await db.query(
    `
    SELECT 
      r.id,
      r.route_id,
      r.total_price,
      r.status,
      r.departure_date,
      r.dni_encrypted,
      routes.name AS route_name,
      origin.name AS origin_name,
      destination.name AS destination_name
    FROM reservations r
    JOIN routes ON routes.id = r.route_id
    JOIN nodes origin ON origin.id = r.origin_node_id
    JOIN nodes destination ON destination.id = r.destination_node_id
    WHERE r.user_id = $1
    ORDER BY r.departure_date DESC
    `,
    [user_id]
  );

  return result.rows.map(r => ({
    ...r,
    dni: decrypt(r.dni_encrypted)
  }));
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

  if (resData.status === 'completado') {
    throw new Error("No puedes eliminar una reserva completada");
  }

  await db.query(
    `UPDATE reservations SET status = 'cancelado' WHERE id = $1`,
    [id]
  );
};