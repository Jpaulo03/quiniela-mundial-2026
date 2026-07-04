 
const express = require('express');
const sequelize = require('./src/config/database');
require('dotenv').config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Quiniela Mundial 2026 funcionando' });
});

// Conexión a la base de datos e inicio del servidor
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