const sequelize = require("../config/database");
const DataTypes = require('sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Optional at time of registration
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state_province: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  current_occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  goal_occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Mentor', 'Learner'],
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['user', 'admin'],
    defaultValue: 'user',
    allowNull: false
  }
}, {
    tableName: 'users',
    timestamps: false
});

User.beforeCreate(async (user) => {
  // Generate a salt, random set of bytes to mix with password.
  // Even if two users share a passowrd, the salt will be unique.
  const salt = await bcrypt.genSalt();
  // Hash the password with the salt and replace the plain-text password
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;