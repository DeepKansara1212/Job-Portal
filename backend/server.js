require("dotenv").config()
const express = require("express")
const cors = require("cors")
const passport = require("passport")
const path = require("path")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const jobRoutes = require("./routes/jobRoutes")
const applicationRoutes = require("./routes/applicationRoutes")
const companyRoutes = require("./routes/companyRoutes")
const authRoutes = require("./routes/authRoutes")
const { sendEmail } = require("./services/emailService")
require("./config/passport")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Add body logging for POST/PUT requests
app.use((req, res, next) => {
  if ((req.method === "POST" || req.method === "PUT") && req.body) {
    console.log("Request body:", JSON.stringify(req.body, null, 2))
  }
  next()
})

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()
    res.json({
      status: "Database connected",
      collections: collections.map((c) => c.name),
      dbName: mongoose.connection.db.databaseName,
    })
  } catch (error) {
    console.error("Database test error:", error)
    res.status(500).json({ error: error.message })
  }
})

// Update the MongoDB connection section to include better error handling
const mongoose = require("mongoose")
connectDB()
  .then(() => {
    console.log("MongoDB connection successful")

    // Log the database name and connection string (without sensitive info)
    const dbName = mongoose.connection.db.databaseName
    console.log(`Connected to database: ${dbName}`)

    // Routes
    app.use("/api/users", userRoutes)
    app.use("/api/jobs", jobRoutes)
    app.use("/api/applications", applicationRoutes)
    app.use("/api/companies", companyRoutes)
    app.use("/auth", authRoutes)

    // Basic route for testing
    app.get("/", (req, res) => {
      res.send("Job Portal API is running")
      console.log("GET / - Job Portal API is running")
    })

    // Test data creation route
    app.get("/api/test-create", async (req, res) => {
      try {
        const User = require("./models/User")

        // Create a test user
        const testUser = new User({
          email: `test${Date.now()}@example.com`,
          password: "password123",
          fullName: "Test User",
          role: "jobseeker",
        })

        const savedUser = await testUser.save()
        console.log("Test user created:", savedUser)

        res.json({
          message: "Test user created successfully",
          user: {
            id: savedUser._id,
            email: savedUser.email,
            fullName: savedUser.fullName,
          },
        })
      } catch (error) {
        console.error("Test data creation error:", error)
        res.status(500).json({
          error: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        })
      }
    })

    // Test email route
    app.get("/test-email", async (req, res) => {
      try {
        if (!process.env.EMAIL_USER) {
          return res.status(400).json({ message: "EMAIL_USER environment variable is not set" })
        }

        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: "Test Email",
          text: "This is a test email from Job Portal API",
        })
        res.json({ message: "Test email sent" })
        console.log("GET /test-email - Test email sent")
      } catch (error) {
        console.error("Error sending test email:", error)
        res.status(500).json({ message: "Failed to send test email", error: error.message })
      }
    })

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error:", err)
      const statusCode = err.statusCode || 500
      res.status(statusCode).json({
        message: err.message || "An unexpected error occurred",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      })
    })

    // Handle 404 routes
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" })
      console.log(`404 - Route not found: ${req.originalUrl}`)
    })

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  })

