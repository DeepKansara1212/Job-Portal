import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sliders } from "lucide-react";
import Button from "@/components/shared/Button";
import { motion } from 'framer-motion';

const JobSearch = ({ 
  showFiltersOnMobile, 
  toggleFilters,
  onSearch,
  initialQuery = ""
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/jobs?search=${query}`);
    }
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Find Your Dream Job</h1>
      
      <div className="relative">
        <form 
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="w-full h-12 pl-10 pr-4 border border-border rounded-md focus:ring-1 focus:ring-primary-dark focus:border-primary-dark focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="h-12 min-w-[120px]">
              Search Jobs
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="h-12 md:hidden px-3"
              onClick={toggleFilters}
            >
              <Sliders className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      <div className="flex gap-2 mt-4 flex-wrap">
        <Button variant="ghost" size="sm" className="text-xs">
          Remote Jobs
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          Tech Jobs
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          Marketing
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          Design
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          Full-time
        </Button>
      </div>
    </motion.div>
  );
};

export default JobSearch;
