 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupo = sequelize.define('Grupo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigoInvitacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  creadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'grupos',
  timestamps: true,
});

module.exports = Grupo;