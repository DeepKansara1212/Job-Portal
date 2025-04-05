
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import Button from "./Button";
import { Bookmark, Building, Clock, DollarSign, MapPin, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  postedDate,
  description,
  className,
  saved = false
}) => {
  const { toggleSaveJob, applyForJob, isJobSaved, isLoading } = useSavedJobs();
  const [isApplying, setIsApplying] = useState(false);
  const isSaved = saved || isJobSaved(id);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSaveJob({
      id,
      title,
      company,
      location,
      salary,
      postedDate,
      description
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApplying(true);
    await applyForJob(id);
    setIsApplying(false);
  };

  return (
    <Card 
      withHover 
      className={cn("overflow-hidden transition-all duration-300", className)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-1">{title}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Building className="mr-1 h-4 w-4" />
              <span>{company}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSaveToggle}
            disabled={isLoading}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={cn(
              "h-5 w-5 transition-all",
              isSaved && "fill-primary text-primary"
            )} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{location}</span>
          </div>
          {salary && (
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4" />
              <span>{salary}</span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{postedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border flex items-center justify-between">
        <Button variant="link" href={`/job/${id}`} className="p-0 h-auto">
          View Details
        </Button>
        <Button 
          size="sm"
          onClick={handleApply}
          isLoading={isApplying}
        >
          {!isApplying && <Send className="mr-2 h-4 w-4" />}
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
