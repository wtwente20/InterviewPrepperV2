const sequelize = require("../config/database");
const DataTypes = require('sequelize');

const Interview = sequelize.define('Interviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  interview_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  position_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false
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
    tableName: 'interviews',
    timestamps: true
});

module.exports = Interview;