const express = require('express');
const router = express.Router();

const routesController = require('../controllers/routesController');
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../middlewares/roles')

router.put(
  '/:id/capacity',
  verifyToken,
  allowRoles(ROLES.admin, ROLES.node_builder),
  routesController.updateCapacity
);

router.put(
  '/:id/base-price',
  verifyToken,
  allowRoles(ROLES.admin, ROLES.node_builder),
  routesController.updateBasePrice
);

router.get(
  '/',
  verifyToken,
  allowRoles(ROLES.admin, ROLES.moderator, ROLES.node_builder),
  routesController.getAllRoutes
);

router.get(
  '/:route_id/nodes',
  verifyToken,
  allowRoles(ROLES.admin, ROLES.node_builder),
  routesController.getNodesByRoute
);

//Busqueda basica sin requerir login
router.get('/search', routesController.searchRoutes);

router.get('/detail/:route_id', routesController.getRouteDetail)


module.exports = router;