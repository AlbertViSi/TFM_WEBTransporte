const loginService = require('../services/loginService');
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginService.login(
      username,
      password
    );
    res.json(result);
  } catch (error) {
      res.status(400).json({
      error: error.message
    });
  }
};
