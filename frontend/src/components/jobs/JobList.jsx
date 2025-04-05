import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/shared/Button';
import { authAPI } from '@/api/api';

const JobList = ({ jobs, isLoading, onApply }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert('Please upload your resume');
      return;
    }

    const formData = new FormData();
    formData.append('job', selectedJob.id);
    formData.append('resume', resume);

    try {
      await onApply(selectedJob.id, formData);
      setSelectedJob(null);
      setResume(null);
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <div className="job-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <motion.div 
          key={job.id} 
          className="job-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-1">{job.company}</p>
          <p className="text-gray-600 mb-1">{job.location}</p>
          <p className="text-gray-600 mb-1">{job.salary}</p>
          <p className="text-gray-600 mb-4">{job.postedDate}</p>
          {userRole !== 'admin' && (
            <Button onClick={() => handleApplyClick(job)}>Apply</Button>
          )}
        </motion.div>
      ))}

      {selectedJob && userRole !== 'admin' && (
        <div className="apply-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Upload Resume</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleResumeChange} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full mb-2">Submit Application</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setSelectedJob(null)}>Cancel</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
