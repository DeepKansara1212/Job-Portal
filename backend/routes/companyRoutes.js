const express = require("express")
const router = express.Router()
const Company = require("../models/Company")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/companies"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed"))
  },
})

// Get all companies
router.get("/", async (req, res) => {
  try {
    const { name, industry, size } = req.query

    const query = {}

    if (name) query.name = { $regex: name, $options: "i" }
    if (industry) query.industry = { $regex: industry, $options: "i" }
    if (size) query.size = size

    const companies = await Company.find(query).populate("owner", "fullName").sort({ name: 1 })

    res.json(companies)
  } catch (error) {
    console.error("Get companies error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get companies owned by the current user - MOVED ABOVE THE /:id ROUTE
router.get("/my-companies", authMiddleware, async (req, res) => {
  try {
    const companies = await Company.find({ owner: req.user.id })
    res.json(companies)
  } catch (error) {
    console.error("Get my companies error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("owner", "fullName")
      .populate({
        path: "jobs",
        match: { isActive: true },
        select: "title location salary employmentType experienceLevel postedDate",
      })

    if (!company) {
      return res.status(404).json({ message: "Company not found" })
    }

    res.json(company)
  } catch (error) {
    console.error("Get company error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new company (employers and admins only)
router.post("/", authMiddleware, roleMiddleware(["employer", "admin"]), upload.single("logo"), async (req, res) => {
  try {
    const { name, website, industry, size, founded, description, location, linkedin, twitter, facebook } = req.body

    // Check if company with this name already exists
    const existingCompany = await Company.findOne({ name })
    if (existingCompany) {
      return res.status(400).json({ message: "Company with this name already exists" })
    }

    const newCompany = new Company({
      name,
      website,
      industry,
      size,
      founded,
      description,
      location,
      owner: req.user.id,
      socialMedia: {
        linkedin,
        twitter,
        facebook,
      },
    })

    if (req.file) {
      newCompany.logo = req.file.path
    }

    const company = await newCompany.save()

    res.status(201).json(company)
  } catch (error) {
    console.error("Create company error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a company (owner, admin only)
router.put("/:id", authMiddleware, upload.single("logo"), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({ message: "Company not found" })
    }

    // Check if user is company owner or admin
    if (company.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this company" })
    }

    const companyFields = { ...req.body }

    // Handle social media fields
    if (req.body.linkedin || req.body.twitter || req.body.facebook) {
      companyFields.socialMedia = {
        linkedin: req.body.linkedin || company.socialMedia.linkedin,
        twitter: req.body.twitter || company.socialMedia.twitter,
        facebook: req.body.facebook || company.socialMedia.facebook,
      }

      // Remove from main object
      delete companyFields.linkedin
      delete companyFields.twitter
      delete companyFields.facebook
    }

    // Handle logo upload
    if (req.file) {
      companyFields.logo = req.file.path

      // Delete old logo if exists
      if (company.logo) {
        try {
          fs.unlinkSync(company.logo)
        } catch (err) {
          console.error("Error deleting old logo:", err)
        }
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, { $set: companyFields }, { new: true })

    res.json(updatedCompany)
  } catch (error) {
    console.error("Update company error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a company (owner, admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({ message: "Company not found" })
    }

    // Check if user is company owner or admin
    if (company.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this company" })
    }

    // Delete company logo if exists
    if (company.logo) {
      try {
        fs.unlinkSync(company.logo)
      } catch (err) {
        console.error("Error deleting company logo:", err)
      }
    }

    await company.deleteOne()

    res.json({ message: "Company deleted successfully" })
  } catch (error) {
    console.error("Delete company error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

