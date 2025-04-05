"use client"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import {
  Building,
  ChevronRight,
  ClipboardList,
  Clock,
  Plus,
  BarChart,
  Users,
  MessageSquare,
  Filter,
} from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Button from "@/components/shared/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const EmployerDashboard = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Action handlers
  const handlePostJob = () => {
    navigate("/post-job")
  }

  const handleReviewApplicants = () => {
    navigate("/employer/applications")
    toast({
      title: "Review Applicants",
      description: "Viewing all applications.",
    })
  }

  const handleMessageCandidates = () => {
    navigate("/messages")
    toast({
      title: "Messages",
      description: "Opening messaging center.",
    })
  }

  const handleViewAnalytics = () => {
    navigate("/employer/analytics")
    toast({
      title: "Analytics",
      description: "Viewing detailed job analytics.",
    })
  }

  const handleEditCompanyProfile = () => {
    navigate("/company/edit")
    toast({
      title: "Company Profile",
      description: "Edit your company profile.",
    })
  }

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`)
    toast({
      title: "View Job",
      description: "Viewing job details.",
    })
  }

  const handleEditJob = (jobId) => {
    navigate(`/job/${jobId}/edit`)
    toast({
      title: "Edit Job",
      description: "Edit job posting.",
    })
  }

  const handleCloseJob = (jobId) => {
    toast({
      title: "Job Closed",
      description: "The job has been closed successfully.",
    })
    // In a real app, you would make an API call to close the job
    // Example: jobsAPI.closeJob(jobId)
  }

  const handleReviewApplication = (applicationId) => {
    navigate(`/applications/${applicationId}`)
    toast({
      title: "Application Review",
      description: "Reviewing candidate application.",
    })
  }

  const handleViewResume = (applicationId) => {
    window.open(`/resume/${applicationId}`, "_blank")
    toast({
      title: "Resume",
      description: "Opening resume in new tab.",
    })
  }

  const handleMessageApplicant = (applicantId) => {
    navigate(`/messages/user/${applicantId}`)
    toast({
      title: "Message",
      description: "Opening messaging with candidate.",
    })
  }

  const handleContactCandidate = (candidateId) => {
    navigate(`/messages/user/${candidateId}`)
    toast({
      title: "Contact Candidate",
      description: "Contacting shortlisted candidate.",
    })
  }

  const handleViewCandidateProfile = (candidateId) => {
    navigate(`/candidate/${candidateId}`)
    toast({
      title: "Candidate Profile",
      description: "Viewing candidate profile.",
    })
  }

  const handleScheduleInterview = (candidateId) => {
    navigate(`/schedule/${candidateId}`)
    toast({
      title: "Schedule Interview",
      description: "Setting up interview with candidate.",
    })
  }

  const handleViewDetailedAnalytics = () => {
    navigate("/employer/analytics")
    toast({
      title: "Detailed Analytics",
      description: "Viewing comprehensive job analytics.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Employer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your job postings and applicants</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar - Quick Stats */}
            <div className="md:col-span-1 space-y-6">
              {/* Company Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Company Profile</CardTitle>
                  <CardDescription>Manage your company information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 mr-4 flex items-center justify-center">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">TechCorp Inc</h3>
                      <p className="text-sm text-muted-foreground">Technology / SaaS</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Completion</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" onClick={handleEditCompanyProfile}>
                    Edit Company Profile
                  </Button>
                </CardFooter>
              </Card>

              {/* Job Posting Stats Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Job Posting Stats</CardTitle>
                  <CardDescription>Overview of your job listings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="font-semibold text-2xl">8</div>
                      <div className="text-sm text-muted-foreground">Active Jobs</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="font-semibold text-2xl">43</div>
                      <div className="text-sm text-muted-foreground">Applicants</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="font-semibold text-2xl">12</div>
                      <div className="text-sm text-muted-foreground">Interviews</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="font-semibold text-2xl">4</div>
                      <div className="text-sm text-muted-foreground">Positions Filled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" size="sm" onClick={handlePostJob}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post a New Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleReviewApplicants}>
                    <Users className="mr-2 h-4 w-4" />
                    Review Applicants
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={handleMessageCandidates}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Candidates
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleViewAnalytics}>
                    <BarChart className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Applications Tab Container */}
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="jobs" className="w-full">
                    <div className="border-b border-border">
                      <div className="px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
                          <TabsTrigger value="applications">Applications</TabsTrigger>
                          <TabsTrigger value="candidates">Candidates</TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    {/* Active Jobs Tab */}
                    <TabsContent value="jobs" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Your Job Listings</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/employer/jobs")}>
                          Manage All Jobs
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">
                                {i === 1
                                  ? "Senior Frontend Developer"
                                  : i === 2
                                    ? "UX/UI Designer"
                                    : "Full Stack Developer"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Posted {i === 1 ? "2 days ago" : i === 2 ? "5 days ago" : "1 week ago"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <ClipboardList className="h-3 w-3 mr-1" />
                                {i === 1 ? "18" : i === 2 ? "12" : "13"} applications
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button size="sm" variant="outline" onClick={() => handleViewJob(i)}>
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditJob(i)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleCloseJob(i)}
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Recent Applications</h3>
                        <div className="flex items-center">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigate("/employer/applications")}>
                            View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">John Doe {i}</div>
                              <div className="text-sm text-muted-foreground">
                                Applied for: {i % 2 === 0 ? "Senior Frontend Developer" : "UX/UI Designer"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {i === 1 ? "Today" : i === 2 ? "Yesterday" : i === 3 ? "3 days ago" : "1 week ago"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button size="sm" onClick={() => handleReviewApplication(i)}>
                                Review
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleViewResume(i)}>
                                Resume
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleMessageApplicant(i)}>
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Candidates Tab */}
                    <TabsContent value="candidates" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Shortlisted Candidates</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/employer/candidates")}>
                          View All
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">Jane Smith {i}</div>
                              <div className="text-sm text-muted-foreground">
                                Position:{" "}
                                {i === 1
                                  ? "Senior Frontend Developer"
                                  : i === 2
                                    ? "UX/UI Designer"
                                    : "Full Stack Developer"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Status: {i === 1 ? "Interview Scheduled" : i === 2 ? "Assessment" : "Final Interview"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button size="sm" onClick={() => handleContactCandidate(i)}>
                                Contact
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleViewCandidateProfile(i)}>
                                Profile
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleScheduleInterview(i)}>
                                Schedule
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Analytics Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Job Posting Analytics</CardTitle>
                  <CardDescription>Performance of your job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Senior Frontend Developer</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Views: 245</span>
                        <span>Applications: 18</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">Conversion rate: 7.3%</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">UX/UI Designer</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Views: 187</span>
                        <span>Applications: 12</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">Conversion rate: 6.4%</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Full Stack Developer</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Views: 203</span>
                        <span>Applications: 13</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">Conversion rate: 6.4%</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="ghost" className="w-full" onClick={handleViewDetailedAnalytics}>
                    View Detailed Analytics
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EmployerDashboard

