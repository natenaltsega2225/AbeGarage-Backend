// db.connection.js (for handling MySQL, PostgreSQL, and connection pooling)
const { Sequelize } = require("sequelize");
const { Pool } = require("pg");
const mysql = require("mysql2/promise");
const config = require("./db.config"); // Import configuration

// MySQL connection pool setup
const mysqlConnection = mysql.createPool(config.mysql);

// PostgreSQL Sequelize connection (ORM)
const sequelize = new Sequelize(config.postgres.connectionString, {
  dialect: "postgres",
  logging: false, // Disable SQL logging for better performance (optional)
});

// PostgreSQL connection pool setup for direct queries
const pgPool = new Pool(config.postgres.pool);

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

// Function to test PostgreSQL connection using Sequelize (ORM)
async function testPostgresConnection() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Database connected (Sequelize ORM)");
  } catch (err) {
    console.error("PostgreSQL connection error (Sequelize ORM): ", err.message);
  }
}

// Function to test PostgreSQL connection using Pool (direct query)
async function testPgPoolConnection() {
  try {
    const client = await pgPool.connect();
    console.log("PostgreSQL Database connected (Pool)");
    client.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("PostgreSQL connection error (Pool): ", err.message);
  }
}

// Method to execute queries on PostgreSQL using the pool
async function queryPg(text, params) {
  try {
    const res = await pgPool.query(text, params);
    return res;
  } catch (err) {
    console.error("PostgreSQL query execution error: ", err.message);
    throw err; // Rethrow error after logging it
  }
}

// Function to test connections to both MySQL and PostgreSQL
async function testConnections() {
  await testMysqlConnection();
  await testPostgresConnection();
  await testPgPoolConnection();
}

// Graceful shutdown (close pool and connections when app stops)
async function closeConnections() {
  try {
    await mysqlConnection.end(); // Close MySQL connections
    await pgPool.end(); // Close PostgreSQL pool
    console.log("Database connections closed gracefully.");
  } catch (err) {
    console.error("Error closing database connections: ", err.message);
  }
}

// Export all necessary modules and methods
module.exports = {
  mysqlConnection,
  sequelize,
  pgPool,
  testConnections,
  queryPg,
  closeConnections,
};
