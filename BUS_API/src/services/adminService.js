const db = require('../config/db');
const bcrypt = require('bcrypt');

// Crear usuario
exports.createUserByAdmin = async (username, email, password, roleName) => {
  const roleResult = await db.query(
    `SELECT id FROM roles WHERE name = $1`,
    [roleName]
  );

  if (roleResult.rowCount === 0) {
    throw new Error(`El rol '${roleName}' no existe`);
  }
  
  const role_id = roleResult.rows[0].id;
  const password_hash = await bcrypt.hash(password, 10);
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
//obtener lista usuarios
exports.getUsers = async () => {
  const result = await db.query(
    `SELECT id, username, email, role_id FROM users ORDER BY id`
  );
  return result.rows;
};
//Borrar usuario
exports.deleteUser = async (id) => {
  // evita eliminar el admin principal
  if (id == 1) throw new Error("No se puede eliminar el admin principal");

  const result = await db.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );

  if (result.rowCount === 0) throw new Error("Usuario no encontrado");
};