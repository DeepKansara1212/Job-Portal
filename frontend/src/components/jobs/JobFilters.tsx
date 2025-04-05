import { useState, useEffect } from "react";
import { Sliders } from "lucide-react";
import Button from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { cn } from "@/lib/utils";

interface JobFiltersProps {
  showOnMobile: boolean;
  toggleFilters: () => void;
  onApplyFilters: (filters: any) => void;
  initialFilters?: any;
}

// Filter options
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];
const salaryRanges = [
  { label: "$0 - $50K", min: 0, max: 50000 },
  { label: "$50K - $100K", min: 50000, max: 100000 },
  { label: "$100K - $150K", min: 100000, max: 150000 },
  { label: "$150K+", min: 150000, max: null }
];

const JobFilters = ({ showOnMobile, toggleFilters, onApplyFilters, initialFilters = {} }: JobFiltersProps) => {
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState<boolean | null>(null);
  const [skills, setSkills] = useState("");

  // Initialize filters from URL params
  useEffect(() => {
    if (initialFilters) {
      // Set experience levels
      if (initialFilters.experienceLevel) {
        setSelectedExperience(Array.isArray(initialFilters.experienceLevel) 
          ? initialFilters.experienceLevel 
          : [initialFilters.experienceLevel]);
      }
      
      // Set job types
      if (initialFilters.employmentType) {
        setSelectedJobTypes(Array.isArray(initialFilters.employmentType) 
          ? initialFilters.employmentType 
          : [initialFilters.employmentType]);
      }
      
      // Set location
      if (initialFilters.location) {
        setLocation(initialFilters.location);
      }
      
      // Set remote option
      if (initialFilters.isRemote !== undefined) {
        setIsRemote(initialFilters.isRemote);
      }
      
      // Set skills
      if (initialFilters.skills) {
        setSkills(Array.isArray(initialFilters.skills) 
          ? initialFilters.skills.join(', ') 
          : initialFilters.skills);
      }
      
      // Set salary ranges
      if (initialFilters.salaryMin || initialFilters.salaryMax) {
        const ranges: string[] = [];
        salaryRanges.forEach(range => {
          const matchesMin = initialFilters.salaryMin === undefined || 
            (range.min >= initialFilters.salaryMin);
          const matchesMax = initialFilters.salaryMax === undefined || 
            (range.max === null || range.max <= initialFilters.salaryMax);
          
          if (matchesMin && matchesMax) {
            ranges.push(range.label);
          }
        });
        setSelectedSalaryRanges(ranges);
      }
    }
  }, [initialFilters]);

  const toggleExperience = (level: string) => {
    setSelectedExperience(prev => 
      prev.includes(level) 
        ? prev.filter(item => item !== level) 
        : [...prev, level]
    );
  };

  const toggleJobType = (type: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(item => item !== type) 
        : [...prev, type]
    );
  };

  const toggleSalaryRange = (range: string) => {
    setSelectedSalaryRanges(prev => 
      prev.includes(range) 
        ? prev.filter(item => item !== range) 
        : [...prev, range]
    );
  };

  const handleApplyFilters = () => {
    // Calculate salary range
    let salaryMin = null;
    let salaryMax = null;
    
    if (selectedSalaryRanges.length > 0) {
      // Find min and max values from selected ranges
      selectedSalaryRanges.forEach(rangeLabel => {
        const range = salaryRanges.find(r => r.label === rangeLabel);
        if (range) {
          if (salaryMin === null || range.min < salaryMin) {
            salaryMin = range.min;
          }
          // For the case of "$150K+", max is null
          if (range.max !== null && (salaryMax === null || range.max > salaryMax)) {
            salaryMax = range.max;
          }
        }
      });
    }
    
    // Build the filters object
    const filters = {
      experienceLevel: selectedExperience.length > 0 ? selectedExperience : undefined,
      employmentType: selectedJobTypes.length > 0 ? selectedJobTypes : undefined,
      salaryMin: salaryMin !== null ? salaryMin : undefined,
      salaryMax: salaryMax !== null ? salaryMax : undefined,
      location: location.trim() || undefined,
      isRemote: isRemote !== null ? isRemote : undefined,
      skills: skills.trim() ? skills.split(',').map(s => s.trim()) : undefined
    };
    
    // Pass filters up to parent component
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setSelectedExperience([]);
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
    setLocation("");
    setIsRemote(null);
    setSkills("");
    
    // Apply reset filters immediately
    onApplyFilters({});
  };

  return (
    <aside 
      className={cn(
        "w-full md:w-64 flex-shrink-0 transition-all duration-300",
        showOnMobile ? "block" : "hidden md:block"
      )}
    >
      <Card className="p-4 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center">
            <Sliders className="h-4 w-4 mr-2" /> 
            Filters
          </h2>
          <Button 
            variant="ghost" 
            className="h-8 text-xs md:hidden"
            onClick={toggleFilters}
          >
            Close
          </Button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <input
            type="text"
            className="w-full p-2 rounded-md border border-border"
            placeholder="City, State, or Zip"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isRemote === true}
                onChange={() => setIsRemote(isRemote === true ? null : true)}
              />
              <span className="ml-2 text-sm">Remote Only</span>
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedExperience.includes(level)}
                  onChange={() => toggleExperience(level)}
                />
                <span className="ml-2 text-sm">{level}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedJobTypes.includes(type)}
                  onChange={() => toggleJobType(type)}
                />
                <span className="ml-2 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Salary Range</h3>
          <div className="space-y-2">
            {salaryRanges.map(range => (
              <label key={range.label} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedSalaryRanges.includes(range.label)}
                  onChange={() => toggleSalaryRange(range.label)}
                />
                <span className="ml-2 text-sm">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Skills</h3>
          <input
            type="text"
            className="w-full p-2 rounded-md border border-border"
            placeholder="e.g. React, Node.js, Python"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full mb-2"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-sm h-8"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </Card>
    </aside>
  );
};

export default JobFilters;
