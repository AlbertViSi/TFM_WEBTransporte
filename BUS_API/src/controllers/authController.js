const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const result = await db.query(
      `SELECT u.id, u.username, u.password_hash, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    
    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // puedes ajustar
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.changePassword = async (req, res) => {
  try {

    const { current_password, new_password } = req.body;
    const user_id = req.user.id;

    if (!current_password || !new_password) {
      return res.status(400).json({
        error: "Faltan parámetros"
      });
    }

    await authService.changePassword(
      user_id,
      current_password,
      new_password
    );

    res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};