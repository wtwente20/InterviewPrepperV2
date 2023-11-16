const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Performance = sequelize.define(
  "Performance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    interview_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Interviews",
        key: "id",
      },
    },
    confidence_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    technical_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    behavioral_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    overall_feeling: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    summary: {
      type: DataTypes.TEXT,
    },
    struggled_question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Questions",
        key: "id",
      },
    },
    well_answered_question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Questions",
        key: "id",
      },
    },
    struggled_answer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Answers",
        key: "id",
      },
    },
    well_answered_answer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Answers",
        key: "id",
      },
    },
  },
  {
    tableName: "performances",
    timestamps: false,
  }
);

module.exports = Performance;
