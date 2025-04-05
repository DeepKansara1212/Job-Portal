const nodemailer = require("nodemailer")

// Create reusable transporter
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || "gmail"
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASSWORD

  if (!user || !pass) {
    throw new Error("Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.")
  }

  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  })
}

// Send email function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    }

    console.log("Sending email to:", to)
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

// Send verification email
const sendVerificationEmail = async (user, verificationCode) => {
  const subject = "Verify Your Email - Job Portal"
  const text = `Hello ${user.fullName},\n\nYour verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.\n\nThank you,\nJob Portal Team`

  return sendEmail({
    to: user.email,
    subject,
    text,
  })
}

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

  const subject = "Password Reset - Job Portal"
  const text = `Hello ${user.fullName},\n\nYou requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nThank you,\nJob Portal Team`

  return sendEmail({
    to: user.email,
    subject,
    text,
  })
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
}

