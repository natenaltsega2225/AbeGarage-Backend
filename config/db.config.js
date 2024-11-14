//Import mysql module
const mysql = require('mysql2/promise');
//Create a connection to the database
const connection = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    // jwt:process.env.JWT_SECRET
    socketPath: process.env.DB_SOCKET
});
//Check the connection
connection.getConnection((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Database connected');
    }
})
//Export the connection
module.exports = connection;