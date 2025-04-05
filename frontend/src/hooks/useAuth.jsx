"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "./use-toast"
import axios from "axios"

// Set the API base URL correctly
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("authUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse auth user:", error)
        localStorage.removeItem("authUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      // Call the backend API for login - fix the URL path
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      })

      const { user, token } = response.data

      // Store user data and token
      setUser(user)
      localStorage.setItem("authUser", JSON.stringify(user))
      localStorage.setItem("authToken", token)

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })

      // Redirect to the appropriate dashboard based on role
      if (user.role === "admin") {
        navigate("/dashboard/admin")
      } else if (user.role === "employer") {
        navigate("/dashboard/employer")
      } else {
        navigate("/dashboard/candidate")
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Sign in failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const register = async (email, password, fullName, role) => {
    setIsLoading(true)
    try {
      // Call the backend API for registration - fix the URL path
      const response = await axios.post(`${API_URL}/api/users/register`, {
        email,
        password,
        fullName,
        role,
      })

      const { user, token } = response.data

      // Store user data and token
      setUser(user)
      localStorage.setItem("authUser", JSON.stringify(user))
      localStorage.setItem("authToken", token)

      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      })

      // Redirect to the appropriate dashboard based on role
      if (role === "employer") {
        navigate("/dashboard/employer")
      } else {
        navigate("/dashboard/candidate")
      }

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Sign up failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const scheduleInterview = async (candidateEmail, date, time) => {
    try {
      // In a real app, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get existing interviews or initialize empty array
      const interviews = JSON.parse(localStorage.getItem("interviews") || "[]")

      // Add new interview
      const newInterview = {
        id: `interview-${Date.now()}`,
        candidateEmail,
        date,
        time,
        status: "scheduled",
        scheduledBy: user?.email,
        createdAt: new Date().toISOString(),
      }

      interviews.push(newInterview)
      localStorage.setItem("interviews", JSON.stringify(interviews))

      // In a real app, you would call an API to send an email
      // For demo purposes, we'll just simulate success
      const emailSuccess = await sendEmail(
        candidateEmail,
        "Interview Scheduled",
        `Your interview has been scheduled for ${date} at ${time}.`,
      )

      toast({
        title: "Interview Scheduled",
        description: `Interview with ${candidateEmail} scheduled for ${date} at ${time}.`,
      })

      return true
    } catch (error) {
      console.error("Failed to schedule interview:", error)
      toast({
        title: "Failed to schedule interview",
        description: "There was an error scheduling the interview. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const sendEmail = async (to, subject, message) => {
    try {
      // In a real app, this would call your backend API to send an actual email
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Log the email for demo purposes
      console.log(`Email sent to: ${to}, Subject: ${subject}, Message: ${message}`)

      // Store in local storage for demo purposes
      const sentEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]")
      sentEmails.push({
        to,
        subject,
        message,
        sentAt: new Date().toISOString(),
        sentBy: user?.email,
      })
      localStorage.setItem("sentEmails", JSON.stringify(sentEmails))

      toast({
        title: "Email Sent",
        description: `Email has been sent to ${to}.`,
      })

      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      toast({
        title: "Failed to send email",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("authUser")
    localStorage.removeItem("authToken")
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    })
    navigate("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        scheduleInterview,
        sendEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default useAuth

