const {
  addVehiclee,
  getSingleVehiclee,
} = require("../services/vehicle.service");

async function addVehicle(req, res, next) {
  console.log(req.body);

  try {
    const AddedVehicle = await addVehiclee(req.body);

    // console.log(AddedVehicle.affectedRows)
    console.log(AddedVehicle);
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
    console.log(error);
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
    console.log(error);
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
}

module.exports = { addVehicle, getSingleVehicle };
