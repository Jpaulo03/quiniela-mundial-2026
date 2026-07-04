 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GrupoUsuario = sequelize.define('GrupoUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grupoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  puntajeTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'grupos_usuarios',
  timestamps: true,
});

module.exports = GrupoUsuario;