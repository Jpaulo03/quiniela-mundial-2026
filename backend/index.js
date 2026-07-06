const express = require('express');
const { sequelize } = require('./src/models/index');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const grupoRoutes = require('./src/routes/grupoRoutes');
const partidoRoutes = require('./src/routes/partidoRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/grupos', grupoRoutes);

app.use('/api/partidos', partidoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Quiniela Mundial 2026 funcionando' });
});

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL exitosa');

    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados');

    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en http://localhost:${puerto}`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

iniciarServidor();