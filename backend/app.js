const express = require("express");
const db = require("./config/database");
const bodyParser = require("body-parser");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const answerRoutes = require("./routes/answerRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const performanceRoutes = require('./routes/performanceRoutes');
const questionCollectionRoutes = require("./routes/questionCollectionRoutes");
const collectionQuestionRoutes = require("./routes/collectionQuestionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const logger = require("./config/logger");
const morgan = require('morgan');
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

// Test DB Connection
const assertDatabaseConnection = async () => {
  try {
    await db.authenticate();
    logger.info("Database connected!");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1); // Stop the process if connection is not successful
  }
};

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/interviews", interviewRoutes);
app.use("/performances", performanceRoutes);
app.use("/questionCollections", questionCollectionRoutes);
app.use("/collectionQuestions", collectionQuestionRoutes);
app.use("/categories", categoryRoutes)

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  assertDatabaseConnection();
});
