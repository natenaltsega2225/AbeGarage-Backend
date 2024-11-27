//Import mysql module
const mysql = require("mysql2/promise");

//Create a connection to the database
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // port:process.env.DB_PORT
});
//connect to the database
connection.getConnection((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Database connected");
  }
});

//Export the connection
module.exports = connection;
