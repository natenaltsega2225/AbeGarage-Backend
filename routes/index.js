// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee routes
const employeeRoutes = require("./employee.routes");
const serviceRoutes = require("./service.routes");
//Import the install router
const installRouter = require("./install.routes");

// Import the service router
const serviceRouter = require('./service.routes')
//Add the isntall router to the main router
router.use(installRouter);
// Import the login routes
const loginRoutes = require("./login.routes");
//Import the customer routes
const customerRouter = require("./customer.routes");
//Import the vehicle routes
const vehicleRouter = require("./vehicle.routes");
//Import the order routes
const orderRouter = require("./order.routes");
//Import the install routes
const installRoutes = require("./install.routes");
// Add the employee routes to the main router
router.use(employeeRoutes);
// Add the install routes to the main router
router.use(installRoutes);
// Add the login routes to the main router
router.use(serviceRoutes);

router.use(loginRoutes);
//Add the customer routes to the main router
router.use(customerRouter);
//Add the vehicle routes to the main router
router.use(vehicleRouter);
//Add the order routes to the main router
router.use(orderRouter);
// Export the router

module.exports = router;
