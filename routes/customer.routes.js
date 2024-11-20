const express = require("express");
const router = express.Router();

// Protect route with token verification and admin role check
const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../services/customer.service");
const {
  verifyToken,
  verifyAdminRole,
} = require("../middlewares/authMiddleware");
// Admin Dashboard (protected by token and admin role)
router.get("/admin-dashboard", verifyToken, verifyAdminRole, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

// Fetch all customers (protected by token and admin role)
router.get(
  "/api/all-customers",
  verifyToken,
  verifyAdminRole,
  async (req, res) => {
    try {
      const customers = await getAllCustomers();
      return res.status(200).json({ customers });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching customers", error: error.message });
    }
  }
);

// Fetch a single customer by ID (protected by token)
router.get("/api/customer/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await getCustomerById(id);
    return res.status(200).json({ customer });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching customer", error: error.message });
  }
});

// Create a new customer (protected by token)
router.post("/api/customer", verifyToken, async (req, res) => {
  const customerData = req.body;
  try {
    const newCustomer = await createCustomer(customerData);
    return res.status(201).json({ customer: newCustomer });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating customer", error: error.message });
  }
});

// Update an existing customer (protected by token)
router.put("/api/customer/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const customerData = req.body;
  try {
    const updatedCustomer = await updateCustomer(id, customerData);
    return res.status(200).json({ customer: updatedCustomer });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating customer", error: error.message });
  }
});

// Delete a customer (protected by token)
router.delete("/api/customer/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCustomer(id);
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting customer", error: error.message });
  }
});

module.exports = router;