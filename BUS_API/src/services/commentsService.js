const db = require('../config/db');

exports.createComment = async (user_id, route_id, content) => {
  const reservation = await db.query(
    `
    SELECT id FROM reservations
    WHERE user_id = $1 AND route_id = $2 AND status = 'completado'
    LIMIT 1
    `,
    [user_id, route_id]
  );

  if (reservation.rowCount === 0) {
    throw new Error("No puedes comentar una ruta sin haberla completado");
  }

  const result = await db.query(
    `
    INSERT INTO comments (user_id, route_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [user_id, route_id, content]
  );
  return result.rows[0];
};

exports.getCommentsByRoute = async (route_id) => {
  const result = await db.query(
    `
    SELECT c.id, c.content, c.created_at, u.email
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.route_id = $1
    ORDER BY c.created_at DESC
    `,
    [route_id]
  );
  return result.rows;
};

exports.deleteComment = async (comment_id, user_id, user_role) => {
  const comment = await db.query(
    `SELECT * FROM comments WHERE id = $1`,
    [comment_id]
  );

  if (comment.rowCount === 0) {
    throw new Error("Comentario no encontrado");
  }

  const commentData = comment.rows[0];
  const isOwner = commentData.user_id === user_id;
  const isAdminOrMod = user_role === 'admin' || user_role === 'moderator';

  if (!isOwner && !isAdminOrMod) {
    throw new Error("No tienes permisos para eliminar este comentario");
  }

  await db.query(
    `DELETE FROM comments WHERE id = $1`,
    [comment_id]
  );
};