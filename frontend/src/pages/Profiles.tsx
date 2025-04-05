
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { Search, Filter, Users } from "lucide-react";

// Sample profiles data
const profilesData = [
  {
    id: 1,
    name: "John Smith",
    title: "Senior Frontend Developer",
    location: "New York, NY",
    skills: ["React", "TypeScript", "Node.js", "CSS"],
    experience: "7 years",
    education: "M.S. Computer Science, NYU",
    avatar: "https://placehold.co/200x200?text=JS",
  },
  {
    id: 2,
    name: "Emily Johnson",
    title: "UX/UI Designer",
    location: "San Francisco, CA",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    experience: "5 years",
    education: "B.A. Design, Stanford University",
    avatar: "https://placehold.co/200x200?text=EJ",
  },
  {
    id: 3,
    name: "Michael Wong",
    title: "Full Stack Developer",
    location: "Austin, TX",
    skills: ["JavaScript", "Python", "React", "Django"],
    experience: "4 years",
    education: "B.S. Computer Engineering, UT Austin",
    avatar: "https://placehold.co/200x200?text=MW",
  },
  {
    id: 4,
    name: "Sarah Davis",
    title: "Product Manager",
    location: "Boston, MA",
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Stories"],
    experience: "6 years",
    education: "MBA, Harvard Business School",
    avatar: "https://placehold.co/200x200?text=SD",
  },
  {
    id: 5,
    name: "David Kim",
    title: "DevOps Engineer",
    location: "Seattle, WA",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    experience: "5 years",
    education: "B.S. Information Systems, University of Washington",
    avatar: "https://placehold.co/200x200?text=DK",
  },
  {
    id: 6,
    name: "Lisa Chen",
    title: "Data Scientist",
    location: "Chicago, IL",
    skills: ["Python", "R", "Machine Learning", "SQL"],
    experience: "3 years",
    education: "Ph.D. Statistics, University of Chicago",
    avatar: "https://placehold.co/200x200?text=LC",
  },
];

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter profiles based on search term
  const filteredProfiles = profilesData.filter(profile => {
    return (
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleViewProfile = (profileId) => {
    // Fix profile navigation by using the correct path
    console.log(`Navigating to profile ID: ${profileId}`);
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            {/* Page header */}
            <div className="flex flex-col space-y-3">
              <h1 className="text-3xl font-bold">Talent Profiles</h1>
              <p className="text-muted-foreground">
                Browse and connect with top talent in your industry
              </p>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, title, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <Card key={profile.id} withHover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border border-border flex items-center justify-center bg-background">
                        <img 
                          src={profile.avatar} 
                          alt={`${profile.name} avatar`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-xl">{profile.name}</h3>
                        <p className="text-primary">{profile.title}</p>
                        <p className="text-muted-foreground text-sm">{profile.location}</p>
                      </div>
                      <div>
                        <p className="text-sm mb-1"><strong>Experience:</strong> {profile.experience}</p>
                        <p className="text-sm"><strong>Education:</strong> {profile.education}</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {profile.skills.map((skill, index) => (
                          <span key={index} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleViewProfile(profile.id)}
                      >
                        View Profile
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

export default Profiles;
