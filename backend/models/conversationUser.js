const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversationUser = sequelize.define('ConversationUser', {
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Conversations',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  last_read_at: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ConversationUsers',
  timestamps: false,
  freezeTableName: true,
  primaryKey: ['conversation_id', 'user_id'],
});

module.exports = ConversationUser;
