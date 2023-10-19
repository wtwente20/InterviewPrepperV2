const sequelize = require("../config/database");
const DataTypes = require('sequelize');

const DefaultQuestion = sequelize.define('DefaultQuestions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  question_text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    tableName: 'default_questions',
    timestamps: false
});

module.exports = DefaultQuestion;
