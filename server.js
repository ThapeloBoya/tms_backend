require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const driverLocationRoutes = require("./routes/driverLocations"); // match your exact filename
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const jobRoutes = require("./routes/jobs");
const truckRoutes = require("./routes/trucks");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/drivers", driverLocationRoutes);

const PORT = process.env.PORT || 5000;

// Create HTTP server from express app
const server = http.createServer(app);




// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
