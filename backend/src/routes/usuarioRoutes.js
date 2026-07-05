 
const express = require('express');
const router = express.Router();
const { obtenerPerfil, actualizarPerfil } = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/perfil', verificarToken, obtenerPerfil);

router.put('/perfil', verificarToken, actualizarPerfil);

module.exports = router;