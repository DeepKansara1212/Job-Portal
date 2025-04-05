
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/shared/JobCard";
import { Bookmark, Filter, Briefcase } from "lucide-react";
import Button from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useState } from "react";

const SavedJobs = () => {
  const { savedJobs } = useSavedJobs();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-2 md:mb-0">My Jobs</h1>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setView('list')}
              >
                List view
              </Button>
              <Button 
                variant={view === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setView('grid')}
              >
                Grid view
              </Button>
            </div>
          </div>
          
          {filterOpen && (
            <div className="mb-6 p-4 border rounded-lg shadow-sm md:hidden">
              <h3 className="font-medium mb-2">Filters</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="recent" className="mr-2" />
                  <label htmlFor="recent">Recently added</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="applied" className="mr-2" />
                  <label htmlFor="applied">Applied jobs</label>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar filters - LinkedIn style */}
            <div className="hidden md:block">
              <div className="sticky top-24 border rounded-lg p-4 shadow-sm">
                <h3 className="font-medium mb-4 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Date saved</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="past-24h" name="date" className="mr-2" />
                        <label htmlFor="past-24h" className="text-sm">Past 24 hours</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="past-week" name="date" className="mr-2" />
                        <label htmlFor="past-week" className="text-sm">Past week</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="past-month" name="date" className="mr-2" />
                        <label htmlFor="past-month" className="text-sm">Past month</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="any-time" name="date" className="mr-2" checked />
                        <label htmlFor="any-time" className="text-sm">Any time</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Job type</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="full-time" className="mr-2" />
                        <label htmlFor="full-time" className="text-sm">Full-time</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="part-time" className="mr-2" />
                        <label htmlFor="part-time" className="text-sm">Part-time</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="contract" className="mr-2" />
                        <label htmlFor="contract" className="text-sm">Contract</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="remote" className="mr-2" />
                        <label htmlFor="remote" className="text-sm">Remote</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className={cn(
              "col-span-3",
              savedJobs.length === 0 && "col-span-full"
            )}>
              {savedJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No saved jobs yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Jobs you save will appear here. Start browsing and click the bookmark icon on jobs you're interested in.
                  </p>
                  <Button href="/jobs">Browse Jobs</Button>
                </div>
              ) : (
                <div className={cn(
                  view === 'list' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"
                )}>
                  {savedJobs.map((job, index) => (
                    <JobCard
                      key={job.id}
                      {...job}
                      className={cn(
                        "animate-fade-in",
                        `delay-${Math.min(index * 100, 500)}`
                      )}
                      saved={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedJobs;
