const jwt = require('jsonwebtoken');

// Tokens
exports.verifyToken = (req, res, next) => {
  // Obtener token del header Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  // Verificar token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Roles
exports.allowRoles = (...roles) => (req, res, next) => {

  if (!roles.includes(req.user.role_name)) {
    return res.status(403).json({ error: "No autorizado" });
  }

  next();
};