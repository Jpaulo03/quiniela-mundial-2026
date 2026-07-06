 
const axios = require('axios');
const { Op } = require('sequelize');
const { Partido, Pronostico, GrupoUsuario } = require('../models/index');
require('dotenv').config();

const calcularPuntaje = (pronostico, partido) => {
  const acertoLocalExacto = pronostico.golesLocalPronosticado === partido.golesLocal;
  const acertoVisitanteExacto = pronostico.golesVisitantePronosticado === partido.golesVisitante;

  if (acertoLocalExacto && acertoVisitanteExacto) {
    return 3;
  }

  const ganadorReal =
    partido.golesLocal > partido.golesVisitante ? 'local' :
    partido.golesVisitante > partido.golesLocal ? 'visitante' : 'empate';

  const ganadorPronosticado =
    pronostico.golesLocalPronosticado > pronostico.golesVisitantePronosticado ? 'local' :
    pronostico.golesVisitantePronosticado > pronostico.golesLocalPronosticado ? 'visitante' : 'empate';

  if (ganadorReal === ganadorPronosticado) {
    return 1;
  }

  return 0;
};

const actualizarPuntajesUsuarios = async (partidoId) => {
  const pronosticos = await Pronostico.findAll({
    where: { partidoId, puntajeObtenido: { [Op.not]: null } },
  });

  for (const pronostico of pronosticos) {
    const membresias = await GrupoUsuario.findAll({
      where: { usuarioId: pronostico.usuarioId },
    });

    for (const membresia of membresias) {
      membresia.puntajeTotal += pronostico.puntajeObtenido;
      await membresia.save();
    }
  }
};

const sincronizarPartidos = async () => {
  try {
    console.log('Iniciando sincronización de partidos...');

    const hoy = new Date().toISOString().split('T')[0];

    const url = `${process.env.URL_API_DEPORTES}/eventsday.php?d=${hoy}&l=FIFA%20World%20Cup`;
    const respuesta = await axios.get(url);

    const eventos = respuesta.data.events;

    if (!eventos || eventos.length === 0) {
      console.log('No hay partidos hoy en thesportsdb');
      return;
    }

    for (const evento of eventos) {
      const partido = await Partido.findOne({
        where: { idApiExterna: evento.idEvent },
      });

      if (!partido) continue;

      const estaFinalizado = evento.strStatus === 'Match Finished';
      const yaEstabaFinalizado = partido.estado === 'finalizado';

      partido.golesLocal = parseInt(evento.intHomeScore) || 0;
      partido.golesVisitante = parseInt(evento.intAwayScore) || 0;
      partido.estado = estaFinalizado ? 'finalizado' :
                       evento.intHomeScore !== null ? 'en_curso' : 'pendiente';

      await partido.save();

      if (estaFinalizado && !yaEstabaFinalizado) {
        const pronosticos = await Pronostico.findAll({
          where: { partidoId: partido.id },
        });

        for (const pronostico of pronosticos) {
          pronostico.puntajeObtenido = calcularPuntaje(pronostico, partido);
          await pronostico.save();
        }

        await actualizarPuntajesUsuarios(partido.id);
        console.log(`Puntajes calculados para partido ${partido.id}`);
      }
    }

    console.log('Sincronización completada');

  } catch (error) {
    console.error('Error en sincronización:', error.message);
  }
};

module.exports = { sincronizarPartidos };