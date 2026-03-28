const ratingsService = require('../services/commentsService');

exports.createRating = async (req, res) => {
  try {
    const { route_id, rating } = req.body;
    const user_id = req.user.id;

    const result = await ratingsService.createOrUpdateRating(
      user_id,
      route_id,
      rating
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};