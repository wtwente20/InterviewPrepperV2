const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserReaction = sequelize.define('UserReaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  reaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Reactions',
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
  reacted_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reacted_item_type: {
    type: DataTypes.ENUM('SHARE', 'FEEDBACK'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'UserReactions',
  timestamps: false,
  freezeTableName: true,
});

module.exports = UserReaction;
