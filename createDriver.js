const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../backend/models/User");
require("dotenv").config();

const createDriver = async () => {
  const username = "driver2";
  const password = "driverpassword";

  const existingDriver = await User.findOne({ username });
  if (existingDriver) {
    console.log("Driver already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newDriver = new User({
     name: "Driver",        // added
    username,
    passwordHash,
    role: "driver",
  });

  await newDriver.save();
  console.log("Driver created");
};

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  return createDriver();
})
.catch(err => console.error("MongoDB connection error:", err));
