
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, Search, Star, Users } from "lucide-react";
import Button from "@/components/shared/Button";
import JobCard from "@/components/shared/JobCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/shared/Card";
import { cn } from "@/lib/utils";

// Mock featured jobs
const featuredJobs = [
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
    id: "2",
    title: "Product Manager",
    company: "InnovateSoft",
    location: "San Francisco, CA",
    salary: "$130K - $160K",
    postedDate: "3 days ago",
    description: "Join our product team to lead the development of cutting-edge SaaS solutions. Experience with agile methodologies required."
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudScale Solutions",
    location: "Remote",
    salary: "$110K - $140K",
    postedDate: "1 week ago",
    description: "Seeking a DevOps professional to help us optimize our cloud infrastructure and deployment pipelines."
  },
];

// Mock categories
const categories = [
  { name: "Technology", count: 342, icon: "💻" },
  { name: "Marketing", count: 195, icon: "📈" },
  { name: "Design", count: 157, icon: "🎨" },
  { name: "Business", count: 243, icon: "💼" },
  { name: "Customer Service", count: 112, icon: "🤝" },
  { name: "Healthcare", count: 87, icon: "🏥" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { searchQuery, location });
    // Navigate to jobs page with search query
    navigate(`/jobs?search=${searchQuery}${location ? `&location=${location}` : ''}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-secondary/70 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
              17,000+ Jobs Available
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight text-balance">
              Find Your Dream Job With <span className="text-primary">JoburFinder</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            
            {/* Search Form */}
            <form 
              onSubmit={handleSearch}
              className="mt-8 bg-white shadow-lg rounded-xl p-2 md:p-3 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto border border-border/50"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button type="submit" className="md:w-auto w-full py-3">
                Search Jobs
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground pt-2">
              Popular: Software Engineer, Marketing, Design, Project Manager
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">17,000+</div>
              <p className="text-muted-foreground">Live Jobs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">8M+</div>
              <p className="text-muted-foreground">Job Seekers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-muted-foreground">Companies</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10M+</div>
              <p className="text-muted-foreground">Connections Made</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Handpicked opportunities for you</p>
            </div>
            <Link 
              to="/jobs" 
              className="group inline-flex items-center text-primary font-medium mt-4 md:mt-0"
            >
              Browse All Jobs 
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                {...job}
                className={cn(
                  "animate-slide-in",
                  index === 0 && "delay-0",
                  index === 1 && "delay-100",
                  index === 2 && "delay-200"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse jobs by category to find the perfect opportunity in your field
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <Link 
                key={category.name} 
                to={`/jobs?category=${category.name}`}
                className={cn(
                  "animate-scale-in group",
                  index % 3 === 0 && "delay-0",
                  index % 3 === 1 && "delay-100",
                  index % 3 === 2 && "delay-200"
                )}
              >
                <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-md">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium mb-1">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.count} jobs available</p>
                    </div>
                    <div className="text-3xl">{category.icon}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Finding your dream job is easy with our simple process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 animate-fade-in delay-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up as a job seeker or employer and create your profile
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-in delay-200">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Find Jobs</h3>
              <p className="text-muted-foreground">
                Browse thousands of jobs or post new opportunities
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-in delay-400">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Get Hired</h3>
              <p className="text-muted-foreground">
                Apply, interview, and land your dream job
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto text-balance">
            Ready to take the next step in your career?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-balance">
            Join thousands of professionals who have found their dream jobs through JoburFinder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              href="/jobs"
            >
              Find Jobs
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              href="/auth/signup"
            >
              For Employers
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
