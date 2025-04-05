
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Briefcase, 
  Building, 
  Calendar, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Globe, 
  Heart, 
  MapPin, 
  Share2, 
  Users 
} from "lucide-react";
import Button from "@/components/shared/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/shared/Card";

// Mock job data (in a real app, this would come from an API)
const jobData = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp Inc",
  logo: "/placeholder.svg",
  location: "New York, NY (Remote)",
  salary: "$120K - $150K",
  postedDate: "2 days ago",
  employmentType: "Full-time",
  experienceLevel: "Senior (5+ years)",
  description: `
    <p>TechCorp Inc is looking for a Senior Frontend Developer to join our growing team. The ideal candidate will have strong experience with modern JavaScript frameworks and a passion for creating beautiful, responsive user interfaces.</p>
    
    <h4>Responsibilities:</h4>
    <ul>
      <li>Develop new user-facing features using React.js</li>
      <li>Build reusable components and libraries for future use</li>
      <li>Translate designs and wireframes into high-quality code</li>
      <li>Optimize components for maximum performance</li>
      <li>Collaborate with back-end developers and designers</li>
    </ul>
    
    <h4>Requirements:</h4>
    <ul>
      <li>5+ years of experience with JavaScript/TypeScript</li>
      <li>3+ years of experience with React</li>
      <li>Proficiency with HTML, CSS, and responsive design</li>
      <li>Familiarity with RESTful APIs and GraphQL</li>
      <li>Experience with state management (Redux, Context API)</li>
      <li>Knowledge of modern front-end build pipelines and tools</li>
    </ul>
    
    <h4>Benefits:</h4>
    <ul>
      <li>Competitive salary and equity options</li>
      <li>Health, dental, and vision insurance</li>
      <li>Unlimited PTO policy</li>
      <li>Remote-first work environment</li>
      <li>Professional development budget</li>
      <li>Home office stipend</li>
    </ul>
  `,
  companyDescription: "TechCorp Inc is a leading software company specializing in creating innovative solutions for enterprise clients. Founded in 2010, we've grown to a team of over 200 employees across the globe.",
  companyWebsite: "https://techcorp-example.com",
  companySize: "201-500 employees",
};

const Job = () => {
  const { id } = useParams<{id: string}>();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // In a real app, you would fetch the job data based on the ID
  
  const handleSaveJob = () => {
    setIsSaved(!isSaved);
  };
  
  const handleApply = () => {
    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      // In a real app, you would redirect to an application form or show a success message
      console.log("Applied to job:", id);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Job Header */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={jobData.logo} 
                      alt={jobData.company} 
                      className="w-16 h-16 rounded-md border border-border object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{jobData.title}</h1>
                    <Link to="/company/techcorp" className="text-primary font-medium hover:underline inline-flex items-center">
                      {jobData.company}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {jobData.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {jobData.salary}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="mr-2 h-4 w-4" />
                        {jobData.employmentType}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        Posted {jobData.postedDate}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                  <Button 
                    onClick={handleApply} 
                    isLoading={isApplying}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSaveJob}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-primary" : ""}`} />
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  <Button variant="ghost">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              
              {/* Job Description */}
              <Card className="mb-6 animate-fade-in delay-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: jobData.description }}
                  />
                </CardContent>
              </Card>
              
              {/* Company Overview */}
              <Card className="animate-fade-in delay-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {jobData.company}</h2>
                  <p className="mb-4 text-muted-foreground">
                    {jobData.companyDescription}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 pt-4 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="mr-2 h-4 w-4" />
                      <a href={jobData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {jobData.companyWebsite.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {jobData.companySize}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0 space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24 animate-fade-in delay-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Apply</h3>
                  <Button 
                    className="w-full mb-3"
                    onClick={handleApply} 
                    isLoading={isApplying}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSaveJob}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-primary" : ""}`} />
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Job Overview</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Employment Type:</span>
                        <span className="font-medium">{jobData.employmentType}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Experience Level:</span>
                        <span className="font-medium">{jobData.experienceLevel}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{jobData.location}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Salary:</span>
                        <span className="font-medium">{jobData.salary}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Posted:</span>
                        <span className="font-medium">{jobData.postedDate}</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Similar Jobs */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-fade-in delay-400">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="font-medium">
                          <Link to={`/job/${i + 2}`} className="hover:text-primary">
                            {i === 0 ? "Frontend Engineer" : i === 1 ? "React Developer" : "UI Engineer"}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{jobData.company}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mb-3 space-y-1">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {jobData.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {jobData.salary}
                        </div>
                      </div>
                      <Button variant="link" className="mt-auto p-0 h-auto text-left justify-start text-primary">
                        View Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Job;
