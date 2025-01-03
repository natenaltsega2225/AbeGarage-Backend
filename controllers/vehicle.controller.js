const { addVehiclee, getSingleVehiclee,getVehicleeById, updateVehiclee } = require("../services/vehicle.service");

async function addVehicle(req, res, next) {

  try {
    const AddedVehicle = await addVehiclee(req.body);
    if (!addVehiclee) {
      return res.status(400).json({
        error: "Failed to add vehicle",
      });
    } else if (AddedVehicle > 0) {
      return res.status(200).json({ status: "Vehicle added successfully" });
    } else {
      return res.status(400).json({
        error: "vehicle not added successfully",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
}

// A function to get a customer vehicle by customer hash
async function getSingleVehicle(req, res, next) {
  try {
    const SingleVehicle = await getSingleVehiclee(req.params);

    // console.log(SingleVehicle)

    if (SingleVehicle.length < 1) {
      return res.status(400).json({
        error: "No Vehicle Found!",
      });
    } else {
      return res.status(200).json({
        status: "Vehicle found!!",
        SingleVehicle: SingleVehicle,
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
}

// a function to get a vehicle by single by ID 
async function getVehicleById(req, res, next) {
  console.log(req.params);

  try {
    const singleVehicle = await getVehicleeById(req.params);

    // console.log(SingleVehicle.length)

    if (singleVehicle.length < 1) {
      return res.status(400).json({
        error: "No Vehicle Added!",
      });
    } else {
      return res.status(200).json({
        status: "Vehicle found!!",
        singleVehicle: singleVehicle,
      });
    }
  } catch (error) {
    // console.log("kkk");
    console.log(error);
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
}
// A function to update a vehicle by ID
const updateVehicle = async (req, res) => {
  const { id } = req.params;  // Get vehicle ID from the URL parameter
  const {
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_mileage,
    vehicle_tag,
    vehicle_serial,
    vehicle_color
  } = req.body;  // Get updated vehicle data from the request body

  // Validate vehicle data
  if (
    !vehicle_year ||
    !vehicle_make ||
    !vehicle_model ||
    !vehicle_type ||
    !vehicle_mileage ||
    !vehicle_tag ||
    !vehicle_serial ||
    !vehicle_color
  ) {
    return res.status(400).json({
      message: "All fields are required to update the vehicle.",
    });
  }

  try {
    // Call the service to update the vehicle
    const updateResult = await updateVehiclee(id, {  // Use the imported function directly here
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color
    });

    if (updateResult === "Vehicle not found") {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.status(200).json({ message: "Vehicle updated successfully" }); // Send success response
  } catch (error) {
    console.error("Error in updateVehicle:", error.message);
    res.status(500).json({ message: "Internal server error" }); // Generic error response
  }
};

module.exports = { addVehicle, getSingleVehicle,getVehicleById, updateVehicle };
