const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../backend/models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const password = "adminpassword";
  const passwordHash = await bcrypt.hash(password, 10);

  const adminUser = new User({
    name: "Admin",        // added
    username: "admin",
    passwordHash,
    role: "admin",
  });

  await adminUser.save();
  console.log("Admin created");

  mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("Error creating admin user:", err);
  mongoose.disconnect();
});
