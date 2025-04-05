
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Briefcase, 
  Building, 
  ChevronRight, 
  ClipboardList, 
  Clock, 
  FileText, 
  Plus, 
  Settings, 
  User
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data for the dashboard
const applications = [
  { 
    id: "app1", 
    jobTitle: "Senior Frontend Developer", 
    company: "TechCorp Inc", 
    status: "applied", 
    appliedDate: "2023-07-15" 
  },
  { 
    id: "app2", 
    jobTitle: "UX/UI Designer", 
    company: "DesignHub", 
    status: "interview", 
    appliedDate: "2023-07-12" 
  },
  { 
    id: "app3", 
    jobTitle: "Product Manager", 
    company: "InnovateSoft", 
    status: "rejected", 
    appliedDate: "2023-07-01" 
  },
  { 
    id: "app4", 
    jobTitle: "Full Stack Developer", 
    company: "WebSphere", 
    status: "offered", 
    appliedDate: "2023-06-28" 
  },
];

const savedJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    location: "New York, NY (Remote)",
    salary: "$120K - $150K",
    postedDate: "2 days ago"
  },
  {
    id: "4",
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Boston, MA (Hybrid)",
    salary: "$90K - $120K",
    postedDate: "5 days ago"
  },
  {
    id: "5",
    title: "Full Stack Developer",
    company: "WebSphere",
    location: "Austin, TX",
    salary: "$100K - $130K",
    postedDate: "1 day ago"
  }
];

