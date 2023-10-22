const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CollectionQuestion = sequelize.define('CollectionQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'QuestionCollections',
      key: 'id'
    },
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Questions',
      key: 'id'
    },
  }
}, {
  tableName: 'CollectionQuestions',
  timestamps: false,
  freezeTableName: true,
});

module.exports = CollectionQuestion;
