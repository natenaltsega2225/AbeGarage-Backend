// services/employeeService.js
const conn = require("../config/db.config");
const bcrypt = require("bcrypt");

const DEFAULT_ROLE = "2"; // Default role assignment

const registerEmployee = async (employeeData) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    password,
    active_status,
    role,
  } = employeeData;

  // Check if email is already registered
  const [existingUser] = await conn.query(
    "SELECT * FROM employee WHERE employee_email = ?",
    [email]
  );
  if (existingUser.length > 0) {
    throw new Error("Email already registered");
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert email and active status into employee table
    const query1 =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const [rows1] = await conn.query(query1, [
      email,
      active_status,
    ]);

    if (rows1.affectedRows !== 1) {
      console.error("Failed to insert into employee table");
      return null;
    }

    // Get the employee ID of the newly inserted record
    const employee_id = rows1.insertId;

    // Insert employee info
    const query2 = `
      INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone)
      VALUES (?, ?, ?, ?)
    `;
    const [rows2] = await conn.query(query2, [
      employee_id,
      first_name,
      last_name,
      phone,
    ]);
    if (rows2.affectedRows !== 1) {
      console.error("Failed to insert into employee_info table");
      return null;
    }

    // Insert employee password
    const query3 = `
      INSERT INTO employee_pass (employee_id, employee_password_hashed)
      VALUES (?, ?)
    `;
    const [rows3] = await conn.query(query3, [employee_id, hashedPassword]);
    if (rows3.affectedRows !== 1) {
      console.error("Failed to insert into employee_pass table");
      return null;
    }

    // Insert employee role
    const query4 = `
      INSERT INTO employee_role (employee_id, company_role_id)
      VALUES (?, ?)
    `;
    const [rows4] = await conn.query(query4, [
      employee_id,
      role || DEFAULT_ROLE,
    ]);
    if (rows4.affectedRows !== 1) {
      console.error("Failed to insert into employee_role table");
      return null;
    }

    // Construct the employee object to return
    createdEmployee = {
      employee_id: employee_id,
      employee_email: email,
      active_employee: active_status,
    };
  } catch (error) {
    console.error("Error in createEmployee:", error);
    return null;
  }
  return createdEmployee;
}
// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const [rows] = await conn.query(query, [employee_email]);
  return rows;
}

async function getAllEmployees() {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const [rows] = await conn.query(query);
  return rows;
}
module.exports = {
  registerEmployee,
  getEmployeeByEmail,
  getAllEmployees
};
//     // Hash the password
//     const salt=await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log(hashedPassword);
//     // Insert the new employee into the database
//     const [result] = await db.query(
//       "INSERT INTO employee (employee_first_name, employee_last_name, employee_phone, employee_email, employee_password, employee_active_status, employee_role) VALUES (?, ?, ?, ?, ?, ?, ?)",
//       [
//         employee_first_name,
//         employee_last_name,
//         employee_phone,
//         employee_email,
//         hashedPassword,
//         employee_active_status || 1, // Default to active (1) if not provided
//         employee_role || DEFAULT_ROLE, // Default to 'employee' role if not provided
//       ]
//     );

//     return {
//       insertId: result.insertId, // Return the ID of the newly created employee
//     };
//   } catch (error) {
//     throw new Error("Failed to register employee: " + error.message);
// 