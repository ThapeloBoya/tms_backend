require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

// Routes
const driverLocationRoutes = require("./routes/driverLocations");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const jobRoutes = require("./routes/jobs");
const truckRoutes = require("./routes/trucks");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(cookieParser());

// ✅ CORS fix: allow frontend deployed on Vercel
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. https://tms-seven-beta.vercel.app
    credentials: true, // allow cookies across domains
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------------------- ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/drivers", driverLocationRoutes);

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// -------------------- DB CONNECTION --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
