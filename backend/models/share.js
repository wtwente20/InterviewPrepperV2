const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Share = sequelize.define('Share', {
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
  share_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shared_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  visibility: {
    type: DataTypes.ENUM('PUBLIC', 'FRIENDS', 'PRIVATE'),
    allowNull: false,
    defaultValue: 'PUBLIC'
  }
}, {
  tableName: 'Shares',
  timestamps: false
});

module.exports = Share;
