"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import JobSearch from "@/components/jobs/JobSearch"
import JobFilters from "@/components/jobs/JobFilters"
import JobList from "@/components/jobs/JobList"
import { jobsAPI, applicationsAPI } from "@/api/api"
import { toast } from "react-toastify"

const Jobs = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({})
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const search = searchParams.get("search") || ""
    const locationParam = searchParams.get("location") || ""

    setSearchQuery(search)

    const filters = {}
    if (search) filters.title = search
    if (locationParam) filters.location = locationParam

    const experienceLevel = searchParams.getAll("experienceLevel")
    const employmentType = searchParams.getAll("employmentType")
    const salaryRange = searchParams.get("salaryRange")
    const isRemote = searchParams.get("isRemote")
    const skills = searchParams.get("skills")

    if (experienceLevel.length) filters.experienceLevel = experienceLevel
    if (employmentType.length) filters.employmentType = employmentType
    if (salaryRange) filters.salaryRange = salaryRange
    if (isRemote) filters.isRemote = isRemote === "true"
    if (skills) filters.skills = skills.split(",")

    setActiveFilters(filters)

    fetchJobs(filters)
  }, [location.search])

  const fetchJobs = async (filters = {}) => {
    setIsLoading(true)
    console.log("Fetching jobs with filters:", filters)
    try {
      const response = await jobsAPI.getAllJobs(filters)
      console.log("API Response:", response)

      if (response && response.data) {
        setJobs(response.data)
      } else {
        console.warn("No data returned from API, using mock data")
        setJobs(getMockJobs())

        toast.info("Using demo data. Connected to mock data source instead of backend API.")
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)

      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.status, error.response.data)
        toast.error(`Server error: ${error.response.data.message || "Unknown server error"}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
        toast.error("No response from server. Please check your connection.")
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message)
        toast.error(`Error: ${error.message}`)
      }

      setJobs(getMockJobs())
      toast.info("Showing demo data instead.")
    } finally {
      setIsLoading(false)
    }
  }

  const getMockJobs = () => {
    return [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp Inc",
        location: "New York, NY (Remote)",
        salary: "$120K - $150K",
        postedDate: "2 days ago",
        description:
          "We're looking for an experienced Frontend Developer proficient with React, TypeScript, and modern CSS frameworks like Tailwind.",
      },
      {
        id: "2",
        title: "Product Manager",
        company: "InnovateSoft",
        location: "San Francisco, CA",
        salary: "$130K - $160K",
        postedDate: "3 days ago",
        description:
          "Join our product team to lead the development of cutting-edge SaaS solutions. Experience with agile methodologies required.",
      },
      {
        id: "3",
        title: "DevOps Engineer",
        company: "CloudScale Solutions",
        location: "Remote",
        salary: "$110K - $140K",
        postedDate: "1 week ago",
        description:
          "Seeking a DevOps professional to help us optimize our cloud infrastructure and deployment pipelines.",
      },
      {
        id: "4",
        title: "UX/UI Designer",
        company: "DesignHub",
        location: "Boston, MA (Hybrid)",
        salary: "$90K - $120K",
        postedDate: "5 days ago",
        description:
          "Looking for a talented UX/UI Designer to create beautiful and functional interfaces for our clients.",
      },
      {
        id: "5",
        title: "Full Stack Developer",
        company: "WebSphere",
        location: "Austin, TX",
        salary: "$100K - $130K",
        postedDate: "1 day ago",
        description: "Join our engineering team to build scalable web applications using modern technologies.",
      },
      {
        id: "6",
        title: "Data Scientist",
        company: "DataInsights",
        location: "Remote",
        salary: "$115K - $145K",
        postedDate: "4 days ago",
        description: "We're seeking a data scientist to help us extract meaningful insights from complex datasets.",
      },
      {
        id: "7",
        title: "Backend Developer",
        company: "Backend Solutions",
        location: "Seattle, WA",
        salary: "$110K - $140K",
        postedDate: "3 days ago",
        description: "Looking for a Backend Developer with experience in Node.js, Express, and MongoDB.",
      },
      {
        id: "8",
        title: "Marketing Specialist",
        company: "MarketPro",
        location: "Chicago, IL",
        salary: "$70K - $90K",
        postedDate: "5 days ago",
        description:
          "Join our marketing team to develop and execute marketing strategies. Experience with digital marketing is a plus.",
      },
      {
        id: "9",
        title: "HR Manager",
        company: "PeopleFirst",
        location: "Los Angeles, CA",
        salary: "$90K - $120K",
        postedDate: "1 week ago",
        description: "Seeking an HR Manager to oversee our HR department and ensure compliance with labor laws.",
      },
      {
        id: "10",
        title: "Software Engineer",
        company: "CodeWorks",
        location: "Denver, CO",
        salary: "$100K - $130K",
        postedDate: "2 days ago",
        description:
          "Join our team as a Software Engineer to develop and maintain our software products. Experience with Java and Spring Boot is required.",
      },
      {
        id: "11",
        title: "Graphic Designer",
        company: "Creative Studio",
        location: "Miami, FL",
        salary: "$60K - $80K",
        postedDate: "4 days ago",
        description: "Looking for a creative Graphic Designer with experience in Adobe Creative Suite.",
      },
      {
        id: "12",
        title: "Project Manager",
        company: "ProjectPro",
        location: "Dallas, TX",
        salary: "$110K - $140K",
        postedDate: "3 days ago",
        description:
          "Join our team as a Project Manager to oversee and manage various projects. PMP certification is a plus.",
      },
    ]
  }

  const handleSearch = (query) => {
    setSearchQuery(query)

    const searchParams = new URLSearchParams(location.search)
    searchParams.set("search", query)

    navigate(`/jobs?${searchParams.toString()}`)
  }

  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters)

    if (searchQuery) filters.title = searchQuery

    const searchParams = new URLSearchParams()

    if (filters.title) searchParams.set("search", filters.title)
    if (filters.location) searchParams.set("location", filters.location)

    if (filters.experienceLevel) {
      filters.experienceLevel.forEach((level) => {
        searchParams.append("experienceLevel", level)
      })
    }

    if (filters.employmentType) {
      filters.employmentType.forEach((type) => {
        searchParams.append("employmentType", type)
      })
    }

    if (filters.salaryRange) searchParams.set("salaryRange", filters.salaryRange)

    if (filters.isRemote !== undefined) searchParams.set("isRemote", filters.isRemote.toString())

    if (filters.skills) searchParams.set("skills", filters.skills.join(","))

    navigate(`/jobs?${searchParams.toString()}`)

    if (window.innerWidth < 768) {
      setShowFilters(false)
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleApplyForJob = async (jobId, formData) => {
    try {
      setIsLoading(true)
      const response = await applicationsAPI.applyForJob(formData)

      if (response && response.data) {
        toast.success("Application submitted successfully")
      } else {
        toast.warning("Application received but no confirmation from server")
      }
    } catch (error) {
      console.error("Application error:", error)

      // More specific error handling
      if (error.response) {
        toast.error(`Application failed: ${error.response.data.message || "Server error"}`)
      } else if (error.request) {
        toast.error("No response from server. Please try again later.")
      } else {
        toast.error(`Error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <JobSearch
            showFiltersOnMobile={showFilters}
            toggleFilters={toggleFilters}
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />

          <div className="flex flex-col md:flex-row gap-6">
            <JobFilters
              showOnMobile={showFilters}
              toggleFilters={toggleFilters}
              onApplyFilters={handleApplyFilters}
              initialFilters={activeFilters}
            />

            <motion.div
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <JobList jobs={jobs} isLoading={isLoading} onApply={handleApplyForJob} />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Jobs

