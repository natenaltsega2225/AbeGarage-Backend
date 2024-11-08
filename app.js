//Import the express module
const express = require('express');
//Import the dotenv module and call the config method
require('dotenv').config();
//Import the cors module
const cors = require('cors');
// Import the router module
const router = require('./routes');
//Create a variable to store the port number
const PORT = process.env.PORT;

// Create the web server
const app = express();
// Use the cors middleware
app.use(cors());

// Use the express.json middleware to parse JSON requests
app.use(express.json());
// Add the routes to the application as middleware 
app.use(router);
//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;