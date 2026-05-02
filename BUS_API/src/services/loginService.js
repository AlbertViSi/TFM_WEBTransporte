const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (username, password) => {

  const result = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (result.rowCount === 0) {
    throw new Error("Usuario no encontrado");
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
      role_id: user.role_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role_id: user.role_id
    }
  };
};