// Define interface types for our data to avoid circular references
interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "applied":
      return "bg-blue-500";
    case "interview":
      return "bg-yellow-500";
    case "rejected":
      return "bg-red-500";
    case "offered":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "applied":
      return "Applied";
    case "interview":
      return "Interview";
    case "rejected":
      return "Rejected";
    case "offered":
      return "Offered";
    default:
      return "Unknown";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userType, setUserType] = useState<"jobseeker" | "employer">("jobseeker");
  
  // Automatically set user type based on authentication
  useEffect(() => {
    if (user && user.role) {
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "employer") {
        setUserType("employer");
      } else {
        setUserType("jobseeker");
      }
    }
  }, [user, navigate]);

  // Toggle user type (for demonstration)
  const toggleUserType = () => {
    setUserType(prev => prev === "jobseeker" ? "employer" : "jobseeker");
  };

  // Navigation handlers
  const handleProfileEdit = () => {
    navigate("/profile");
  };

  const handleViewApplications = () => {
    navigate("/applications");
  };

  const handleViewSavedJobs = () => {
    navigate("/saved-jobs");
  };

  const handleViewJobDetails = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleViewAllActivity = () => {
    navigate("/activity");
  };

  const handleApplyNow = (jobId: string) => {
    navigate(`/job/${jobId}/apply`);
  };

  const handleAdminDashboard = () => {
    navigate("/dashboard/admin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {userType === "jobseeker" 
                  ? "Track your job applications and career progress" 
                  : "Manage your job postings and applicants"}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="mr-2 text-sm">Current View:</span>
              <Button variant="outline" size="sm" onClick={toggleUserType}>
                {userType === "jobseeker" ? "Job Seeker" : "Employer"}
              </Button>
              {user && user.role === "admin" && (
                <Button variant="default" size="sm" onClick={handleAdminDashboard}>
                  Admin Dashboard
                </Button>
              )}
            </div>
          </div>
          
          {userType === "jobseeker" ? (
            <JobSeekerDashboard 
              applications={applications} 
              savedJobs={savedJobs}
              onEditProfile={handleProfileEdit}
              onViewApplications={handleViewApplications}
              onViewSavedJobs={handleViewSavedJobs}
              onViewJobDetails={handleViewJobDetails}
              onApplyNow={handleApplyNow}
              onViewAllActivity={handleViewAllActivity}
            />
          ) : (
            <EmployerDashboard />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Job Seeker Dashboard View
const JobSeekerDashboard = ({ 
  applications, 
  savedJobs,
  onEditProfile,
  onViewApplications,
  onViewSavedJobs,
  onViewJobDetails,
  onApplyNow,
  onViewAllActivity
}: { 
  applications: Application[], 
  savedJobs: SavedJob[],
  onEditProfile: () => void,
  onViewApplications: () => void,
  onViewSavedJobs: () => void,
  onViewJobDetails: (jobId: string) => void,
  onApplyNow: (jobId: string) => void,
  onViewAllActivity: () => void
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Sidebar - Quick Stats */}
      <div className="md:col-span-1 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Profile Overview</CardTitle>
            <CardDescription>Your profile and resume status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mr-4 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">Senior Frontend Developer</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Completion</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Resume</span>
                </div>
                <span className="text-green-500">Uploaded</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Work Experience</span>
                </div>
                <span className="text-green-500">Completed</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Skills</span>
                </div>
                <span className="text-yellow-500">In Progress</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <Button variant="outline" className="w-full" onClick={onEditProfile}>
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        {/* Application Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Application Stats</CardTitle>
            <CardDescription>Your job application activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="font-semibold text-2xl">12</div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="font-semibold text-2xl">3</div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="font-semibold text-2xl">85</div>
                <div className="text-sm text-muted-foreground">Profile Views</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="font-semibold text-2xl">1</div>
                <div className="text-sm text-muted-foreground">Offers</div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Application Response Rate</div>
              <Progress value={33} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">4 out of 12 applications received responses</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Area */}
      <div className="md:col-span-2 space-y-6">
        {/* Applications Tab Container */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="applications" className="w-full">
              <div className="border-b border-border">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Applications Tab */}
              <TabsContent value="applications" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recent Applications</h3>
                  <Button variant="ghost" size="sm" onClick={onViewApplications}>
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {applications.map(app => (
                    <div 
                      key={app.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium">{app.jobTitle}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {app.company}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied on {formatDate(app.appliedDate)}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(app.status)} mr-2`}></div>
                        <span className="text-sm font-medium mr-4">{getStatusText(app.status)}</span>
                        <Button size="sm" variant="outline" onClick={() => onViewJobDetails(app.id)}>View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Saved Jobs Tab */}
              <TabsContent value="saved" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Saved Jobs</h3>
                  <Button variant="ghost" size="sm" onClick={onViewSavedJobs}>
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {savedJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {job.company}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Posted {job.postedDate}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Button size="sm" onClick={() => onViewJobDetails(job.id)}>View Job</Button>
                        <Button size="sm" variant="outline" onClick={() => onApplyNow(job.id)}>Apply Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Recommended Jobs Tab */}
              <TabsContent value="recommended" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recommended for You</h3>
                  <div className="text-sm text-muted-foreground">Based on your profile and preferences</div>
                </div>
                
                <div className="space-y-4">
                  {savedJobs.slice().reverse().map(job => (
                    <div 
                      key={job.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {job.company}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Posted {job.postedDate}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Button size="sm" onClick={() => onViewJobDetails(job.id)}>View Job</Button>
                        <Button size="sm" variant="outline">Save</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Recent Activity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your recent actions and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Resume Updated</div>
                  <div className="text-sm text-muted-foreground">You uploaded a new version of your resume</div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Application Submitted</div>
                  <div className="text-sm text-muted-foreground">You applied to "UX/UI Designer" at DesignHub</div>
                  <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Interview Scheduled</div>
                  <div className="text-sm text-muted-foreground">Interview with TechCorp Inc. for Senior Frontend Developer</div>
                  <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <Button variant="ghost" className="w-full" onClick={onViewAllActivity}>
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Employer Dashboard View
const EmployerDashboard = () => {
  const navigate = useNavigate();

  // Navigation handlers for employer dashboard
  const handlePostJob = () => {
    navigate("/employer/post-job");
  };

  const handleManageJobs = () => {
    navigate("/employer/jobs");
  };

  const handleViewJob = (id: string) => {
    navigate(`/employer/job/${id}`);
  };

  const handleEditJob = (id: string) => {
    navigate(`/employer/job/${id}/edit`);
  };

  const handleViewApplications = () => {
    navigate("/employer/applications");
  };

  const handleReviewApplication = (id: string) => {
    navigate(`/employer/application/${id}`);
  };

  const handleViewResume = (id: string) => {
    navigate(`/employer/resume/${id}`);
  };

  const handleViewCandidates = () => {
    navigate("/employer/candidates");
  };

  const handleContactCandidate = (id: string) => {
    navigate(`/employer/candidate/${id}/contact`);
  };

  const handleViewCandidateProfile = (id: string) => {
    navigate(`/employer/candidate/${id}`);
  };

  const handleAnalytics = () => {
    navigate("/employer/analytics");
  };

  const handleEditCompanyProfile = () => {
    navigate("/employer/company/edit");
  };

  return (
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
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleEditCompanyProfile}
            >
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
      </div>
      
      {/* Main Content Area */}
      <div className="md:col-span-2 space-y-6">
        {/* Create Job Button */}
        <Button className="w-full" onClick={handlePostJob}>
          <Plus className="mr-2 h-4 w-4" />
          Post a New Job
        </Button>
      
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
                  <Button variant="ghost" size="sm" onClick={handleManageJobs}>
                    Manage All Jobs
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium">{i === 1 ? "Senior Frontend Developer" : i === 2 ? "UX/UI Designer" : "Full Stack Developer"}</div>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewJob(`job${i}`)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditJob(`job${i}`)}
                        >
                          Edit
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleViewApplications}
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
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
                        <Button 
                          size="sm"
                          onClick={() => handleReviewApplication(`app${i}`)}
                        >
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewResume(`app${i}`)}
                        >
                          Resume
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleViewCandidates}
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="font-medium">Jane Smith {i}</div>
                        <div className="text-sm text-muted-foreground">
                          Position: {i === 1 ? "Senior Frontend Developer" : i === 2 ? "UX/UI Designer" : "Full Stack Developer"}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Status: {i === 1 ? "Interview Scheduled" : i === 2 ? "Assessment" : "Final Interview"}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Button 
                          size="sm"
                          onClick={() => handleContactCandidate(`candidate${i}`)}
                        >
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewCandidateProfile(`candidate${i}`)}
                        >
                          Profile
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
            <Button variant="ghost" className="w-full" onClick={handleAnalytics}>
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
