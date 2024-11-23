// Import required modules
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const { Pool } = require("pg");

// MySQL connection pool setup using mysql2/promise
const mysqlConnection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "mysql2_db",
  port: process.env.DB_PORT || 3306,
});

// PostgreSQL connection configuration using Sequelize (ORM)
const sequelize = new Sequelize(
  process.env.POSTGRES_CONNECTION_STRING ||
    "postgres://user:password@localhost:5432/db_name"
);

// PostgreSQL connection pool setup for direct queries (pg)
const pgPool = new Pool({
  user: process.env.PG_USER || "your-db-user",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DB_NAME || "your-db-name",
  password: process.env.PG_PASSWORD || "your-db-password",
  port: process.env.PG_PORT || 5432,
});

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
exports.query = async (text, params) => {
  try {
    const res = await pgPool.query(text, params);
    return res;
  } catch (err) {
    console.error("PostgreSQL query execution error: ", err.message);
    throw err; // Rethrow error after logging it
  }
};

// Function to test connections to both MySQL and PostgreSQL
async function testConnections() {
  await testMysqlConnection();
  await testPostgresConnection();
  await testPgPoolConnection();
}

// Export all necessary modules and methods
module.exports = {
  mysqlConnection,
  sequelize,
  pgPool,
  testConnections,
  query: exports.query,
};
