"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Button from "@/components/shared/Button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card"

type UserRole = "jobseeker" | "employer"

const SignUp = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userRole, setUserRole] = useState<UserRole>("jobseeker")
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Check password length
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    try {
      await register(email, password, fullName, userRole)
      // Navigation is handled in the register function if successful
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="w-full bg-white bg-opacity-90 flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
              <img src="/Login.png" alt="Login" className="w-full h-auto" />
            </div>
            <div className="w-full md:w-1/2 p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">Enter your information to sign up</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-2 border border-border rounded-md"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full p-2 border border-border rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full p-2 border border-border rounded-md pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-2 border border-border rounded-md"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">I am a:</label>
                    <div className="flex rounded-md overflow-hidden border border-border p-1">
                      <button
                        type="button"
                        className={`flex-1 text-sm py-2 px-4 rounded-md transition-colors ${
                          userRole === "jobseeker" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setUserRole("jobseeker")}
                      >
                        Job Seeker
                      </button>
                      <button
                        type="button"
                        className={`flex-1 text-sm py-2 px-4 rounded-md transition-colors ${
                          userRole === "employer" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setUserRole("employer")}
                      >
                        Employer
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/auth/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" disabled={isLoading}>
                    Google
                  </Button>
                  <Button variant="outline" type="button" disabled={isLoading}>
                    LinkedIn
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignUp

