const commentsService = require('../services/commentsService');

exports.createComment = async (req, res) => {
  try {
    const { route_id, content } = req.body;
    const user_id = req.user.id;

    const result = await commentsService.createComment(
      user_id,
      route_id,
      content
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentsByRoute = async (req, res) => {
  try {
    const route_id = req.params.route_id;

    const comments = await commentsService.getCommentsByRoute(route_id);

    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    const user_id = req.user.id;
    const user_role = req.user.role_name;

    await commentsService.deleteComment(comment_id, user_id, user_role);

    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};