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
    `
    SELECT id, username, email, role_id, active
    FROM users
    WHERE role_id != 1
    ORDER BY id
    `
  );
  return result.rows;
};
//Borrar usuario
exports.deleteUser = async (id) => {

  const userCheck = await db.query(
    `
    SELECT role_id, active
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  if (userCheck.rowCount === 0) {
    throw new Error("Usuario no encontrado");
  }
  //Evita desactivar administrador
  if (userCheck.rows[0].role_id === 1) {
    throw new Error("No se puede desactivar un administrador");
  }
  //Comprueba que el usuario no este ya desactivado
  if (userCheck.rows[0].active === false) {
    throw new Error("El usuario ya está desactivado");
  }

  await db.query(
    `
    UPDATE users
    SET active = false
    WHERE id = $1
    `,
    [id]
  );
};

exports.reactivateUser = async (id) => {

  const userCheck = await db.query(
    `
    SELECT role_id, active
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  if (userCheck.rowCount === 0) {
    throw new Error("Usuario no encontrado");
  }

  if (userCheck.rows[0].role_id === 1) {
    throw new Error("No se puede modificar un administrador");
  }

  if (userCheck.rows[0].active === true) {
    throw new Error("El usuario ya está activo");
  }

  await db.query(
    `
    UPDATE users
    SET active = true
    WHERE id = $1
    `,
    [id]
  );
};
