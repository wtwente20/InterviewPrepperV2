const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'interview_prepper',
    password: 'password',
    database: 'interview_prepper',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
