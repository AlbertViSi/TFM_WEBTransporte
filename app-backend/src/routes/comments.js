const express = require('express');
const router = express.Router();

const { verifyToken  } = require('../middlewares/authMiddleware');
const commentsController = require('../controllers/commentsController');

router.post('/', verifyToken , commentsController.createComment);
router.get('/:route_id', commentsController.getCommentsByRoute);
router.delete('/:id', verifyToken , commentsController.deleteComment);

module.exports = router;