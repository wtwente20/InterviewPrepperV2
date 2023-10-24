const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const PrivacySetting = sequelize.define('PrivacySetting', {
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
  show_email: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_name: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_city: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_state_province: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_country: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_current_occupation: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_goal_occupation: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_profile_picture: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_resume: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_status: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  },
  show_category: {
    type: DataTypes.ENUM,
    values: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
    defaultValue: 'PRIVATE'
  }
}, {
  tableName: 'PrivacySettings',
  timestamps: false
});

module.exports = PrivacySetting;
