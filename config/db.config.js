//Import mysql module
const mysql = require('mysql2/promise');

//Create a connection to the database
const connection = mysql.createPool({
<<<<<<< HEAD
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
  // socketPath: process.env.DB_SOCKET
});
//Check the connection
=======
    connectionLimit: 10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})
 //connect to the database
>>>>>>> 044abfab1217b6d454f2a4bc02223d5f1e421043
connection.getConnection((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Database connected');
    }
})

//Export the connection
module.exports = connection;