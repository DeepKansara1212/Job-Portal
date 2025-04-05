"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Briefcase, Calendar, DollarSign, Globe, MapPin, Star } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Button from "@/components/shared/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const PostJob = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasCompany, setHasCompany] = useState(false)
  const [companyData, setCompanyData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    isRemote: false,
    salary: {
      min: "",
      max: "",
      currency: "USD",
    },
    description: "",
    requirements: "",
    responsibilities: "",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    skills: "",
    expiryDate: "",
  })

  // Check if user has a company
  useEffect(() => {
    const checkCompany = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        console.log("Checking for user companies...")

        // Fetch companies owned by the user
        const response = await axios.get(`${API_URL}/api/companies/my-companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Companies response:", response.data)

        if (response.data && response.data.length > 0) {
          setHasCompany(true)
          setCompanyData(response.data[0])
          setFormData((prev) => ({
            ...prev,
            company: response.data[0]._id,
          }))
        } else {
          setHasCompany(false)
        }
      } catch (error) {
        console.error("Error checking company:", error)
        setHasCompany(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkCompany()
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      // Handle nested objects like salary.min
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.requirements ||
        !formData.responsibilities ||
        !formData.skills
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Validate salary range
      if (formData.salary.min && formData.salary.max && Number(formData.salary.min) > Number(formData.salary.max)) {
        throw new Error("Minimum salary cannot be greater than maximum salary")
      }

      // Check if user has a company associated
      if (!hasCompany || !companyData) {
        throw new Error("No company associated with your account. Please set up your company profile first.")
      }

      // Format the data for API
      const jobData = {
        ...formData,
        requirements: formData.requirements.split("\n").filter((item) => item.trim()),
        responsibilities: formData.responsibilities.split("\n").filter((item) => item.trim()),
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      }

      // Get the auth token
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Call API to create a job
      const response = await axios.post(`${API_URL}/api/jobs`, jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        toast({
          title: "Job Posted Successfully",
          description: "Your job listing has been created and is now visible to job seekers.",
        })

        // Redirect to job details or dashboard
        navigate(`/job/${response.data._id}`)
      } else {
        throw new Error("Failed to create job posting. Please try again.")
      }
    } catch (error) {
      console.error("Failed to post job:", error)

      let errorMessage = "There was an error posting your job. Please try again."
      const errorTitle = "Failed to Post Job"

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      // Special handling for company not found error
      if (errorMessage.includes("company") && errorMessage.includes("profile")) {
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        })

        // Redirect to company creation page after a short delay
        setTimeout(() => {
          navigate("/company/create")
        }, 1500)
        return
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Loading...</h1>
            <p className="mt-4 text-muted-foreground">Please wait while we check your account.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-4 text-muted-foreground">Please sign in as an employer to post a job.</p>
            <Button className="mt-6" href="/auth/signin">
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!hasCompany) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Company Profile Required</h1>
            <p className="mt-4 text-muted-foreground">You need to create a company profile before posting jobs.</p>
            <Button className="mt-6" href="/company/create">
              Create Company Profile
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Rest of the component remains the same...
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard/employer")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Post a New Job</CardTitle>
                <CardDescription>
                  Enter the details of your job listing below. Be thorough to attract the right candidates.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Basic Job Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full p-2 border border-border rounded-md"
                          placeholder="e.g., Senior Frontend Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={companyData?.name || ""}
                          disabled
                          className="w-full p-2 border border-border rounded-md bg-muted"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium">
                          Location
                        </label>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isRemote"
                            checked={formData.isRemote}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4"
                          />
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>This is a remote position</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="salary.min" className="block text-sm font-medium">
                          Minimum Salary
                        </label>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input
                            id="salary.min"
                            name="salary.min"
                            type="number"
                            value={formData.salary.min}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., 75000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="salary.max" className="block text-sm font-medium">
                          Maximum Salary
                        </label>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input
                            id="salary.max"
                            name="salary.max"
                            type="number"
                            value={formData.salary.max}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="e.g., 95000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="salary.currency" className="block text-sm font-medium">
                          Currency
                        </label>
                        <select
                          id="salary.currency"
                          name="salary.currency"
                          value={formData.salary.currency}
                          onChange={handleChange}
                          className="w-full p-2 border border-border rounded-md"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Job Details</h3>
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-md"
                        placeholder="Describe the role in detail..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="requirements" className="block text-sm font-medium">
                        Requirements <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        rows={4}
                        required
                        value={formData.requirements}
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-md"
                        placeholder="List each requirement on a new line..."
                      />
                      <p className="text-xs text-muted-foreground">Enter each requirement on a new line</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="responsibilities" className="block text-sm font-medium">
                        Responsibilities <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="responsibilities"
                        name="responsibilities"
                        rows={4}
                        required
                        value={formData.responsibilities}
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-md"
                        placeholder="List each responsibility on a new line..."
                      />
                      <p className="text-xs text-muted-foreground">Enter each responsibility on a new line</p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="employmentType" className="block text-sm font-medium">
                          Employment Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <select
                            id="employmentType"
                            name="employmentType"
                            required
                            value={formData.employmentType}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="experienceLevel" className="block text-sm font-medium">
                          Experience Level <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                          <select
                            id="experienceLevel"
                            name="experienceLevel"
                            required
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-md"
                          >
                            <option value="Entry Level">Entry Level</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Senior Level">Senior Level</option>
                            <option value="Director">Director</option>
                            <option value="Executive">Executive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="skills" className="block text-sm font-medium">
                        Required Skills <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        required
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-md"
                        placeholder="e.g., JavaScript, React, Node.js"
                      />
                      <p className="text-xs text-muted-foreground">Separate skills with commas</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="block text-sm font-medium">
                        Listing Expiry Date
                      </label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className="w-full p-2 border border-border rounded-md"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard/employer")}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Job"}
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

export default PostJob

