 
const express = require('express');
const router = express.Router();
const {
  registrarPronostico,
  modificarPronostico,
  obtenerMisPronosticos,
  obtenerPosicionEnGrupo,
} = require('../controllers/pronosticoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, registrarPronostico);

router.put('/:id', verificarToken, modificarPronostico);

router.get('/mis-pronosticos', verificarToken, obtenerMisPronosticos);

router.get('/clasificacion/:grupoId', verificarToken, obtenerPosicionEnGrupo);

module.exports = router;