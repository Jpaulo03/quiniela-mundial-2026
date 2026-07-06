 
const { Op } = require('sequelize');
const { Usuario, Grupo, GrupoUsuario, Partido, Pronostico } = require('../models/index');

const obtenerDashboard = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const membresias = await GrupoUsuario.findAll({
      where: { usuarioId },
      include: [{ model: Grupo, as: 'grupo' }],
    });

    const cantidadGrupos = membresias.length;

    const puntajeAcumulado = membresias.reduce((total, membresia) => {
      return total + membresia.puntajeTotal;
    }, 0);

    const posicionEnGrupos = await Promise.all(
      membresias.map(async (membresia) => {
        const clasificacion = await GrupoUsuario.findAll({
          where: { grupoId: membresia.grupoId },
          order: [['puntajeTotal', 'DESC']],
        });

        const posicion = clasificacion.findIndex(
          (m) => m.usuarioId === usuarioId
        ) + 1;

        return {
          grupoId: membresia.grupoId,
          nombreGrupo: membresia.grupo.nombre,
          posicion,
          puntajeTotal: membresia.puntajeTotal,
        };
      })
    );

    const partidosPendientes = await Partido.findAll({
      where: { estado: 'pendiente' },
      order: [['fecha', 'ASC']],
      limit: 5,
    });

    const partidosSinPronostico = await Promise.all(
      partidosPendientes.map(async (partido) => {
        const pronostico = await Pronostico.findOne({
          where: { usuarioId, partidoId: partido.id },
        });
        if (!pronostico) {
          return {
            id: partido.id,
            equipoLocal: partido.equipoLocal,
            equipoVisitante: partido.equipoVisitante,
            fecha: partido.fecha,
            fase: partido.fase,
            ciudad: partido.ciudad,
          };
        }
        return null;
      })
    );

    const proximosPartidos = partidosSinPronostico.filter(
      (partido) => partido !== null
    );

    return res.status(200).json({
      cantidadGrupos,
      puntajeAcumulado,
      posicionEnGrupos,
      proximosPartidos,
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener dashboard', error });
  }
};

module.exports = { obtenerDashboard };