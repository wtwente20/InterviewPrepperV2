const sequelize = require("../config/database");
const DataTypes = require('sequelize');

const DefaultAnswer = sequelize.define('DefaultAnswers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  answer_text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  default_question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'DefaultQuestions',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
    tableName: 'DefaultAnswers',
    timestamps: false
});

module.exports = DefaultAnswer;
