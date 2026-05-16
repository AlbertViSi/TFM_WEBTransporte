const db = require('../config/db');

exports.createOrUpdateRating = async (user_id, route_id, rating) => {
  const reservation = await db.query(
    `
    SELECT id FROM reservations
    WHERE user_id = $1 AND route_id = $2 AND status = 'completado'
    LIMIT 1
    `,
    [user_id, route_id]
  );

  if (reservation.rowCount === 0) {
    throw new Error("No puedes valorar una ruta sin haberla completado");
  }

  const result = await db.query(
    `
    INSERT INTO ratings (user_id, route_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, route_id)
    DO UPDATE SET rating = EXCLUDED.rating
    RETURNING *
    `,
    [user_id, route_id, rating]
  );
  return result.rows[0];
};

exports.getRatingsByRoute = async (route_id) => {
  const result = await db.query(
    `
    SELECT rating, user_id
    FROM ratings
    WHERE route_id = $1
    `,
    [route_id]
  );
  return result.rows;
};