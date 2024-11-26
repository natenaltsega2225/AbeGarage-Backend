const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const { Pool } = require("pg");

dotenv.config(); // Load environment variables from .env file

// Validate required environment variables for both MySQL and PostgreSQL
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASS",
  "DB_NAME",
  "DB_POSTGRES_CONNECTION_STRING",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const config = {
  mysql: {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  postgres: {
    connectionString: process.env.DB_POSTGRES_CONNECTION_STRING,
    pool: {
      max: 20, // Max connections in the pool
      min: 4, // Min connections in the pool
      idleTimeoutMillis: 30000, // Timeout after 30 seconds of inactivity
    },
  },
};

// MySQL connection pool setup
const mysqlConnection = mysql.createPool(config.mysql);

// PostgreSQL Sequelize connection (ORM) setup
const sequelize = new Sequelize(config.postgres.connectionString, {
  dialect: "postgres",
  logging: false, // Disable SQL logging for better performance (optional)
  pool: config.postgres.pool,
});

// PostgreSQL connection pool setup for direct queries
const pgPool = new Pool(config.postgres.pool);

// Utility function for consistent error handling
function handleError(err, dbName) {
  console.error(`${dbName} connection error: ${err.message}`);
}

// Function to test MySQL connection
async function testMysqlConnection() {
  try {
    const connection = await mysqlConnection.getConnection();
    console.log("MySQL Database connected");
    connection.release(); // Release the connection after use
  } catch (err) {
    handleError(err, "MySQL");
  }
}

// Function to test PostgreSQL connection using Sequelize (ORM)
async function testPostgresConnection() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Database connected (Sequelize ORM)");
  } catch (err) {
    handleError(err, "PostgreSQL (Sequelize ORM)");
  }
}

// Function to test PostgreSQL connection using Pool (direct query)
async function testPgPoolConnection() {
  try {
    const client = await pgPool.connect();
    console.log("PostgreSQL Database connected (Pool)");
    client.release(); // Release the connection back to the pool
  } catch (err) {
    handleError(err, "PostgreSQL (Pool)");
  }
}

// Method to execute queries on PostgreSQL using the pool
async function queryPg(text, params) {
  try {
    const res = await pgPool.query(text, params);
    return res;
  } catch (err) {
    handleError(err, "PostgreSQL");
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
    // Close MySQL pool
    await mysqlConnection.end();
    // Close PostgreSQL pool
    await pgPool.end();
    // Close Sequelize connection
    await sequelize.close();
    console.log("Database connections closed gracefully.");
  } catch (err) {
    handleError(err, "Connection Shutdown");
  }
}

// Export the configuration and necessary modules for use across your app
module.exports = {
  config, // Centralized config
  mysqlConnection, // MySQL connection pool
  sequelize, // PostgreSQL connection via Sequelize ORM
  pgPool, // PostgreSQL connection pool (direct queries)
  testConnections, // Test connections function
  queryPg, // PostgreSQL query execution method
  closeConnections, // Graceful shutdown function
};
