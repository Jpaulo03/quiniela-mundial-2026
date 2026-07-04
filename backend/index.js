 
const express = require('express');
const { sequelize } = require('./src/models/index');
require('dotenv').config();

const app = express();

app.use(express.json());

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