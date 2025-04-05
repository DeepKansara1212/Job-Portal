const express = require("express")
const router = express.Router()
const Job = require("../models/Job")
const Company = require("../models/Company")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const { title, location, employmentType, experienceLevel, salaryMin, salaryMax, isRemote, skills, company } =
      req.query

    const query = {}

    // Add filters to query
    if (title) query.title = { $regex: title, $options: "i" }
    if (location) query.location = { $regex: location, $options: "i" }
    if (employmentType) query.employmentType = employmentType
    if (experienceLevel) query.experienceLevel = experienceLevel
    if (isRemote) query.isRemote = isRemote === "true"
    if (company) query.company = company

    // Salary range
    if (salaryMin || salaryMax) {
      query.salary = {}
      if (salaryMin) query.salary.min = { $gte: Number(salaryMin) }
      if (salaryMax) query.salary.max = { $lte: Number(salaryMax) }
    }

    // Skills (array of skills)
    if (skills) {
      const skillsArray = skills.split(",")
      query.skills = { $in: skillsArray }
    }

    // Only show active jobs
    query.isActive = true

    const jobs = await Job.find(query)
      .populate("company", "name logo")
      .populate("postedBy", "fullName")
      .sort({ postedDate: -1 })

    res.json(jobs)
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo website industry size location description")
      .populate("postedBy", "fullName")

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new job (employers and admins only)
router.post("/", authMiddleware, roleMiddleware(["employer", "admin"]), async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      salary,
      employmentType,
      experienceLevel,
      isRemote,
      skills,
      expiryDate,
    } = req.body

    // Verify company ownership
    const companyDoc = await Company.findById(company)
    if (!companyDoc) {
      return res.status(404).json({ message: "Company not found" })
    }

    if (companyDoc.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to post jobs for this company" })
    }

    const newJob = new Job({
      title,
      company,
      description,
      requirements,
      location,
      salary,
      employmentType,
      experienceLevel,
      isRemote,
      skills,
      postedBy: req.user.id,
      expiryDate,
    })

    const job = await newJob.save()

    // Add job to company's jobs array
    await Company.findByIdAndUpdate(company, {
      $push: { jobs: job._id },
    })

    res.status(201).json(job)
  } catch (error) {
    console.error("Create job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a job (owner, admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Check if user is job owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this job" })
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate(
      "company",
      "name logo",
    )

    res.json(updatedJob)
  } catch (error) {
    console.error("Update job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a job (owner, admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Check if user is job owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" })
    }

    // Remove job from company's jobs array
    await Company.findByIdAndUpdate(job.company, {
      $pull: { jobs: job._id },
    })

    // Use deleteOne instead of remove (which is deprecated)
    await Job.deleteOne({ _id: req.params.id })

    res.json({ message: "Job removed" })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

