const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../middlewares/roles')

const adminController = require('../controllers/adminController');

// POST crear usuario
router.post('/users', verifyToken, allowRoles(ROLES.admin), adminController.createUserByAdmin);

// GET lista usuarios
router.get('/users', verifyToken, allowRoles(ROLES.admin), adminController.getUsers);

// Desactivar usuario por ID
router.put('/users/:id/deactivate', verifyToken, allowRoles(ROLES.admin), adminController.deleteUser);

// Activar usuario
router.put(
  '/users/:id/reactivate',
  verifyToken,
  allowRoles(ROLES.admin),
  adminController.reactivateUser
);

module.exports = router;