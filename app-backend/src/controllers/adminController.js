const adminService = require('../services/adminService');

// Crear usuario 
exports.createUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await adminService.createUserByAdmin(
      username,
      email,
      password,
      role
    );
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message
    });
  }
};
// Obtener lista usuario
exports.getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};
// Desactivar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
// Activar usuario
exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.reactivateUser(id);
    res.json({
      message: "Usuario reactivado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message
    });
  }
};