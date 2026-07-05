 
const { v4: uuidv4 } = require('uuid');
const { Grupo, GrupoUsuario, Usuario } = require('../models/index');

const crearGrupo = async (req, res) => {
  try {
    const { nombre } = req.body;

    const codigoInvitacion = uuidv4().substring(0, 8).toUpperCase();

    const nuevoGrupo = await Grupo.create({
      nombre,
      codigoInvitacion,
      creadorId: req.usuario.id,
    });

    await GrupoUsuario.create({
      grupoId: nuevoGrupo.id,
      usuarioId: req.usuario.id,
    });

    return res.status(201).json({
      mensaje: 'Grupo creado exitosamente',
      grupo: {
        id: nuevoGrupo.id,
        nombre: nuevoGrupo.nombre,
        codigoInvitacion: nuevoGrupo.codigoInvitacion,
      },
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear grupo', error });
  }
};

const obtenerCodigoInvitacion = async (req, res) => {
  try {
    const { id } = req.params;

    const grupo = await Grupo.findByPk(id);

    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }

    if (grupo.creadorId !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este código' });
    }

    return res.status(200).json({ codigoInvitacion: grupo.codigoInvitacion });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener código de invitación', error });
  }
};

const unirseAGrupo = async (req, res) => {
  try {
    const { codigoInvitacion } = req.body;

    const grupo = await Grupo.findOne({ where: { codigoInvitacion } });

    if (!grupo) {
      return res.status(404).json({ mensaje: 'Código de invitación inválido' });
    }

    const miembroExistente = await GrupoUsuario.findOne({
      where: { grupoId: grupo.id, usuarioId: req.usuario.id },
    });

    if (miembroExistente) {
      return res.status(400).json({ mensaje: 'Ya eres miembro de este grupo' });
    }

    await GrupoUsuario.create({
      grupoId: grupo.id,
      usuarioId: req.usuario.id,
    });

    return res.status(200).json({
      mensaje: 'Te uniste al grupo exitosamente',
      grupo: {
        id: grupo.id,
        nombre: grupo.nombre,
      },
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al unirse al grupo', error });
  }
};

const obtenerMisGrupos = async (req, res) => {
  try {
    const grupos = await GrupoUsuario.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{ model: Grupo, as: 'grupo' }],
    });

    return res.status(200).json({ grupos });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener grupos', error });
  }
};

const obtenerParticipantes = async (req, res) => {
  try {
    const { id } = req.params;

    const grupo = await Grupo.findByPk(id);

    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }

    const participantes = await GrupoUsuario.findAll({
      where: { grupoId: id },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }],
    });

    return res.status(200).json({ participantes });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener participantes', error });
  }
};

module.exports = {
  crearGrupo,
  obtenerCodigoInvitacion,
  unirseAGrupo,
  obtenerMisGrupos,
  obtenerParticipantes,
};