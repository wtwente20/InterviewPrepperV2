const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCategory = sequelize.define('UserCategory', {
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
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
}, {
  tableName: 'UserCategories',
  timestamps: false,
  freezeTableName: true,
});

module.exports = UserCategory;
