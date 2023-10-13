const db = require('./database');

async function testConnection() {
    try {
        const [rows, fields] = await db.query("SELECT 1 + 1 AS solution");
        console.log('Database connection has been established successfully:', rows[0].solution);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();
