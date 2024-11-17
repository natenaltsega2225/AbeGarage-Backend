// services/employeeService.js
const conn = require("../config/db.config");
//Import the bcrypt module
const bcrypt = require("bcrypt");
//Import the crypto module
const crypto = require("crypto");
const DEFAULT_ROLE = "1"; // Default role assignment

const registerEmployee = async (employeeData) => {
  const { first_name, last_name, phone, email, password, active_status, role } =
    employeeData;

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

    //Generate random UUID for employee_uuid
    const uuid = crypto.randomUUID();

    const hashedPassword = await bcrypt.hash(password, salt);
    // Insert email and active status into employee table
    const query1 = `INSERT INTO employee (employee_email, active_employee, employee_uuid)VALUES (?, ?, ?)`;
    const [rows1] = await conn.query(query1, [email, active_status, uuid]);

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
};
// Function to get Employee ID by UUID
async function getEmployeeId(uuid) {
  const query = "SELECT employee_id FROM employee WHERE employee_uuid = ?";
  const [rows] = await conn.query(query, [uuid]);
  return rows;
}
// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const [rows] = await conn.query(query, [employee_email]);
  return rows;
}
//A functoin to get all employees
async function getAllEmployees() {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const [rows] = await conn.query(query);
  return rows;
}
//A function to update the employee
async function updateEmployee(employeeId, updatedData) {
  const queryCheck = "SELECT * FROM employee WHERE employee_id = ?";
  try {
    // Array to store any error messages if updates fail in individual tables
    const errors = [];
    // Check if the employee exists
    const [result] = await conn.query(queryCheck, [employeeId]);
    if (result.length === 0) {
      return "not_found";
    }
    // Update the `employee` table (email and active status)
    if (
      updatedData.employee_email ||
      updatedData.active_employee !== undefined
    ) {
      const queryEmployee = `
        UPDATE employee 
        SET employee_email = COALESCE(?, employee_email), 
            active_employee = COALESCE(?, active_employee) 
        WHERE employee_id = ?
      `;
      const [resultEmployee] = await conn.query(queryEmployee, [
        updatedData.employee_email,
        updatedData.active_employee,
        employeeId,
      ]);
      if (resultEmployee.affectedRows === 0)
        errors.push("Failed to update employee table");
    }

    // Update `employee_info` table (first name, last name, phone)
    if (
      updatedData.employee_first_name ||
      updatedData.employee_last_name ||
      updatedData.employee_phone
    ) {
      const queryInfo = `
        UPDATE employee_info 
        SET employee_first_name = COALESCE(?, employee_first_name), 
            employee_last_name = COALESCE(?, employee_last_name), 
            employee_phone = COALESCE(?, employee_phone)
        WHERE employee_id = ?
      `;
      const [resultInfo] = await conn.query(queryInfo, [
        updatedData.employee_first_name,
        updatedData.employee_last_name,
        updatedData.employee_phone,
        employeeId,
      ]);
      if (resultInfo.affectedRows === 0)
        errors.push("Failed to update employee_info table");
    }

    // Update `employee_pass` table (password)
    const queryPass = `
        UPDATE employee_pass 
        SET employee_password_hashed = ? 
        WHERE employee_id = ?
      `;
    const [resultPass] = await conn.query(queryPass, [
      updatedData.employee_password,
      employeeId,
    ]);
    if (resultPass.affectedRows === 0)
      errors.push("Failed to update employee_pass table");

    // Update `employee_role` table (role)
    if (updatedData.company_role_id) {
      const queryRole = `
        UPDATE employee_role 
        SET company_role_id = ? 
        WHERE employee_id = ?
      `;
      const [resultRole] = await conn.query(queryRole, [
        updatedData.company_role_id,
        employeeId,
      ]);
      if (resultRole.affectedRows === 0)
        errors.push("Failed to update employee_role table");
    }

    // Return results
    // console.log(errors.length)
    if (errors.length > 0) {
      return { success: false, message: "Some updates failed", errors };
    } else {
      return { success: true, message: "Employee updated successfully" };
    }
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    throw new Error("Unexpected server error");
  }
}
//A function to delete the employee
async function deleteEmployee(employeeId) {
  try {
    // Delete employee from all related tables
    await conn.query("DELETE FROM employee_pass WHERE employee_id = ?", [
      employeeId,
    ]);
    await conn.query("DELETE FROM employee_info WHERE employee_id = ?", [
      employeeId,
    ]);
    await conn.query("DELETE FROM employee_role WHERE employee_id = ?", [
      employeeId,
    ]);
    await conn.query("DELETE FROM employee WHERE employee_id = ?", [
      employeeId,
    ]);
    return "success";
  } catch (error) {
    console.log(error);
    return error;
  }
}
module.exports = {
  registerEmployee,
  getEmployeeByEmail,
  updateEmployee,
  getAllEmployees,
  getEmployeeId,
  deleteEmployee,
};
