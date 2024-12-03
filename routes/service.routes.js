const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const serviceController = require("../controllers/service.controller");

// Admin and Manager route for adding service
router.post(
   "/api/service",
   authMiddleware.verifyToken,
   authMiddleware.isAdminOrManagerForService, // Combined check for Admin or Manager
   serviceController.addService
);

// create a route to handel the get all services request
router.get(
  "/api/services",
  // [verifyToken, isAdmin],
  serviceController.getAllServices
);
// Route for getting a single service by ID
router.get(
   "/api/service/:id", // URL parameter for service ID
  //[verifyToken], // Token validation middleware
  serviceController.getSingleService // Call the controller to fetch the service
 );
// Admin and Manager route for updating service
router.put(
   "/api/service/:id",
   authMiddleware.verifyToken,
   authMiddleware.isAdminOrManagerForService, // Combined check for Admin or Manager
   serviceController.updateService
);
router.delete(
   "/api/service/:id",
   // authMiddleware.verifyToken,
   // authMiddleware.isAdminOrManagerForService, // Combined check for Admin or Manager
   serviceController.deleteService
);
module.exports = router;
