const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../middlewares/roles')

const adminController = require('../controllers/adminController');

// POST crear usuario
router.post('/users', verifyToken, allowRoles(ROLES.admin), adminController.createUserByAdmin);

// GET lista usuarios
router.get('/users', adminController.getUsers);

// DELETE usuario por ID
router.delete('/users/:id', verifyToken, allowRoles(ROLES.admin), adminController.deleteUser);

module.exports = router;