// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee routes
const employeeRoutes = require("./employee.routes");
//import order routes
const orderRoutes=require("./order.routes")
//Import the install router
const installRouter = require("./install.routes");
//Add the isntall router to the main router
router.use(installRouter);
// Import the login routes
const loginRoutes = require("./login.routes");
//Import the install routes
const installRoutes = require("./install.routes");
// Add the employee routes to the main router
router.use(employeeRoutes);
// Add the install routes to the main router
router.use(installRoutes);
// Add the login routes to the main router
router.use(loginRoutes);
//add order routes to main router
router.use(orderRoutes)
// Export the router
module.exports = router;

