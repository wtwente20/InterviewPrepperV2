const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require("../models/category")

const Resource = sequelize.define('Resource', {
  resource_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resource_link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resource_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  tableName: 'Resources',
  timestamps: false,
  freezeTableName: true,
});

module.exports = Resource;
