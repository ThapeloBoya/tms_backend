const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin", "driver"], required: true },
  refreshToken: { type: String },

  // 🆕 Location fields
  latitude: { type: Number },
  longitude: { type: Number },
  lastLocationUpdate: { type: Date }, // 🆕 Timestamp
});

module.exports = mongoose.model("User", userSchema);


