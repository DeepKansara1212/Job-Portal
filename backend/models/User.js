const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  role: {
    type: String,
    enum: {
      values: ["jobseeker", "employer", "admin"],
      message: "{VALUE} is not a valid role",
    },
    default: "jobseeker",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: String,
  phone: String,
  location: String,
  bio: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String,
    },
  ],
  verificationCode: String,
  verificationCodeExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it's modified (or new)
    if (!this.isModified("password")) {
      return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    console.error("Password comparison error:", error)
    throw error
  }
}

// Add a static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

const User = mongoose.model("User", userSchema)

module.exports = User

