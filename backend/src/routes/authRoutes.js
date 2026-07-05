const express = require('express');
const router = express.Router();
const { registrar, iniciarSesion } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registrar', registrar);

router.post('/iniciar-sesion', iniciarSesion);

router.post('/cerrar-sesion', verificarToken, (req, res) => {
  return res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
});

module.exports = router;