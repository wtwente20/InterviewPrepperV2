const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserResource = sequelize.define('UserResource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  resource_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  resource_link: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  resource_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'UserResources',
  timestamps: false,
  freezeTableName: true,
});

module.exports = UserResource;
