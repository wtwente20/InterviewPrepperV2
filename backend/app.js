const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Test DB Connection
const assertDatabaseConnection = async () => {
  try {
      await sequelize.authenticate();
      console.log('Database connected!');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1); // Stop the process if connection is not successful
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    assertDatabaseConnection();
});
