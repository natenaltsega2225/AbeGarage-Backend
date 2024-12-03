const conn = require("../config/db.config");

// Service to add a new service with duplication check
const addService = async ({ service_name, service_description }) => {
   try {
      // First, check if a service with the same name and description already exists
      const checkQuery = `
         SELECT * FROM common_services 
         WHERE service_name = ? AND service_description = ?
      `;
      const [existingService] = await conn.execute(checkQuery, [
         service_name,
         service_description,
      ]);

      // If a duplicate service is found, throw an error
      if (existingService.length > 0) {
         throw new Error("A service with the same name and description already exists.");
      }

      // Proceed with inserting the new service if no duplicates are found
      const query = `
         INSERT INTO common_services (service_name, service_description) 
         VALUES (?, ?)
      `;
      const [result] = await conn.execute(query, [
         service_name,
         service_description,
      ]);

      return {
         message: "Service added successfully",
         service_id: result.insertId,
      };
   } catch (error) {
      console.error("Error in addService:", error.message);
      throw new Error(error.message);  // Throw the error message to the controller
   }
};

// Service to update an existing service with duplication check
const updateService = async (id, { service_name, service_description }) => {
   try {
      // Check if the new values are the same as the current values
      const checkCurrentQuery = `
         SELECT service_name, service_description 
         FROM common_services 
         WHERE service_id = ?
      `;
      const [currentService] = await conn.execute(checkCurrentQuery, [id]);

      if (currentService.length === 0) {
         throw new Error("Service not found.");
      }

      const existingService = currentService[0];

      // If service_name and service_description are the same as the existing ones
      if (
         service_name === existingService.service_name &&
         service_description === existingService.service_description
      ) {
         throw new Error(
            "Service with the same name and description already exists."
         );
      }

      // Validate if another service with the same name and description exists (excluding the current service)
      const checkDuplicateQuery = `
         SELECT * FROM common_services 
         WHERE service_name = ? AND service_description = ? AND service_id != ?
      `;
      const [duplicateService] = await conn.execute(checkDuplicateQuery, [
         service_name,
         service_description,
         id, // Exclude the service being updated
      ]);

      // If a duplicate is found, throw an error
      if (duplicateService.length > 0) {
         throw new Error(
            "A service with the same name and description already exists."
         );
      }

      // Proceed with updating the service if no duplicates or same values are found
      const updates = [];
      const values = [];

      if (service_name) {
         updates.push("service_name = ?");
         values.push(service_name);
      }
      if (service_description) {
         updates.push("service_description = ?");
         values.push(service_description);
      }

      values.push(id); // Add service ID to the end of values

      const query = `
         UPDATE common_services 
         SET ${updates.join(", ")} 
         WHERE service_id = ?
      `;

      const [result] = await conn.execute(query, values);
      return result;
   } catch (error) {
      console.error("Error in updateService:", error.message);
      throw new Error(error.message); // Throw the error message to the controller
   }
};
const getAllService = async () => {
   try {
     const query = "SELECT * FROM common_services";
 
     const [response] = await conn.query(query);
     // console.log(response);
     return response;
   } catch (error) {
     console.log(error);
     return error;
   }
 };
 const getServiceById = async (id) => {
   try {
     const query = "SELECT * FROM common_services WHERE service_id = ?";
     const [rows] = await conn.query(query, [id]);
 
     if (rows.length === 0) {
       return null; // Service not found
     }
 
     return rows[0]; // Return the first service in the result set
   } catch (error) {
     console.error(error);
     return error;
   }
 };
 
 const db = require("../config/db"); // Example: Replace with your database connection

const deleteServiceById = async (id) => {
  try {
    // Query to check if the service exists
    const [service] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
    if (!service) {
      return null; // Service not found
    }

    // Query to delete the service
    await db.query("DELETE FROM services WHERE id = ?", [id]);
    return true; // Successfully deleted
  } catch (error) {
    console.error("Error in deleteServiceById:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
   addService,
   updateService,
   getAllService,
   getServiceById,
   deleteServiceById 
  };
