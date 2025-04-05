
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('savedJobs');
    if (storedJobs) {
      try {
        setSavedJobs(JSON.parse(storedJobs));
      } catch (error) {
        console.error('Failed to parse saved jobs:', error);
      }
    }
  }, []);
  
  // Update localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);
  
  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job.id === jobId);
  };
  
  const saveJob = async (job) => {
    if (!isJobSaved(job.id)) {
      setIsLoading(true);
      try {
        // Simulate API delay like LinkedIn would have
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavedJobs(prev => [...prev, job]);
        toast({
          title: "Job saved",
          description: `"${job.title}" has been added to your saved items.`,
        });
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('Error saving job:', error);
        toast({
          title: "Failed to save job",
          description: "Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    }
    return false;
  };
  
  const unsaveJob = async (jobId) => {
    const job = savedJobs.find(job => job.id === jobId);
    if (job) {
      setIsLoading(true);
      try {
        // Simulate API delay like LinkedIn would have
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        toast({
          title: "Job removed",
          description: `"${job.title}" has been removed from your saved items.`,
        });
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('Error removing job:', error);
        toast({
          title: "Failed to remove job",
          description: "Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    }
    return false;
  };
  
  const toggleSaveJob = async (job) => {
    if (isLoading) return false;
    
    if (isJobSaved(job.id)) {
      return await unsaveJob(job.id);
    } else {
      return await saveJob(job);
    }
  };
  
  const applyForJob = async (jobId) => {
    setIsLoading(true);
    try {
      // Simulate API delay like LinkedIn would have
      await new Promise(resolve => setTimeout(resolve, 800));
      toast({
        title: "Application submitted",
        description: "Your application has been sent to the employer.",
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Application failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };
  
  return {
    savedJobs,
    isJobSaved,
    saveJob,
    unsaveJob,
    toggleSaveJob,
    applyForJob,
    isLoading
  };
};
