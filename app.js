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
//Import the routes
const routes = require('./routes');
//Use the routes
app.use(routes);
//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`database connected`);
});
module.exports = app;