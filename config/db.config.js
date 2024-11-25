// db.config.js (for centralizing the configuration)
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const config = {
  mysql: {
    connectionLimit: 10,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "mysql_db",
    port: process.env.DB_PORT || 3306,
  },
  postgres: {
    connectionString:
      process.env.POSTGRES_CONNECTION_STRING ||
      "postgres://user:password@localhost:5000/Abe-Garage",
    pool: {
      user: process.env.PG_USER || "your-db-user",
      host: process.env.PG_HOST || "localhost",
      database: process.env.PG_DB_NAME || "your-db-name",
      password: process.env.PG_PASSWORD || "your-db-password",
      port: process.env.PG_PORT || 5432,
    },
  },
};

module.exports = config;
