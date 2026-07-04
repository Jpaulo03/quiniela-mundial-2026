 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partido = sequelize.define('Partido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  equipoLocal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  equipoVisitante: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  golesLocal: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  golesVisitante: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fase: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_curso', 'finalizado'),
    defaultValue: 'pendiente',
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estadio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idApiExterna: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
}, {
  tableName: 'partidos',
  timestamps: true,
});

module.exports = Partido;