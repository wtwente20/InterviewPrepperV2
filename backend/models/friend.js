const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Friend = sequelize.define('Friend', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  friend_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  friendship_status: {
    type: DataTypes.ENUM,
    values: ['PENDING', 'ACCEPTED'],
    defaultValue: 'PENDING'
  },
  block_status: {
    type: DataTypes.ENUM,
    values: ['NONE', 'BLOCKED_BY_USER', 'BLOCKED_BY_FRIEND', 'BLOCKED_BOTH'],
    defaultValue: 'NONE'
  },
  action_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'Friends',
  timestamps: false
});

module.exports = Friend;
