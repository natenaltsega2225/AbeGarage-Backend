// Import required modules
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// MySQL connection configuration using mysql2/promise
const mysqlConnection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// PostgreSQL connection configuration using Sequelize
// Update the connection string to use the correct format
const sequelize = new Sequelize(
  process.env.POSTGRES_CONNECTION_STRING ||
    "postgres://user:password@localhost:5000/db.config"
);

// Function to test MySQL connection
async function testMysqlConnection() {
  try {
    const connection = await mysqlConnection.getConnection();
    console.log("MySQL Database connected");
    connection.release(); // Release the connection after use
  } catch (err) {
    console.error("MySQL connection error: ", err.message);
  }
}

// Function to test Sequelize (PostgreSQL) connection
async function testPostgresConnection() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Database connected");
  } catch (err) {
    console.error("PostgreSQL connection error: ", err.message);
  }
}

// Test both connections
async function testConnections() {
  await testMysqlConnection();
  await testPostgresConnection();
}

// Export both connections
module.exports = {
  mysqlConnection,
  sequelize,
  testConnections,
};
