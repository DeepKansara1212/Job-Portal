"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Button from "@/components/shared/Button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    // Check that the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      // For admin login, we'll use the hardcoded credentials from the backend
      const success = await login(email, password)
      if (success) {
        // Navigation is handled in the login function
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`
  }

  const toggleAdminLogin = () => {
    setIsAdmin(!isAdmin)
    if (!isAdmin) {
      setEmail("admin@joburfinder.com")
      setPassword("admin123")
    } else {
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            className="w-full bg-white bg-opacity-90 flex flex-col md:flex-row"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
              <img src="/Signin.png" alt="Signin" className="w-full h-auto" />
            </div>
            <div className="w-full md:w-1/2 p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
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

                  <div className="flex items-center space-x-2">
                    <input
                      id="admin-login"
                      type="checkbox"
                      className="h-4 w-4 border border-border rounded"
                      checked={isAdmin}
                      onChange={toggleAdminLogin}
                    />
                    <label htmlFor="admin-login" className="text-sm">
                      Sign in as Administrator
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input id="remember-me" type="checkbox" className="h-4 w-4 border border-border rounded" />
                      <label htmlFor="remember-me" className="text-sm">
                        Remember me
                      </label>
                    </div>
                    <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/auth/signup" className="text-primary hover:underline">
                    Sign Up
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
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthLogin("google")}
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthLogin("linkedin")}
                  >
                    LinkedIn
                  </Button>
                </div>
              </CardFooter>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignIn

