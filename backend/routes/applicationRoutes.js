const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and DOC files are allowed'));
  }
});

// Apply for a job
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { job, fullName, email, phone, address } = req.body;
    
    // Check if job exists
    const jobDoc = await Job.findById(job);
    if (!jobDoc) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const newApplication = new Application({
      job,
      applicant: req.user.id,
      resume: req.file.path,
      personalInfo: {
        fullName,
        email,
        phone,
        address
      }
    });
    
    const application = await newApplication.save();
    
    res.status(201).json(application);
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for a job (employer only)
router.get('/job/:jobId', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is job owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'fullName email phone location')
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications by a user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location salary employmentType',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (employer only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is job owner or admin
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    // Update status
    application.status = status;
    
    // Add note if provided
    if (note) {
      application.notes.push({
        text: note,
        createdBy: req.user.id
      });
    }
    
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve resume files
router.get('/resume/:filename', authMiddleware, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'resumes', req.params.filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
