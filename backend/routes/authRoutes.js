const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`)
      }

      const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    } catch (error) {
      console.error("Error in Google callback:", error)
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`)
    }
  },
)

// LinkedIn OAuth
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
    session: false,
  }),
)

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`)
      }

      const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    } catch (error) {
      console.error("Error in LinkedIn callback:", error)
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`)
    }
  },
)

// Add a hardcoded admin user
const ADMIN_EMAIL = "admin@joburfinder.com"
const ADMIN_PASSWORD = "admin123"
const ADMIN_NAME = "System Administrator"

// Update the login route to handle the hardcoded admin and improve database interaction
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    console.log(`Login attempt for email: ${email}`)

    // Check for admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("Admin login successful")

      const token = jwt.sign({ id: "admin-id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "30d" })

      return res.json({
        token,
        user: {
          id: "admin-id",
          email: ADMIN_EMAIL,
          fullName: ADMIN_NAME,
          role: "admin",
        },
      })
    }

    // For regular users, check the database
    const user = await User.findOne({ email }).exec()
    console.log("User found in database:", user ? "Yes" : "No")

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    console.log("Password match:", isMatch ? "Yes" : "No")

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a registration route to properly save users to the database
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec()
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    // Create new user
    const newUser = new User({
      email,
      password, // Will be hashed by the pre-save hook in the User model
      fullName,
      role,
      isVerified: true, // Auto-verify for now
    })

    const savedUser = await newUser.save()
    console.log("New user created:", savedUser._id)

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

