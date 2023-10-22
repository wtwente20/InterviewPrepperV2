const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reaction = sequelize.define('Reaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  reaction_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  reaction_icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'Reactions',
  timestamps: false,
  freezeTableName: true,
});

module.exports = Reaction;
