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

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    const user_id = req.user.id;
    const user_role = req.user.role;

    await commentsService.deleteComment(comment_id, user_id, user_role);

    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};