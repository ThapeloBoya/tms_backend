const express = require("express");
const router = express.Router();
const Truck = require("../models/Truck");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// GET all trucks (admin only)
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    console.error("Error fetching trucks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create new truck (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const truck = new Truck(req.body);
    await truck.save();
    res.status(201).json(truck);
  } catch (err) {
    console.error("Error creating truck:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
