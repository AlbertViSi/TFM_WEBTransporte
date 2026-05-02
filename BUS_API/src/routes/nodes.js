const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');
const { ROLES } = require('../middlewares/roles')

const nodesController = require('../controllers/nodesController');
router.get('/', nodesController.getNodes);

router.get('/main', nodesController.getMainNodes);

router.post('/subnode', verifyToken, allowRoles(ROLES.node_builder, ROLES.admin), nodesController.createSubnode);
router.get('/subnodes', nodesController.getSubnodes);
router.delete('/subnode/:id', verifyToken, allowRoles(ROLES.node_buider, ROLES.admin), nodesController.deleteSubnode);
router.put('/subnode/:id/reassign', verifyToken, allowRoles(ROLES.node_builder, ROLES.admin), nodesController.reassignSubnode);
router.get('/available-destinations/:id',nodesController.getAvailableDestinations);

module.exports = router;