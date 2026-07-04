 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pronostico = sequelize.define('Pronostico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  partidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  golesLocalPronosticado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  golesVisitantePronosticado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  puntajeObtenido: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
}, {
  tableName: 'pronosticos',
  timestamps: true,
});

module.exports = Pronostico;