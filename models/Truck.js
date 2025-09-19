const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true }, // capacity in kg or whatever unit you want
  status: { type: String, enum: ["available", "unavailable"], default: "available" }
});

module.exports = mongoose.model("Truck", truckSchema);
