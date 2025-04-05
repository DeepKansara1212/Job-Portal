import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/shared/Button';
import { jobsAPI } from '@/api/api';

const JobFilters = ({ showOnMobile, toggleFilters, onApplyFilters, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [jobTitles, setJobTitles] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchJobTitlesAndLocations = async () => {
      try {
        const response = await jobsAPI.getAllJobs();
        const jobs = response.data;

        const titles = [...new Set(jobs.map(job => job.title))];
        const locs = [...new Set(jobs.map(job => job.location))];

        setJobTitles(titles);
        setLocations(locs);
      } catch (error) {
        console.error('Error fetching job titles and locations:', error);
      }
    };

    fetchJobTitlesAndLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSalaryRangeChange = (e) => {
    const { value } = e.target;
    setFilters({
      ...filters,
      salaryRange: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <motion.div 
      className={`job-filters bg-white p-6 rounded-lg shadow-md ${showOnMobile ? 'block' : 'hidden'} md:block`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Job Title</label>
        <select
          name="title"
          className="w-full px-3 py-2 border rounded-md"
          value={filters.title || ''}
          onChange={handleChange}
        >
          <option value="">Select Job Title</option>
          {jobTitles.map((title, index) => (
            <option key={index} value={title}>{title}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Location</label>
        <select
          name="location"
          className="w-full px-3 py-2 border rounded-md"
          value={filters.location || ''}
          onChange={handleChange}
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Experience Level</label>
        <select
          name="experienceLevel"
          className="w-full px-3 py-2 border rounded-md"
          value={filters.experienceLevel || ''}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior Level">Senior Level</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Employment Type</label>
        <select
          name="employmentType"
          className="w-full px-3 py-2 border rounded-md"
          value={filters.employmentType || ''}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </select>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Salary Range</label>
        <div className="flex flex-col gap-2">
          <label>
            <input
              type="radio"
              name="salaryRange"
              value="0-50000"
              checked={filters.salaryRange === '0-50000'}
              onChange={handleSalaryRangeChange}
            />
            <span className="ml-2">0 - 50,000</span>
          </label>
          <label>
            <input
              type="radio"
              name="salaryRange"
              value="50000-100000"
              checked={filters.salaryRange === '50000-100000'}
              onChange={handleSalaryRangeChange}
            />
            <span className="ml-2">50,000 - 100,000</span>
          </label>
          <label>
            <input
              type="radio"
              name="salaryRange"
              value="100000-150000"
              checked={filters.salaryRange === '100000-150000'}
              onChange={handleSalaryRangeChange}
            />
            <span className="ml-2">100,000 - 150,000</span>
          </label>
          <label>
            <input
              type="radio"
              name="salaryRange"
              value="150000-200000"
              checked={filters.salaryRange === '150000-200000'}
              onChange={handleSalaryRangeChange}
            />
            <span className="ml-2">150,000 - 200,000</span>
          </label>
          <label>
            <input
              type="radio"
              name="salaryRange"
              value="200000+"
              checked={filters.salaryRange === '200000+'}
              onChange={handleSalaryRangeChange}
            />
            <span className="ml-2">200,000+</span>
          </label>
        </div>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Remote</label>
        <input
          type="checkbox"
          name="isRemote"
          className="mr-2"
          checked={filters.isRemote || false}
          onChange={handleChange}
        />
        <span>Remote</span>
      </div>
      <div className="filter-group mb-4">
        <label className="block text-gray-700 mb-2">Skills</label>
        <input
          type="text"
          name="skills"
          className="w-full px-3 py-2 border rounded-md"
          value={filters.skills || ''}
          onChange={handleChange}
        />
      </div>
      <Button onClick={handleApplyFilters} className="w-full mb-2">Apply Filters</Button>
      <Button onClick={toggleFilters} variant="outline" className="w-full">Close</Button>
    </motion.div>
  );
};

export default JobFilters;
