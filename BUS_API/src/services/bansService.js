const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createBan = async ({ dni, reason, expires_at }) => {
  if (!dni) throw new Error("Se debe especificar un DNI");
  const dni_hash = await bcrypt.hash(dni, 10);
  const now = new Date();

  let status = 'activo';
  if (expires_at) {
    const expDate = new Date(expires_at);
    if (expDate <= now) status = 'expirado';
    else if (expDate.getFullYear() >= 3000) status = 'permanente';
  } else {
    status = 'permanente';
    expires_at = '3000-01-01';
  }

  const result = await db.query(
    `INSERT INTO bans (dni_hash, reason, status, created_at, expires_at)
     VALUES ($1, $2, $3, NOW(), $4)
     RETURNING *`,
    [dni_hash, reason, status, expires_at]
  );
  return result.rows[0];
};

exports.getBans = async () => {
  const result = await db.query(
    `SELECT id, dni_hash, reason, status, created_at, expires_at
     FROM bans
     ORDER BY created_at DESC`
  );
  return result.rows;
};

exports.deleteBan = async (id) => {
  const result = await db.query(
    `DELETE FROM bans WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rowCount === 0) throw new Error("Baneo no encontrado");
  return result.rows[0];
};