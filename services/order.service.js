const conn = require("../config/db.config"); // Assuming dbConnection is the file for DB connection

// Function to retrieve all orders with their details
async function getAllOrders() {
  try {
    // SQL query to get all orders along with associated services and order info
    const query = `
      SELECT 
        o.order_id, 
        o.employee_id, 
        o.customer_id, 
        o.vehicle_id, 
        o.order_date, 
        oi.estimated_completion_date, 
        oi.completion_date, 
        oi.additional_request, 
        oi.notes_for_internal_use, 
        oi.notes_for_customer, 
        oi.additional_requests_completed,
        os.order_service_id, 
        os.service_id, 
        os.service_completed
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_services os ON o.order_id = os.order_id
      ORDER BY o.order_id DESC
    `;

    const [rows] = await conn.query(query);

    // Transform the rows into the desired JSON format
    const orders = rows.reduce((acc, row) => {
      let order = acc.find((o) => o.order_id === row.order_id);

      if (!order) {
        order = {
          order_id: row.order_id,
          employee_id: row.employee_id,
          customer_id: row.customer_id,
          vehicle_id: row.vehicle_id,
          order_date: row.order_date,
          order_info: {
            estimated_completion_date: row.estimated_completion_date,
            completion_date: row.completion_date,
            additional_request: row.additional_request,
            notes_for_internal_use: row.notes_for_internal_use,
            notes_for_customer: row.notes_for_customer,
            additional_requests_completed: row.additional_requests_completed,
          },
          order_services: [],
        };
        acc.push(order);
      }

      if (row.order_service_id) {
        order.order_services.push({
          order_service_id: row.order_service_id,
          service_id: row.service_id,
          service_completed: row.service_completed,
        });
      }

      return acc;
    }, []);

    return orders; // Return the array of orders
  } catch (error) {
    // If an error occurs during the query
    console.error("Error fetching orders: ", error);
    throw new Error("Internal Server Error");
  }
}

module.exports = { getAllOrders };
