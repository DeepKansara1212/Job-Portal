
import { useState, useEffect } from "react";
import JobCard from "@/components/shared/JobCard";
import Button from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSavedJobs, SavedJob } from "@/hooks/useSavedJobs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  postedDate: string;
  description: string;
}

export interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
}

const JobList = ({ jobs: initialJobs, isLoading = false }: JobListProps) => {
  const [sortBy, setSortBy] = useState("relevant");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    // Update jobs when initialJobs changes
    setJobs(initialJobs);
    // Reset to first page when job list changes
    setCurrentPage(1);
  }, [initialJobs]);
  
  // Handle sorting jobs when sortBy changes
  useEffect(() => {
    if (!initialJobs.length) return;
    
    let sortedJobs = [...initialJobs];
    
    switch (sortBy) {
      case "newest":
        // Sort by posted date (newest first)
        sortedJobs = sortedJobs.sort((a, b) => {
          // For simplicity, just compare the strings
          return a.postedDate.localeCompare(b.postedDate);
        });
        break;
      case "salary-high":
        // Sort by salary (high to low)
        sortedJobs = sortedJobs.sort((a, b) => {
          const salaryA = a.salary ? parseInt(a.salary.replace(/\D/g, '')) : 0;
          const salaryB = b.salary ? parseInt(b.salary.replace(/\D/g, '')) : 0;
          return salaryB - salaryA;
        });
        break;
      case "salary-low":
        // Sort by salary (low to high)
        sortedJobs = sortedJobs.sort((a, b) => {
          const salaryA = a.salary ? parseInt(a.salary.replace(/\D/g, '')) : 0;
          const salaryB = b.salary ? parseInt(b.salary.replace(/\D/g, '')) : 0;
          return salaryA - salaryB;
        });
        break;
      default:
        // "relevant" - use original order
        break;
    }
    
    setJobs(sortedJobs);
  }, [sortBy, initialJobs]);
  
  // Update displayed jobs and pagination whenever jobs or current page changes
  useEffect(() => {
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(jobs.length / itemsPerPage);
    setTotalPages(calculatedTotalPages || 1); // Ensure at least 1 page
    
    // Get current jobs for display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);
    
    setDisplayedJobs(currentItems);
  }, [jobs, currentPage, itemsPerPage]);
  
  const handleSaveJob = (job: Job) => {
    toggleSaveJob(job as SavedJob);
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Scroll to top of job list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always include first page
    pageNumbers.push(1);
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    // Always include last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          Showing <span className="font-medium">{jobs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, jobs.length)}</span> of <span className="font-medium">{jobs.length}</span> jobs
        </p>
        <div className="flex items-center">
          <span className="text-sm mr-2">Sort by:</span>
          <select 
            className="text-sm border rounded-md p-1.5"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      ) : displayedJobs.length > 0 ? (
        <div className="space-y-4">
          {displayedJobs.map((job, index) => (
            <JobCard
              key={job.id}
              {...job}
              className={cn(
                "animate-fade-in",
                `delay-${Math.min(index * 100, 500)}`
              )}
              saved={isJobSaved(job.id)}
              actionButton={
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveJob(job);
                  }}
                  className="text-muted-foreground hover:text-primary"
                  aria-label={isJobSaved(job.id) ? "Unsave job" : "Save job"}
                >
                  <Bookmark className={cn(
                    "h-5 w-5",
                    isJobSaved(job.id) && "fill-primary text-primary"
                  )} />
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No jobs found matching your criteria. Try different filters.</p>
        </div>
      )}
      
      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(Number(page))}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default JobList;
