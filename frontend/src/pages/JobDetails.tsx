import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Building, Clock, DollarSign, MapPin, SendHorizontal, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/shared/Card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Mock job data - would be fetched from API in a real implementation
const jobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    companyId: "tech-corp",
    companyLogo: "/placeholder.svg",
    location: "New York, NY (Remote)",
    salary: "$120K - $150K",
    postedDate: "2 days ago",
    description: "We're looking for an experienced Frontend Developer proficient with React, TypeScript, and modern CSS frameworks like Tailwind. The ideal candidate will have at least 5 years of experience building responsive, accessible web applications and a strong understanding of modern web development practices.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Experience with state management libraries (Redux, MobX, Zustand, etc.)",
      "Strong understanding of CSS and modern CSS frameworks",
      "Experience with responsive design and cross-browser compatibility",
      "Knowledge of accessibility standards and practices"
    ],
    responsibilities: [
      "Develop new user-facing features using React and TypeScript",
      "Build reusable components and libraries for future use",
      "Translate designs and wireframes into high-quality code",
      "Optimize components for maximum performance across all devices and browsers",
      "Participate in code reviews and provide constructive feedback to other developers"
    ],
    benefits: [
      "Competitive salary: $120K - $150K",
      "Remote work with flexible hours",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Home office stipend"
    ]
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateSoft",
    companyId: "innovate-soft",
    companyLogo: "/placeholder.svg",
    location: "San Francisco, CA",
    salary: "$130K - $160K",
    postedDate: "3 days ago",
    description: "Join our product team to lead the development of cutting-edge SaaS solutions. Experience with agile methodologies required.",
    requirements: [
      "5+ years of experience in product management",
      "Experience with agile methodologies",
      "Strong analytical and problem-solving skills",
      "Excellent communication and interpersonal skills"
    ],
    responsibilities: [
      "Define and prioritize product requirements",
      "Work closely with engineering, design, and marketing teams",
      "Conduct market research and competitive analysis",
      "Track and analyze product performance"
    ],
    benefits: [
      "Competitive salary: $130K - $160K",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Stock options",
      "Professional development budget"
    ]
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudScale Solutions",
    companyId: "cloudscale-solutions",
    companyLogo: "/placeholder.svg",
    location: "Remote",
    salary: "$110K - $140K",
    postedDate: "1 week ago",
    description: "Seeking a DevOps professional to help us optimize our cloud infrastructure and deployment pipelines.",
    requirements: [
      "3+ years of experience in DevOps",
      "Experience with cloud platforms (AWS, Azure, GCP)",
      "Strong understanding of CI/CD pipelines",
      "Experience with containerization technologies (Docker, Kubernetes)"
    ],
    responsibilities: [
      "Design and implement cloud infrastructure",
      "Automate deployment processes",
      "Monitor system performance and troubleshoot issues",
      "Collaborate with development and operations teams"
    ],
    benefits: [
      "Competitive salary: $110K - $140K",
      "Remote work with flexible hours",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Home office stipend"
    ]
  },
  {
    id: "4",
    title: "UX/UI Designer",
    company: "DesignHub",
    companyId: "design-hub",
    companyLogo: "/placeholder.svg",
    location: "Boston, MA (Hybrid)",
    salary: "$90K - $120K",
    postedDate: "5 days ago",
    description: "Looking for a talented UX/UI Designer to create beautiful and functional interfaces for our clients.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools (Figma, Sketch, Adobe XD)",
      "Strong understanding of user-centered design principles",
      "Experience with responsive design and mobile-first design"
    ],
    responsibilities: [
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and mockups",
      "Design intuitive and engaging user interfaces",
      "Collaborate with developers to implement designs"
    ],
    benefits: [
      "Competitive salary: $90K - $120K",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Professional development budget"
    ]
  },
  {
    id: "5",
    title: "Full Stack Developer",
    company: "WebSphere",
    companyId: "web-sphere",
    companyLogo: "/placeholder.svg",
    location: "Austin, TX",
    salary: "$100K - $130K",
    postedDate: "1 day ago",
    description: "Join our engineering team to build scalable web applications using modern technologies.",
    requirements: [
      "3+ years of experience in full stack development",
      "Proficiency with JavaScript, React, Node.js",
      "Experience with relational databases (PostgreSQL, MySQL)",
      "Strong understanding of RESTful APIs"
    ],
    responsibilities: [
      "Develop and maintain web applications",
      "Write clean, efficient, and well-documented code",
      "Participate in code reviews",
      "Collaborate with other developers and designers"
    ],
    benefits: [
      "Competitive salary: $100K - $130K",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Stock options",
      "Free snacks and drinks"
    ]
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "DataInsights",
    companyId: "data-insights",
    companyLogo: "/placeholder.svg",
    location: "Remote",
    salary: "$115K - $145K",
    postedDate: "4 days ago",
    description: "We're seeking a data scientist to help us extract meaningful insights from complex datasets.",
    requirements: [
      "3+ years of experience in data science",
      "Proficiency with Python, R, SQL",
      "Experience with machine learning algorithms",
      "Strong analytical and problem-solving skills"
    ],
    responsibilities: [
      "Collect, clean, and analyze data",
      "Develop and implement machine learning models",
      "Communicate findings to stakeholders",
      "Stay up-to-date with the latest trends in data science"
    ],
    benefits: [
      "Competitive salary: $115K - $145K",
      "Remote work with flexible hours",
      "Comprehensive health insurance",
      "401(k) with company match",
      "Unlimited PTO",
      "Professional development budget"
    ]
  },
];

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

      
  // Find the job from the mock data
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Job Not Found</h1>
            <p className="mt-4 text-muted-foreground">The job listing you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6" href="/jobs">
              Back to Jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApply = () => {
    setIsApplying(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the employer.",
      });
    }, 1500);
  };

  const handleSaveJob = () => {
    toast({
      title: "Job Saved",
      description: "This job has been saved to your profile.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" className="mb-4" href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <img 
                          src={job.companyLogo} 
                          alt={`${job.company} logo`}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        <Link 
                          to={`/company/${job.companyId}`} 
                          className="text-primary hover:underline flex items-center"
                        >
                          <Building className="mr-1 h-4 w-4" />
                          {job.company}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-border flex flex-wrap gap-3">
                  <Button onClick={handleApply} isLoading={isApplying}>
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                  <Button variant="outline" onClick={handleSaveJob}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Job Details Tabs */}
              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="description">
                    <TabsList className="mb-6">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="space-y-4">
                      <h2 className="text-xl font-semibold">Job Description</h2>
                      <p className="text-muted-foreground">{job.description}</p>
                      
                      <h3 className="text-lg font-semibold mt-6">Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {job.responsibilities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="space-y-4">
                      <h2 className="text-xl font-semibold">Requirements</h2>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {job.requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="benefits" className="space-y-4">
                      <h2 className="text-xl font-semibold">Benefits & Perks</h2>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {job.benefits.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Card */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About the Company</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 mr-3 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={job.companyLogo} 
                        alt={`${job.company} logo`}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{job.company}</h3>
                      <Link to={`/company/${job.companyId}`} className="text-sm text-primary hover:underline">
                        View Company Profile
                      </Link>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    TechCorp Inc is a leading technology company specializing in cloud services and enterprise solutions.
                    With offices around the globe, we're dedicated to innovation and excellence.
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" href={`/company/${job.companyId}`}>
                    See All Jobs at {job.company}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Similar Jobs Card */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Similar Jobs</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobs.slice(1, 4).map((similarJob) => (
                    <div key={similarJob.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
                      <Link to={`/job/${similarJob.id}`} className="hover:text-primary font-medium">
                        {similarJob.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">{similarJob.company}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {similarJob.location}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="link" className="w-full" href="/jobs">
                    View All Jobs
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

export default JobDetails;
