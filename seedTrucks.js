require("dotenv").config();
const mongoose = require("mongoose");
const Truck = require("./models/Truck");

const MONGO_URI = process.env.MONGO_URI;

const trucks = [
  { plateNumber: "ABC123", model: "Volvo FH", capacity: 20000, status: "available" },
  { plateNumber: "XYZ789", model: "Scania R500", capacity: 18000, status: "available" }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Truck.insertMany(trucks);
    console.log("Trucks inserted successfully!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error inserting trucks:", err);
    mongoose.connection.close();
  });
