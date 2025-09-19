const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1]; // Bearer token

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded JWT payload:", decoded);
  req.user = decoded;
  next();
} catch (err) {
  console.error("JWT verification failed:", err);
  res.status(401).json({ message: "Invalid or expired token." });
}

};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient rights." });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
