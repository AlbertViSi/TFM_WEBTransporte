const express = require('express');
const router = express.Router();

const routesController = require('../controllers/routesController');
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../middlewares/roles')

router.put(
  '/:id/capacity',
  verifyToken,
  allowRoles(ROLES.admin),
  routesController.updateCapacity
);

router.put(
  '/:id/base-price',
  verifyToken,
  allowRoles(ROLES.admin),
  routesController.updateBasePrice
);

router.get(
  '/',
  verifyToken,
  allowRoles(ROLES.admin),
  routesController.getAllRoutes
);

//Busqueda basica sin requerir login
router.get('/search', routesController.searchRoutes);


router.get('/detail/:route_id', routesController.getRouteDetail)

module.exports = router;