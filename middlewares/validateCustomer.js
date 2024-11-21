const validateCustomer = (req, res, next) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
  } = req.body;

  // Validation errors array
  const errors = [];

  // Required fields check
  if (!customer_email) errors.push("customer_email is required.");
  if (!customer_phone_number) errors.push("customer_phone_number is required.");
  if (!customer_first_name) errors.push("customer_first_name is required.");
  if (!customer_last_name) errors.push("customer_last_name is required.");

  // Type validation
  if (customer_email && typeof customer_email !== "string")
    errors.push("customer_email must be a string.");
  if (customer_phone_number && typeof customer_phone_number !== "string")
    errors.push("customer_phone_number must be a string.");
  if (customer_first_name && typeof customer_first_name !== "string")
    errors.push("customer_first_name must be a string.");
  if (customer_last_name && typeof customer_last_name !== "string")
    errors.push("customer_last_name must be a string.");

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customer_email && !emailRegex.test(customer_email))
    errors.push("customer_email must be a valid email address.");

  // Phone format validation (e.g., digits only, 10-15 characters)
  const phoneRegex = /^\d{10,15}$/;
  if (customer_phone_number && !phoneRegex.test(customer_phone_number))
    errors.push(
      "customer_phone_number must be a valid phone number (10-15 digits)."
    );

  // // Length constraints for names
  // if (customer_first_name && customer_first_name.length > 50) errors.push("customer_first_name must not exceed 50 characters.");
  // if (customer_last_name && customer_last_name.length > 50) errors.push("customer_last_name must not exceed 50 characters.");

  // If there are validation errors, send a 400 response
  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  // Proceed to the next middleware/controller
  next();
};

module.exports = validateCustomer;
