const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  share_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Shares',
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
  },
  feedback_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  suggested_answer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Answers',
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Feedbacks',
  timestamps: false,
  freezeTableName: true
});

module.exports = Feedback;
