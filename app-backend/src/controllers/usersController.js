const usersService = require('../services/usersService');
const db = require('../config/db');

exports.registerUser = async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const user = await usersService.registerUser(
      username,
      email,
      password
    );

    res.status(201).json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error creando usuario"
    });

  }

};

exports.getProfile = async (req, res) => {

  try {

    const user = await db.query(
      `SELECT id, username, email, role_id 
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    res.json(user.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};
