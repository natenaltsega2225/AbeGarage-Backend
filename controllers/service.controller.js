const serviceService = require("../services/service.service");

// Controller to handle adding a service
const addService = async (req, res) => {
  const { service_name, service_description } = req.body; // Get data from request body

  // Validate service data
  if (!service_name || !service_description) {
    return res
      .status(400)
      .json({ message: "Service name and description are required." });
  }

  try {
    const result = await serviceService.addService({
      service_name,
      service_description,
    });

    res.status(201).json(result); // Success response
  } catch (error) {
    console.error("Error in addService:", error.message);

    if (error.message.includes("already exists")) {
      // If the error is related to duplicate service, return a 400 response
      return res.status(400).json({ message: error.message });
    }

    // Generic server error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to handle updating service information by ID
const updateService = async (req, res) => {
  const { id } = req.params; // Get service ID from the route parameter
  const { service_name, service_description } = req.body; // Get new service data from the request body

  // Validate service data
  if (!service_name && !service_description) {
    return res.status(400).json({
      message:
        "At least one field (service name or description) is required to update.",
    });
  }

  try {
    const updateResult = await serviceService.updateService(id, {
      service_name,
      service_description,
    });

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service updated successfully" }); // Send success response
  } catch (error) {
    console.error("Error in updateService:", error.message);

    if (
      error.message ===
      "Service with the same name and description already exists."
    ) {
      return res.status(400).json({ message: error.message });
    }

    // Generic error handling
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllService();

    if (!services) {
      return res.status(400).json({ message: "Failed to get all services!" });
    } else {
      return res.status(200).json({
        services,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Check if the error indicates a 401 Unauthorized status
    if (error.status === 401) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getSingleService = async (req, res) => {
  const { id } = req.params; // Extract the service ID from the request parameter

  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID provided!" });
    }

    const service = await serviceService.getServiceById(id); // Fetch service by ID

    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    // Return the service details in the response
    return res.status(200).json({
      service,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteService = async (req, res) => {
  const { id } = req.params; // Extract the service ID from the request parameter

  try {
    // Validate the ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID provided!" });
    }

    // Call the service layer to delete the service
    const deleteResult = await serviceService.deleteServiceById(id);

    if (!deleteResult) {
      return res.status(404).json({ message: "Service not found!" });
    }

    return res.status(200).json({ message: "Service deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteService:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addService,
  updateService,
  getAllServices,
  getSingleService,
  deleteService, 
};
