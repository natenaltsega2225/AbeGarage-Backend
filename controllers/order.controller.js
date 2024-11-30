const orderService = require("../services/order.service");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    if (!orders) {
      res.status(400).json({
        error: "failed to get all orders",
      });
    } else if (orders) {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllOrders,
};
