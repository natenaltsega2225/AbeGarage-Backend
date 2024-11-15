// controllers/employeeController.js
const validator = require("validator"); // Import validator for input sanitization
const employeeService = require("../services/employee.service"); // Import the employee service

exports.registerEmployee = async (req, res) => {
  const {
    employee_first_name,
    employee_last_name,
    employee_phone,
    employee_email,
    employee_password,
    active_employee,
    employee_role,
  } = req.body;
  console.log(employee_role);
  

  // Type validation: Ensure that fields expected to be strings are strings
  if (
    typeof employee_first_name !== "string" ||
    typeof employee_last_name !== "string" ||
    typeof employee_phone !== "string" ||
    typeof employee_email !== "string" ||
    typeof employee_password !== "string"
  ) {
    // Throw a type error if any field has an unexpected type
    const invalidType =
      typeof req.body[
        Object.keys(req.body).find(
          (key) =>
            typeof req.body[key] !== "string" &&
            [
              "employee_first_name",
              "employee_last_name",
              "employee_phone",
              "employee_email",
              "employee_password",
            ].includes(key)
        )
      ];
    throw new TypeError(
      "Expected a string but received a ".concat(invalidType)
    );
  }
  // Sanitize the employee data in the controller to avoid duplication
  const sanitizedData = {
    first_name: validator.escape(employee_first_name), // Escape harmful characters
    last_name: validator.escape(employee_last_name),
    phone: validator.escape(employee_phone),
    email: validator.normalizeEmail(employee_email), // Normalize email
    password: employee_password, // Password will be hashed in the service, so no need to sanitize here
    active_status: active_employee !== undefined ? active_employee : 1,
    role: employee_role, 
  };
  // Validate: Ensure all required fields are provided
  if (
    !sanitizedData.first_name ||
    !sanitizedData.last_name ||
    !sanitizedData.phone ||
    !sanitizedData.email ||
    !sanitizedData.password ||
    !sanitizedData.role
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Pass the sanitized data to the service
    const result = await employeeService.registerEmployee(sanitizedData);

    const responseData = {
      id: result.insertId, // Assuming 'insertId' contains the new employee's ID from MySQL
      first_name: sanitizedData.first_name,
      last_name: sanitizedData.last_name,
      phone: sanitizedData.phone,
      email: sanitizedData.email,
      password:sanitizedData.password,
      active_status: sanitizedData.active_status,
      role: sanitizedData.role,
    };

    res.status(201).json({
      message: "Employee created successfully",
      success: true,
      data: responseData,
    });
  } catch (error) {
    // Handle specific error for duplicate email
    if (error.message === "Email already registered") {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already registered",
      });
    }

    // Log the error and send general server error
    console.error("Error registering employee:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred.",
    });
  }
};
// Create the getAllEmployees controller 
exports.getAllEmployees = async (req, res, next) => {
  // Call the getAllEmployees method from the employee service 
  const employees = await employeeService.getAllEmployees();
  // console.log(employees);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

