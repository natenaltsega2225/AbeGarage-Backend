// import the query function from the db.config.js file
const connection = require("../config/db.config");

// add customer vehicle information
async function addVehiclee(vehicle) {
  try {
    const customer_hash = vehicle.customer_hash;

    // console.log(customer_hash);

    const query = "SELECT * FROM customer_identifier WHERE customer_hash = ?";

    const [rows] = await connection.query(query, [customer_hash]);

    //  console.log(rows[0].customer_id)
    if (rows.length === 0) {
      return "Customer not found";
    }
    const customer_id = rows[0].customer_id;

    // //////////////////////////////
    const query1 =
      "INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag,vehicle_serial,vehicle_color) VALUES (?,?,?,?,?,?,?,?,?)";

    const values = [
      customer_id,
      vehicle.vehicle_year,
      vehicle.vehicle_make,
      vehicle.vehicle_model,
      vehicle.vehicle_type,
      vehicle.vehicle_mileage,
      vehicle.vehicle_tag,
      vehicle.vehicle_serial,
      vehicle.vehicle_color,
    ];

    const [rows1] = await connection.query(query1, values);
    return rows1.insertId;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

// get the Customer single Vehiclee
async function getCustomerVehicle(single) {
  // console.log(single.customer_hash);
  // to get the customer Id
  const query = "SELECT * FROM customer_identifier WHERE customer_hash = ?";

  const [rows] = await connection.query(query, [single.customer_hash]);

  //   console.log(rows);

  const customer_id = rows[0].customer_id;
  const query012 = "SELECT * FROM customer_vehicle_info WHERE customer_id = ?";
  const [rows01] = await connection.query(query012, [customer_id]);
  const vehicle_id = rows01[0].vehicle_id;

  //   console.log(customer_id);

  // get the customer vehicle by its id
  const query1 = "SELECT * FROM customer_vehicle_info WHERE customer_id = ?";

  const [rows1] = await connection.query(query1, [customer_id]);

  // console.log(rows1);
  return rows1;
}
//Get single vehicle
async function getVehicleeById(id){
  const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?";
  const [rows] = await connection.query(query, [id]);
  return rows
}

// Update customer vehicle information
async function updateVehiclee(vehicle_id, vehicleData) {
  try {
    // First, check if the vehicle exists
    const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?";
    const [rows] = await connection.query(query, [vehicle_id]);

    if (rows.length === 0) {
      return "Vehicle not found";  // Vehicle not found, return message
    }

    // Prepare the update query with the new data
    const updateQuery =
      "UPDATE customer_vehicle_info SET vehicle_year = ?, vehicle_make = ?, vehicle_model = ?, vehicle_type = ?, vehicle_mileage = ?, vehicle_tag = ?, vehicle_serial = ?, vehicle_color = ? WHERE vehicle_id = ?";
    const values = [
      vehicleData.vehicle_year,
      vehicleData.vehicle_make,
      vehicleData.vehicle_model,
      vehicleData.vehicle_type,
      vehicleData.vehicle_mileage,
      vehicleData.vehicle_tag,
      vehicleData.vehicle_serial,
      vehicleData.vehicle_color,
      vehicle_id
    ];

    // Execute the update query
    const [updateResult] = await connection.query(updateQuery, values);
    
    if (updateResult.affectedRows === 0) {
      return "Vehicle not found";  // No rows affected, vehicle not found
    }

    return "Vehicle updated successfully";  // Successfully updated vehicle
  } catch (error) {
    console.error("Error in updateVehiclee:", error.message);
    return "Error updating vehicle";  // Generic error message
  }
}
module.exports = { addVehiclee, getCustomerVehicle,getVehicleeById,updateVehiclee };
