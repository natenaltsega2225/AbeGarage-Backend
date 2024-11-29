// const {
//   Order,
//   OrderInfo,
//   OrderService,
//   OrderStatus,
//   Employee,
//   Customer,
//   CustomerVehicleInfo,
//   CommonServices,
// } = require("../models"); // Assuming Sequelize models

const getAllOrders = async () => {
  try {
    // Query the database for all orders and join the necessary tables
    const orders = await Order.findAll({
      include: [
        {
          model: OrderInfo,
          attributes: [
            "order_total_price",
            "estimated_completion_date",
            "completion_date",
            "additional_request",
            "notes_for_internal_use",
            "notes_for_customer",
            "additional_requests_completed",
          ],
        },
        {
          model: OrderService,
          include: [
            {
              model: CommonServices,
              attributes: ["service_name", "service_description"],
            },
          ],
        },
        {
          model: Employee,
          attributes: ["employee_name"], // Adjust according to actual fields
        },
        {
          model: Customer,
          attributes: ["customer_name"], // Adjust according to actual fields
        },
        {
          model: CustomerVehicleInfo,
          attributes: ["vehicle_model"], // Adjust according to actual fields
        },
        {
          model: OrderStatus,
          attributes: ["order_status"],
        },
      ],
    });

    // Map the result to the desired structure
    const formattedOrders = orders.map((order) => {
      return {
        order_id: order.order_id,
        employee_id: order.employee_id,
        customer_id: order.customer_id,
        vehicle_id: order.vehicle_id,
        order_description: order.order_description,
        order_date: order.order_date,
        estimated_completion_date: order.orderInfo.estimated_completion_date,
        completion_date: order.orderInfo.completion_date,
        order_completed: order.orderStatus.order_status === 1, // Assuming 1 means completed
        order_services: order.orderServices.map((service) => ({
          service_id: service.service_id,
          service_name: service.commonService.service_name,
          service_description: service.commonService.service_description,
          service_completed: service.service_completed,
        })),
      };
    });

    return formattedOrders;
  } catch (error) {
    throw new Error("Error retrieving orders from the database");
  }
};

module.exports = {
  getAllOrders,
};
