const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  sender_name: {
    type: DataTypes.STRING(255),
    allowNull: false,  // Assuming it can be null, adjust as per your requirement
  },
  last_message_content: {
    type: DataTypes.TEXT,
    allowNull: true,  // Assuming it can be null, adjust as per your requirement
  },
  unread_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'Conversations',
  timestamps: true,
  freezeTableName: true,
});

module.exports = Conversation;
