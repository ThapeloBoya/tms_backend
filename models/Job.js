const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    pickup: String,
    delivery: String,
    packageDetails: String,
    customerName: String,
    phone: String,
    email: String,
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,  // initially no driver assigned
    },
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      default: null,  // initially no truck assigned
    },
    // you can add status or other fields if needed
      status: {
    type: String,
    enum: ["pending", "assigned", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
