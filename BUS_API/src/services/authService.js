const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.changePassword = async (user_id, current_password, new_password) => {

  // 1️⃣ Obtener usuario
  const user = await db.query(
    `SELECT password FROM users WHERE id = $1`,
    [user_id]
  );

  if (user.rowCount === 0) {
    throw new Error("Usuario no encontrado");
  }

  const storedPassword = user.rows[0].password;

  // 2️⃣ Verificar contraseña actual
  const validPassword = await bcrypt.compare(
    current_password,
    storedPassword
  );

  if (!validPassword) {
    throw new Error("Contraseña actual incorrecta");
  }

  // 3️⃣ Hash nueva contraseña
  const hashedPassword = await bcrypt.hash(new_password, 10);

  // 4️⃣ Actualizar contraseña
  await db.query(
    `UPDATE users SET password = $1 WHERE id = $2`,
    [hashedPassword, user_id]
  );

};