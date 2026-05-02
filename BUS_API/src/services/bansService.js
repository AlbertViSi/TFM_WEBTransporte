const db = require('../config/db');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.DNI_SECRET, 'salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

exports.createBan = async ({ dni, reason, expires_at }) => {
  if (!dni) throw new Error("Se debe especificar un DNI");
  const dni_encrypted = encrypt(dni);
  const now = new Date();

  let status = 'activo';
  if (expires_at) {
    const expDate = new Date(expires_at);
    if (expDate <= now) status = 'expirado';
    else if (expDate.getFullYear() >= 3000) status = 'permanente';
  } else {
    status = 'permanente';
    expires_at = '3000-01-01';
  }

  const result = await db.query(
    `INSERT INTO bans (dni_encrypted, reason, status, created_at, expires_at)
     VALUES ($1, $2, $3, NOW(), $4)
     RETURNING *`,
    [dni_encrypted, reason, status, expires_at]
  );
  return result.rows[0];
};

exports.getBans = async () => {
  const result = await db.query(
    `SELECT id, dni_encrypted, reason, status, created_at, expires_at
     FROM bans
     ORDER BY created_at DESC`
  );
  return result.rows.map(b => ({
    ...b,
    dni: decrypt(b.dni_encrypted)
  }));
};

exports.deleteBan = async (id) => {
  const result = await db.query(
    `DELETE FROM bans WHERE id = $1 RETURNING *`,
    [id]
  );
  if (result.rowCount === 0) throw new Error("Baneo no encontrado");
  return result.rows[0];
};