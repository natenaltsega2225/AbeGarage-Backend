// import the express module
const express = require("express");

// call the router method from express to create the router
const router = express.Router();

// import the customer controller
const vehicleController = require("../controllers/vehicle.controller");

// create a route to handle the employee request in post
router.post(
  "/api/vehicle",
  vehicleController.addVehicle
);

// create a route to handle the employee request in get
router.get(
  "/api/vehicle/single/:customer_hash",
  vehicleController.getSingleVehicle
);

// todo :  get single vehicle 
router.get(
  "/api/vehicle/:id",
  vehicleController.getVehicleById
);


// route to update vehicle 
router.put (
  "/api/vehicle/:id",  // ':id' will capture the vehicle_id from the URL
  vehicleController.updateVehicle
)
// export the router
module.exports = router;