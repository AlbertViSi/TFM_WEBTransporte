const usersService = require('../services/usersService');

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