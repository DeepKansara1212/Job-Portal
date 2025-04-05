"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building, MapPin, Users, Globe, Briefcase, Upload } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Button from "@/components/shared/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const CreateCompany = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    size: "1-10",
  })

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Basic validation
      if (!formData.name || !formData.description || !formData.industry || !formData.location) {
        throw new Error("Please fill in all required fields")
      }

      // Website URL validation
      if (formData.website && !formData.website.match(/^(https?:\/\/)?[\w-]+\.[\w-.]+/)?.length) {
        throw new Error("Please enter a valid website URL")
      }

      // Create form data for file upload
      const companyData = new FormData()
      companyData.append("name", formData.name)
      companyData.append("description", formData.description)
      companyData.append("industry", formData.industry)
      companyData.append("location", formData.location)
      companyData.append("website", formData.website)
      companyData.append("size", formData.size)

      if (logoFile) {
        companyData.append("logo", logoFile)
      }

      // Get the auth token
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Log the request details for debugging
      console.log("Sending request to:", `${API_URL}/api/companies`)
      console.log("Form data:", Object.fromEntries(companyData.entries()))
      console.log("Auth token:", token)

      // Make the API request
      const response = await axios.post(`${API_URL}/api/companies`, companyData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        // Update user's company ID in local storage
        const updatedUser = { ...user, companyId: response.data._id }
        localStorage.setItem("authUser", JSON.stringify(updatedUser))

        toast({
          title: "Company Profile Created",
          description: "Your company profile has been created successfully.",
        })

        // Navigate to employer dashboard
        navigate("/dashboard/employer")
      }
    } catch (error) {
      console.error("Error creating company profile:", error)

      let errorMessage = "Failed to create company profile. Please try again."
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-4 text-muted-foreground">Please sign in as an employer to create a company profile.</p>
            <Button className="mt-6" href="/auth/signin">
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Company Profile</CardTitle>
                <CardDescription>
                  Fill in your company details to start posting jobs and finding the best talent.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Company Logo Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Company Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload">
                          <Button type="button" variant="outline" className="cursor-pointer">
                            Choose Logo
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended: Square image, at least 200x200px
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., TechCorp Inc"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="industry" className="block text-sm font-medium">
                          Industry <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                          <input
                            id="industry"
                            name="industry"
                            type="text"
                            required
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., Information Technology"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        Company Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-md"
                        placeholder="Tell us about your company..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <input
                            id="location"
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-medium">
                          Website
                        </label>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          <input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., https://example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="size" className="block text-sm font-medium">
                        Company Size
                      </label>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <select
                          id="size"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="w-full p-2 border border-border rounded-md"
                        >
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1001+">1001+ employees</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border pt-6">
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard/employer")}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Profile"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CreateCompany

