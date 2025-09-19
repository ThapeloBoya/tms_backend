const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// -------------------- CREATE JOB --------------------
// Create job - only customer allowed
router.post("/", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const jobData = { ...req.body, customer: req.user.id };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ message: "Job posted successfully" });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET JOBS --------------------
// Get all jobs - admin only
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("customer", "name")
      .populate("driver", "username")
      .populate("truck", "plateNumber");
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching all jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get jobs posted by logged-in customer
router.get("/my-jobs", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const jobs = await Job.find({ customer: req.user.id })
      .populate("driver", "name")
      .populate("truck", "plateNumber")
      .populate("customer", "username");
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching customer jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get jobs assigned to the logged-in driver
router.get("/assigned", verifyToken, authorizeRoles("driver"), async (req, res) => {
  try {
    const jobs = await Job.find({ driver: req.user.id })
      .populate("customer", "name")
      .populate("truck", "plateNumber")
      .populate("driver", "username");
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching assigned jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- ASSIGN DRIVER/TRUCK --------------------
// Assign driver and truck to a job - admin only
router.put("/:jobId/assign", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { jobId } = req.params;
  const { driver, truck } = req.body;

  if (!driver || !truck) {
    return res.status(400).json({ message: "Driver and truck IDs are required" });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { driver, truck },
      { new: true }
    )
      .populate("driver", "username")
      .populate("truck", "plateNumber");

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Assignment successful", job: updatedJob });
  } catch (err) {
    console.error("Error assigning driver/truck:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- UPDATE JOB STATUS --------------------
router.put("/:jobId/status", verifyToken, authorizeRoles("admin", "driver", "customer"), async (req, res) => {
  try {
    const { status } = req.body;
    const userRole = req.user.role;

    const allowedStatusUpdates = {
      admin: ["pending", "assigned", "in-progress", "completed", "cancelled"],
      driver: ["in-progress", "completed"],
      customer: ["cancelled"],
    };

    if (!allowedStatusUpdates[userRole].includes(status)) {
      return res.status(403).json({ message: "Not authorized to update status to this value" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = status;
    await job.save();

    res.json({ message: "Status updated successfully", job });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET JOB BY ID --------------------
// Dynamic route - must be last
router.get("/:jobId", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("customer", "name")
      .populate("driver", "username")
      .populate("truck", "plateNumber");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error("Error fetching job details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
