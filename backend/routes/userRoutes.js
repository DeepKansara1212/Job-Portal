const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
const { sendEmail } = require("../services/emailService")
const crypto = require("crypto")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body)
    const { email, password, fullName, role, adminCode } = req.body

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Check admin code if trying to register as admin
    if (role === "admin") {
      // Verify the admin access code from .env
      if (!adminCode || adminCode !== process.env.ADMIN_ACCESS_CODE) {
        return res.status(403).json({ message: "Invalid admin access code" })
      }
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      role: role || "jobseeker",
      isVerified: true, // Set to true by default for testing
    })

    console.log("Creating user:", user)
    const savedUser = await user.save()
    console.log("User saved successfully:", savedUser._id)

    // Generate JWT for immediate login
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Check for validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join(", ") })
    }

    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" })
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // For testing purposes, we'll skip verification and directly generate a token
    // In production, you should uncomment the verification code section

    /*
    // Generate verification code
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    
    // Send verification code via email
    await sendEmail({
      to: user.email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${verificationCode}`
    });
    
    res.json({ message: 'Verification code sent to your email' });
    */

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role, isVerified: user.isVerified }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Verify code
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || user.verificationCode !== code || user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    // Clear verification code and mark as verified
    user.verificationCode = undefined
    user.verificationCodeExpires = undefined
    user.isVerified = true
    await user.save()

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role, isVerified: user.isVerified }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    res.json({
      message: "Verification successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Verify code error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// The rest of the routes remain the same...

module.exports = router

