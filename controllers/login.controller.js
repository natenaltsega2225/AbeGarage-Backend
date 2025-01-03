// Import the login service==checking employee credentials is located.
const loginService = require("../services/login.service");
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login
async function logIn(req, res, next) {
  try {
    const employeeData = req.body; //extracts the employee data from the request body
     // Validate that the password length is greater than 8 characters
     if (employeeData.employee_password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters long",
      });
    }
    // Call the logIn method from the login service
    const employee = await loginService.logIn(employeeData); //handles the authentication process.
    // If the employee is not found
    if (employee.status === "fail") {
      res.status(403).json({
        status: employee.status,
        message: employee.message, // "Employee does not exist" or "Incorrect password"
      });
      console.log(employee.message);
    }
    // If successful, send a response to the client
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_role: employee.data.company_role_id,
      employee_first_name: employee.data.employee_first_name,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    // console.log(token);
    const sendBack = {
      employee_token: token,
    };
    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    console.log(error)
  }
}

// Export the functions
module.exports = {
  logIn,
}; //used in your routes file to handle employee login