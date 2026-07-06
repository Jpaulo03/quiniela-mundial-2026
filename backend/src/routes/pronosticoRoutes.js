const express = require('express');
const router = express.Router();
const {
  registrarPronostico,
  modificarPronostico,
  obtenerMisPronosticos,
  obtenerPosicionEnGrupo,
} = require('../controllers/pronosticoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { validarPronostico } = require('../middlewares/validaciones');

router.post('/', verificarToken, validarPronostico, registrarPronostico);

router.put('/:id', verificarToken, modificarPronostico);

router.get('/mis-pronosticos', verificarToken, obtenerMisPronosticos);

router.get('/clasificacion/:grupoId', verificarToken, obtenerPosicionEnGrupo);

module.exports = router;