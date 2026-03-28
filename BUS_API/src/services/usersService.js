const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (username, email, password) => {

  // contraseña
  const password_hash = await bcrypt.hash(password, 10);

  // obtener role de "user"
  const roleResult = await db.query(
    `SELECT id FROM roles WHERE name = 'user'`
  );

  const role_id = roleResult.rows[0].id;

  // insertar usuario
  const result = await db.query(
    `
    INSERT INTO users (username, email, password_hash, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role_id
    `,
    [username, email, password_hash, role_id]
  );

  return result.rows[0];

};