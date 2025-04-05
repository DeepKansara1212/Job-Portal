
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building, 
  ChevronRight, 
  ClipboardList, 
  Clock, 
  FileText, 
  Plus, 
  Settings, 
  User,
  BookOpen,
  Star
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

// Define interface types for our data
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

const CandidateDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    navigate("/profile");
  };
  
  const handleViewJobDetails = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };
  
  const handleViewCompany = (companyId: string) => {
    navigate(`/company/${companyId || "tech-corp"}`);
  };
  
  const handleViewAllApplications = () => {
    toast({
      title: "Coming Soon",
      description: "The full applications page is currently being developed.",
    });
  };
  
  const handleViewAllSavedJobs = () => {
    navigate("/saved-jobs");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track your job applications and career progress
              </p>
            </div>
          </div>
          
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
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleEditProfile}
                  >
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleViewAllApplications}
                        >
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
                                <Building 
                                  className="h-3 w-3 mr-1 cursor-pointer" 
                                  onClick={() => handleViewCompany("tech-corp")}
                                />
                                <span 
                                  className="cursor-pointer hover:underline"
                                  onClick={() => handleViewCompany("tech-corp")}
                                >
                                  {app.company}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Applied on {formatDate(app.appliedDate)}
                              </div>
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(app.status)} mr-2`}></div>
                              <span className="text-sm font-medium mr-4">{getStatusText(app.status)}</span>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Saved Jobs Tab */}
                    <TabsContent value="saved" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Saved Jobs</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleViewAllSavedJobs}
                        >
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
                                <Building 
                                  className="h-3 w-3 mr-1 cursor-pointer" 
                                  onClick={() => handleViewCompany("tech-corp")}
                                />
                                <span 
                                  className="cursor-pointer hover:underline"
                                  onClick={() => handleViewCompany("tech-corp")}
                                >
                                  {job.company}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Posted {job.postedDate}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button 
                                size="sm" 
                                onClick={() => handleViewJobDetails(job.id)}
                              >
                                View Job
                              </Button>
                              <Button size="sm" variant="outline">Apply Now</Button>
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
                              <Button size="sm" href={`/job/${job.id}`}>View Job</Button>
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
                  <Button variant="ghost" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;
