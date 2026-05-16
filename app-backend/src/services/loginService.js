const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (username, password) => {

  const result = await db.query(
    `
      SELECT u.*, r.name AS role_name
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.username = $1 AND u.active = true
    `,
    [username]
  );

  if (result.rowCount === 0) {
    throw new Error("Usuario invalido");
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
      role_name: user.role_name
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      role_name: user.role_name
    }
  };
};
