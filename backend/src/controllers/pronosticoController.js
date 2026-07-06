 
const { Pronostico, Partido, GrupoUsuario } = require('../models/index');

const registrarPronostico = async (req, res) => {
  try {
    const { partidoId, golesLocalPronosticado, golesVisitantePronosticado } = req.body;

    const partido = await Partido.findByPk(partidoId);
    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }

    if (partido.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'No se puede pronosticar un partido que ya comenzó o finalizó' });
    }

    const pronosticoExistente = await Pronostico.findOne({
      where: { usuarioId: req.usuario.id, partidoId },
    });
    if (pronosticoExistente) {
      return res.status(400).json({ mensaje: 'Ya tienes un pronóstico para este partido' });
    }

    const nuevoPronostico = await Pronostico.create({
      usuarioId: req.usuario.id,
      partidoId,
      golesLocalPronosticado,
      golesVisitantePronosticado,
    });

    return res.status(201).json({
      mensaje: 'Pronóstico registrado exitosamente',
      pronostico: nuevoPronostico,
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar pronóstico', error });
  }
};

const modificarPronostico = async (req, res) => {
  try {
    const { id } = req.params;
    const { golesLocalPronosticado, golesVisitantePronosticado } = req.body;

    const pronostico = await Pronostico.findByPk(id);
    if (!pronostico) {
      return res.status(404).json({ mensaje: 'Pronóstico no encontrado' });
    }

    if (pronostico.usuarioId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este pronóstico' });
    }

    const partido = await Partido.findByPk(pronostico.partidoId);
    if (partido.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'No se puede modificar un pronóstico de un partido que ya comenzó' });
    }

    if (golesLocalPronosticado !== undefined) pronostico.golesLocalPronosticado = golesLocalPronosticado;
    if (golesVisitantePronosticado !== undefined) pronostico.golesVisitantePronosticado = golesVisitantePronosticado;

    await pronostico.save();

    return res.status(200).json({
      mensaje: 'Pronóstico modificado exitosamente',
      pronostico,
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al modificar pronóstico', error });
  }
};

const obtenerMisPronosticos = async (req, res) => {
  try {
    const pronosticos = await Pronostico.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{ model: Partido, as: 'partido' }],
    });

    return res.status(200).json({ pronosticos });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener pronósticos', error });
  }
};

const obtenerPosicionEnGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;

    const clasificacion = await GrupoUsuario.findAll({
      where: { grupoId },
      include: [{ model: require('../models/Usuario'), as: 'usuario', attributes: ['id', 'nombre'] }],
      order: [['puntajeTotal', 'DESC']],
    });

    return res.status(200).json({ clasificacion });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener clasificación', error });
  }
};

module.exports = {
  registrarPronostico,
  modificarPronostico,
  obtenerMisPronosticos,
  obtenerPosicionEnGrupo,
};