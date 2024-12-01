const jwt = require("jsonwebtoken");

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token
  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Admins only" });
    req.user = decoded;
    next();
  });
}

module.exports = isAdmin;
