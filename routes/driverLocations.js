const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // renamed for clarity

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to verify driver
const verifyDriver = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "driver") {
      return res.status(403).json({ message: "Drivers only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET driver locations (for admin)
router.get("/locations", verifyAdmin, async (req, res) => {
  try {
    const drivers = await User.find(
      { role: "driver" },
      { username: 1, latitude: 1, longitude: 1, lastLocationUpdate: 1 } // include timestamp
    );

    const filteredDrivers = drivers.filter(
      (d) => d.latitude !== undefined && d.longitude !== undefined
    );

    res.json(filteredDrivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST location (for driver)
router.post("/location", verifyDriver, async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log("Updating location for driver:", req.user.id, latitude, longitude);

  try {
    await User.findByIdAndUpdate(req.user.id, {
      latitude,
      longitude,
    lastLocationUpdate: new Date(), // 🆕 Add this
    });
    res.status(200).json({ message: "Location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update location" });
  }
});

module.exports = router;
