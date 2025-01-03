// import order service
const {
  createOrderr,
  getAllOrders,
  getsingleOrderr,
  customerOrderss,
  updateOrderr,
} = require("../services/order.service");

async function createOrder(req, res, next) {
  // console.log(req.body.service_completed.length);

  if (req.body.order_services.length < 1) {
    return res.status(400).json({
      error: "Please select at least one service!",
    });
  }
  try {
    const createdOrder = await createOrderr(req.body);

    if (!createdOrder) {
      return res.status(400).json({
        error: "Failed/Incomplete to add the Order!",
      });
    } else {
      res.status(200).json({ status: "Order added successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: "Something went wrong!",
    });
  }
}

async function getAllOrderrs(req, res, next) {
  // Call the getAllOrders method from the order service
  const orders = await getAllOrders();
  // console.log(orders);
  if (!orders) {
    res.status(400).json({
      error: "Failed to get all orders! No orders!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: orders,
    });
  }
}
async function getsingleOrder(req, res, next) {
  const { order_hash } = req.params;

  try {
    const singleOrder = await getsingleOrderr(order_hash);

    if (!singleOrder[0]?.order_id) {
      res.status(400).json({
        error: "Failed to get the Order!",
      });
    } else {
      res.status(200).json({
        status: "Order retrieved successfully! ",
        singleOrder: singleOrder,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: "Something went wrong!",
    });
  }
}
async function customerOrders(req, res, next) {
  try {
    const customerOrder = await customerOrderss(req.params.hash);

    if (!customerOrder.length) {
      return res.status(400).json({
        error: "No Order Found!",
      });
    } else {
      return res.status(200).json({
        status: "Order Found!!",
        customerOrder: customerOrder,
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "Something went wrong!",
    });
  }
}
// Update an order

async function updateOrder(req, res) {
  try {
    const orderData = req.body;

    if (
      !Array.isArray(orderData.service_completed) ||
      orderData.service_completed.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Field 'service_completed' must be a non-empty array" });
    }

    const result = await updateOrderr(orderData);

    if (!result) {
      return res.status(400).json({ error: "Failed to update the order" });
    }
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
}

module.exports = {
  customerOrders,
  createOrder,
  getsingleOrder,
  getAllOrderrs,
  updateOrder,
};
