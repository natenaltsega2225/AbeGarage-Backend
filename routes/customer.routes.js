const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const validateCustomer = require("../middlewares/validateCustomer");

// POST endpoint for adding a customer
router.post(
  "/api/add-customer",
  validateCustomer,
  customerController.addCustomer
);

// Route to update customer information
router.put('/api/update-customer/:hash', customerController.updateCustomer);


module.exports = router;

