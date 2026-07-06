 
const { Op } = require('sequelize');
const { Partido } = require('../models/index');

const obtenerPartidos = async (req, res) => {
  try {
    const { fase, fecha, estado } = req.query;

    const filtros = {};

    if (fase) {
      filtros.fase = fase;
    }

    if (estado) {
      filtros.estado = estado;
    }

    if (fecha) {
      const inicioDia = new Date(fecha);
      const finDia = new Date(fecha);
      finDia.setHours(23, 59, 59, 999);
      filtros.fecha = { [Op.between]: [inicioDia, finDia] };
    }

    const partidos = await Partido.findAll({
      where: filtros,
      order: [['fecha', 'ASC']],
    });

    return res.status(200).json({ partidos });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener partidos', error });
  }
};

const obtenerPartidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const partido = await Partido.findByPk(id);

    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }

    return res.status(200).json({ partido });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener partido', error });
  }
};

const crearPartido = async (req, res) => {
  try {
    const {
      equipoLocal,
      equipoVisitante,
      fecha,
      fase,
      ciudad,
      estadio,
      idApiExterna,
    } = req.body;

    const nuevoPartido = await Partido.create({
      equipoLocal,
      equipoVisitante,
      fecha,
      fase,
      ciudad,
      estadio,
      idApiExterna,
    });

    return res.status(201).json({
      mensaje: 'Partido creado exitosamente',
      partido: nuevoPartido,
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear partido', error });
  }
};

const actualizarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipoLocal, equipoVisitante, fecha, fase, ciudad, estadio, estado } = req.body;

    const partido = await Partido.findByPk(id);

    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }

    if (equipoLocal) partido.equipoLocal = equipoLocal;
    if (equipoVisitante) partido.equipoVisitante = equipoVisitante;
    if (fecha) partido.fecha = fecha;
    if (fase) partido.fase = fase;
    if (ciudad) partido.ciudad = ciudad;
    if (estadio) partido.estadio = estadio;
    if (estado) partido.estado = estado;

    await partido.save();

    return res.status(200).json({
      mensaje: 'Partido actualizado exitosamente',
      partido,
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar partido', error });
  }
};

module.exports = {
  obtenerPartidos,
  obtenerPartidoPorId,
  crearPartido,
  actualizarPartido,
};