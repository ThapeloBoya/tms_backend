const express = require("express");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// Fetch users by role (e.g., /api/user?role=driver) - admin only
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { role } = req.query;

  try {
    if (!role) return res.status(400).json({ message: "Role query param required" });

    const users = await User.find({ role }).select("-passwordHash -refreshToken"); // exclude sensitive info
    res.json(users);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Your existing example routes...
router.get("/admin-data", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ secretAdminData: "This is admin-only data" });
});
router.get("/customer-data", verifyToken, authorizeRoles("customer"), (req, res) => {
  res.json({ customerData: "This is customer-only data" });
});
router.get("/driver-data", verifyToken, authorizeRoles("driver"), (req, res) => {
  res.json({ driverData: "This is driver-only data" });
});

module.exports = router;
