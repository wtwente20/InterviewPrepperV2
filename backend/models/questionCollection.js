const sequelize = require("../config/database");
const { DataTypes } = require('sequelize');

const QuestionCollection = sequelize.define('QuestionCollection', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'QuestionCollections',
  timestamps: false
});

module.exports = QuestionCollection;
