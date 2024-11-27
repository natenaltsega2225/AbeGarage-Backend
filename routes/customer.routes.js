const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Import middleware

// Route to add a new customer (requires token and admin privileges)
router.post(
  "/api/add-customer",
  authMiddleware.verifyToken, // Check for valid token
  authMiddleware.isAdmin, // Ensure the user is an admin
  customerController.addCustomer
);

// Route to get all customers (requires token only)
router.get(
  "/api/customers",
  //authMiddleware.verifyToken, // Check for valid token
  customerController.getAllCustomers
);

// Route to search for customers by search term (requires token only)
// router.get(
//    "/api/customers/search",
//    authMiddleware.verifyToken, // Check for valid token
//    customerController.searchCustomers // Route for search
// );

// Route to get a customer by ID (requires token only)
// router.get(
//    "/api/customers/:id",
//    authMiddleware.verifyToken, // Check for valid token
//    customerController.getCustomerById
// );
// Route to get a single customer by hash
router.get("/api/customer/:hash", customerController.getSingleCustomerByHash);
// Route to update customer information

// Route to update customer information
router.put("/api/update-customer/:hash", customerController.updateCustomer);

module.exports = router;
