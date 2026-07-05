 
const express = require('express');
const router = express.Router();
const {
  crearGrupo,
  obtenerCodigoInvitacion,
  unirseAGrupo,
  obtenerMisGrupos,
  obtenerParticipantes,
} = require('../controllers/grupoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearGrupo);

router.get('/mis-grupos', verificarToken, obtenerMisGrupos);

router.post('/unirse', verificarToken, unirseAGrupo);

router.get('/:id/codigo-invitacion', verificarToken, obtenerCodigoInvitacion);

router.get('/:id/participantes', verificarToken, obtenerParticipantes);

module.exports = router;