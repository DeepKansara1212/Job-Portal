
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Building, Globe, MapPin, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import JobCard from "@/components/shared/JobCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock company data
const companies = [
  {
    id: "tech-corp",
    name: "TechCorp Inc",
    logo: "/placeholder.svg",
    industry: "Information Technology & Services",
    website: "https://techcorp-example.com",
    headquarters: "New York, NY",
    founded: "2010",
    companySize: "1,001-5,000 employees",
    about: "TechCorp Inc is a leading technology company specializing in cloud services, enterprise solutions, and digital transformation. With a focus on innovation and customer success, we help businesses of all sizes leverage technology to drive growth and efficiency.",
    specialties: [
      "Cloud Computing",
      "Enterprise Software",
      "Digital Transformation",
      "AI & Machine Learning",
      "DevOps"
    ],
    culture: "At TechCorp, we foster a culture of innovation, collaboration, and continuous learning. We believe in work-life balance and provide flexible working arrangements to our employees. Our diverse team comes from various backgrounds, bringing unique perspectives to solve complex problems."
  }
];

// Mock jobs for the company
const companyJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    location: "New York, NY (Remote)",
    salary: "$120K - $150K",
    postedDate: "2 days ago",
    description: "We're looking for an experienced Frontend Developer proficient with React, TypeScript, and modern CSS frameworks like Tailwind."
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "TechCorp Inc",
    location: "New York, NY (Remote)",
    salary: "$110K - $140K",
    postedDate: "3 days ago",
    description: "Seeking a skilled Backend Developer to help build scalable and secure APIs using Node.js and Express."
  },
  {
    id: "8",
    title: "DevOps Engineer",
    company: "TechCorp Inc",
    location: "New York, NY (Hybrid)",
    salary: "$115K - $145K",
    postedDate: "1 week ago",
    description: "Join our team to help streamline our cloud infrastructure and CI/CD pipelines."
  }
];

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useState(false);
  
  // Find the company from the mock data
  const company = companies.find(c => c.id === id);
  
  if (!company) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Company Not Found</h1>
            <p className="mt-4 text-muted-foreground">The company you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6" href="/jobs">
              Browse Jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Company Header */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-24 h-24 rounded-lg bg-background flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground">{company.industry}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {company.headquarters}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {company.companySize}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="mr-1 h-4 w-4" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Company Website
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex">
                <Button 
                  onClick={toggleFollow}
                  variant={following ? "default" : "outline"}
                  className="mr-2"
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">Share</Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Website</div>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      {company.website.replace("https://", "")}
                    </a>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Industry</div>
                    <div>{company.industry}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Company size</div>
                    <div>{company.companySize}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Headquarters</div>
                    <div>{company.headquarters}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Founded</div>
                    <div>{company.founded}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Specialties</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {company.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Similar Companies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["CloudScale Solutions", "InnovateSoft", "WebSphere"].map((name, index) => (
                    <div key={index} className="flex items-center border-b border-border last:border-0 pb-3 last:pb-0">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mr-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">Technology, Software</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="about" className="w-full">
                    <div className="border-b border-border">
                      <div className="px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="about">About</TabsTrigger>
                          <TabsTrigger value="jobs">Jobs</TabsTrigger>
                          <TabsTrigger value="people">People</TabsTrigger>
                        </TabsList>
                      </div>
                    </div>
                    
                    {/* About Tab */}
                    <TabsContent value="about" className="p-6">
                      <h2 className="text-xl font-semibold mb-4">About {company.name}</h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {company.about}
                      </p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">Company Culture</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {company.culture}
                      </p>
                    </TabsContent>
                    
                    {/* Jobs Tab */}
                    <TabsContent value="jobs" className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Open Positions</h2>
                        <span className="text-muted-foreground">{companyJobs.length} jobs available</span>
                      </div>
                      
                      <div className="space-y-4">
                        {companyJobs.map(job => (
                          <JobCard key={job.id} {...job} />
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* People Tab */}
                    <TabsContent value="people" className="p-6">
                      <h2 className="text-xl font-semibold mb-6">People at {company.name}</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: "Sarah Johnson", title: "CEO & Co-founder" },
                          { name: "Michael Chen", title: "CTO" },
                          { name: "Emily Rodriguez", title: "Head of Product" },
                          { name: "David Kim", title: "VP of Engineering" }
                        ].map((person, index) => (
                          <Card key={index} className="p-4 flex items-center" withHover>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-4">
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{person.name}</div>
                              <div className="text-sm text-muted-foreground">{person.title}</div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile;
