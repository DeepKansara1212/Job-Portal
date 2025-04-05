const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      console.log("No token provided")
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token decoded:", decoded)

      // Find user by id
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        console.log("User not found with id:", decoded.id)
        return res.status(401).json({ message: "User not found" })
      }

      // Add user to request
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }

      next()
    } catch (err) {
      console.error("Token verification error:", err)
      return res.status(401).json({ message: "Token is not valid" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = authMiddleware

