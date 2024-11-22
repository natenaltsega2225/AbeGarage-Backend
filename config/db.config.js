// Import required modules
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const { Pool } = require("pg");

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
const sequelize = new Sequelize(
  process.env.POSTGRES_CONNECTION_STRING ||
    "postgres://user:password@localhost:5432/db_name"
);

// PostgreSQL connection pool setup for direct queries
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
    console.log("PostgreSQL Database connected (Sequelize)");
  } catch (err) {
    console.error("PostgreSQL connection error (Sequelize): ", err.message);
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
  const res = await pgPool.query(text, params);
  return res;
};

// Function to test both MySQL and PostgreSQL connections
async function testConnections() {
  await testMysqlConnection();
  await testPostgresConnection();
  await testPgPoolConnection();
}

// Export both connections and utility functions
module.exports = {
  mysqlConnection,
  sequelize,
  pgPool,
  testConnections,
  query: exports.query,
};
