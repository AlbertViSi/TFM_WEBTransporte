const express = require('express');
const router = express.Router();

const routesController = require('../controllers/routesController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const routesController = require('../controllers/routesController');

router.put(
  '/:id/capacity',
  authenticateToken,
  authorizeRoles('admin'),
  routesController.updateCapacity
);

router.put(
  '/:id/base-price',
  authenticateToken,
  authorizeRoles('admin'),
  routesController.updateBasePrice
);

router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  routesController.getAllRoutes
);

//Busqueda basica sin requerir login
router.get('/search', routesController.searchRoutes);


module.exports = router;