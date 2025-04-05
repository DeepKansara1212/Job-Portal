
import { useState } from "react";
import { Building, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/shared/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Sample company data (this would come from an API in a real app)
const companiesData = [
  {
    id: "tech-corp",
    name: "Tech Innovations Inc",
    logo: "https://placehold.co/200x200?text=TI",
    industry: "Technology",
    location: "San Francisco, CA",
    description: "Leading tech company focused on AI and machine learning solutions.",
    employeeCount: "1,000-5,000",
    foundedYear: 2010,
    websiteUrl: "https://example.com",
    openJobs: 24,
  },
  {
    id: "finance-group",
    name: "Global Finance Group",
    logo: "https://placehold.co/200x200?text=GFG",
    industry: "Finance",
    location: "New York, NY",
    description: "International financial services company serving clients worldwide.",
    employeeCount: "10,000+",
    foundedYear: 1985,
    websiteUrl: "https://example.com",
    openJobs: 15,
  },
  {
    id: "eco-solutions",
    name: "EcoSolutions",
    logo: "https://placehold.co/200x200?text=ES",
    industry: "Environmental",
    location: "Portland, OR",
    description: "Developing sustainable solutions for a greener future.",
    employeeCount: "100-500",
    foundedYear: 2015,
    websiteUrl: "https://example.com",
    openJobs: 8,
  },
  {
    id: "health-innovations",
    name: "Health Innovations",
    logo: "https://placehold.co/200x200?text=HI",
    industry: "Healthcare",
    location: "Boston, MA",
    description: "Revolutionizing healthcare with cutting-edge technology and research.",
    employeeCount: "1,000-5,000",
    foundedYear: 2005,
    websiteUrl: "https://example.com",
    openJobs: 18,
  },
  {
    id: "creative-media",
    name: "Creative Media Group",
    logo: "https://placehold.co/200x200?text=CMG",
    industry: "Media & Entertainment",
    location: "Los Angeles, CA",
    description: "Creating engaging content across various platforms globally.",
    employeeCount: "500-1,000",
    foundedYear: 2000,
    websiteUrl: "https://example.com",
    openJobs: 12,
  },
  {
    id: "retail-solutions",
    name: "Retail Solutions Co",
    logo: "https://placehold.co/200x200?text=RSC",
    industry: "Retail",
    location: "Chicago, IL",
    description: "Providing innovative solutions for modern retail challenges.",
    employeeCount: "100-500",
    foundedYear: 2012,
    websiteUrl: "https://example.com",
    openJobs: 7,
  },
  
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const navigate = useNavigate();
  
  // Get unique industries for filtering
  const industries = ["All", ...new Set(companiesData.map(company => company.industry))];
  
  // Filter companies based on search term and industry filter
  const filteredCompanies = companiesData.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "All" || company.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  const handleViewProfile = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            {/* Page header */}
            <div className="flex flex-col space-y-3">
              <h1 className="text-3xl font-bold">Browse Companies</h1>
              <p className="text-muted-foreground">
                Discover top companies hiring now and explore their profiles and job opportunities
              </p>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search companies by name or keyword..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                <select
                  className="w-full px-4 py-2 border border-border rounded-md appearance-none bg-white"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Tabs for different views */}
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredCompanies.length} companies
                </div>
              </div>
              
              {/* Grid View */}
              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map(company => (
                    <Card key={company.id} withHover className="h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden border border-border flex items-center justify-center bg-background">
                            <img 
                              src={company.logo} 
                              alt={`${company.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-xl">{company.name}</h3>
                            <p className="text-muted-foreground text-sm">{company.industry} • {company.location}</p>
                          </div>
                          <p className="text-sm line-clamp-3">{company.description}</p>
                          <div className="text-primary text-sm font-medium">
                            {company.openJobs} open positions
                          </div>
                          <button 
                            className="w-full mt-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
                            onClick={() => handleViewProfile(company.id)}
                          >
                            View Profile
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* List View */}
              <TabsContent value="list" className="mt-6">
                <div className="flex flex-col space-y-4">
                  {filteredCompanies.map(company => (
                    <Card key={company.id} withHover>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden border border-border flex items-center justify-center bg-background">
                            <img 
                              src={company.logo} 
                              alt={`${company.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{company.name}</h3>
                            <p className="text-muted-foreground text-sm">{company.industry} • {company.location}</p>
                            <p className="text-sm line-clamp-2 mt-1">{company.description}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className="text-primary text-sm font-medium">{company.openJobs} open jobs</span>
                            <button 
                              className="px-4 py-1.5 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors text-sm"
                              onClick={() => handleViewProfile(company.id)}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Companies;
