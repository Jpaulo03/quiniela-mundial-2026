 
const express = require('express');
const router = express.Router();
const {
  obtenerPartidos,
  obtenerPartidoPorId,
  crearPartido,
  actualizarPartido,
} = require('../controllers/partidoController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, obtenerPartidos);

router.get('/:id', verificarToken, obtenerPartidoPorId);

router.post('/', verificarToken, verificarAdmin, crearPartido);

router.put('/:id', verificarToken, verificarAdmin, actualizarPartido);

module.exports = router;