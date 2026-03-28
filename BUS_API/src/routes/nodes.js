const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/authMiddleware');

const nodesController = require('../controllers/nodesController');
router.get('/', nodesController.getNodes);

router.get('/main', nodesController.getMainNodes);

router.post('/subnode', verifyToken, allowRoles('node_builder', 'admin'), nodesController.createSubnode);
router.get('/subnodes', nodesController.getSubnodes);
router.delete('/subnode/:id', verifyToken, allowRoles('node_builder', 'admin'), nodesController.deleteSubnode);
router.put('/subnode/:id/reassign', verifyToken, allowRoles('node_builder', 'admin'), nodesController.reassignSubnode);

module.exports = router;