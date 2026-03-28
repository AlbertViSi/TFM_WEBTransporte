const express = require('express');
const router = express.Router();
const bansController = require('../controllers/bansController');
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');

// Todas las rutas requieren token y rol moderator/admin
//router.use(verifyToken, allowRoles('moderator', 'admin'));

router.post('/', bansController.createBan);
router.get('/', bansController.getBans);
router.delete('/:id', bansController.deleteBan);

module.exports = router;