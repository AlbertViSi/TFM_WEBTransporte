const express = require('express');
require('dotenv').config();

const db = require('./config/db');

// Crea ruta
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const nodesRoutes = require('./routes/nodes');
const authRoutes = require('./routes/auth');
const bansRoutes = require('./routes/bans');
const routesRoutes = require('./routes/routes');
const commentsRoutes = require('./routes/comments');
const ratingsRoutes = require('./routes/ratings');
const reservationsRoutes = require('./routes/reservations');

const app = express();
const port = 3000;

app.use(express.json());

// Usa Rutas
app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);
app.use('/nodes', nodesRoutes);
app.use('/auth', authRoutes);
app.use('/bans', bansRoutes);
app.use('/routes', routesRoutes);
app.use('/comments', commentsRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/reservations', reservationsRoutes);

//Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

//Endpoint para probar la conexión a PostgreSQL
app.get('/test-db', async (req, res) => {
  try {

    const result = await db.query('SELECT NOW()');

    res.json({
      message: "Conexión a PostgreSQL correcta",
      server_time: result.rows[0]
    });

  } catch (error) {

    console.error("Error conectando con la base de datos:", error);

    res.status(500).json({
      error: "Error conectando con PostgreSQL"
    });

  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});