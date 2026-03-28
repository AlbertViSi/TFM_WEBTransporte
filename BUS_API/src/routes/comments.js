const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/authMiddleware');
const commentsController = require('../controllers/commentsController');

router.post('/comments', authenticateToken, commentsController.createComment);
router.get('/comments/:route_id', commentsController.getCommentsByRoute);
router.delete('/comments/:id', authenticateToken, commentsController.deleteComment);

module.exports = router;