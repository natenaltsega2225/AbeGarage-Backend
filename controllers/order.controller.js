// import order service
const { createOrderr,getAllOrders, getsingleOrderr } = require("../services/order.service");

async function createOrder(req, res, next) {
  // console.log(req.body.order_services.length);

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
  const {order_hash} = req.params;

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

module.exports = {
  createOrder,
  getsingleOrder,
  getAllOrderrs
};
