 
const sequelize = require('../config/database');

const Usuario = require('./Usuario');
const Grupo = require('./Grupo');
const GrupoUsuario = require('./GrupoUsuario');
const Partido = require('./Partido');
const Pronostico = require('./Pronostico');

Usuario.hasMany(Grupo, { foreignKey: 'creadorId', as: 'gruposCreados' });
Grupo.belongsTo(Usuario, { foreignKey: 'creadorId', as: 'creador' });

Usuario.belongsToMany(Grupo, { through: GrupoUsuario, foreignKey: 'usuarioId', as: 'grupos' });
Grupo.belongsToMany(Usuario, { through: GrupoUsuario, foreignKey: 'grupoId', as: 'miembros' });

Grupo.hasMany(GrupoUsuario, { foreignKey: 'grupoId', as: 'participantes' });
GrupoUsuario.belongsTo(Grupo, { foreignKey: 'grupoId', as: 'grupo' });

Usuario.hasMany(GrupoUsuario, { foreignKey: 'usuarioId', as: 'membresias' });
GrupoUsuario.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasMany(Pronostico, { foreignKey: 'usuarioId', as: 'pronosticos' });
Pronostico.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Partido.hasMany(Pronostico, { foreignKey: 'partidoId', as: 'pronosticos' });
Pronostico.belongsTo(Partido, { foreignKey: 'partidoId', as: 'partido' });

module.exports = {
  sequelize,
  Usuario,
  Grupo,
  GrupoUsuario,
  Partido,
  Pronostico,
};