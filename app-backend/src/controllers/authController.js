const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

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