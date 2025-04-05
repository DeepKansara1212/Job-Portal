import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
console.log("API URL:", API_URL)

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    console.log("Request Config:", config)
    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response)
    return response
  },
  (error) => {
    console.error("Response Error:", error)

    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear auth data if token is expired or invalid
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signin") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/users/login", { email, password }),
  verifyCode: (email, code) => api.post("/users/verify-code", { email, code }),
  register: (userData) => api.post("/users/register", userData),
  getProfile: () => api.get("/users/profile"),
  getProfileById: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (userData) => api.put("/users/profile", userData),
}

// Jobs API
export const jobsAPI = {
  getAllJobs: (filters = {}) => api.get("/jobs", { params: filters }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post("/jobs", jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  closeJob: (id) => api.put(`/jobs/${id}/close`),
}

// Applications API
export const applicationsAPI = {
  applyForJob: (formData) =>
    api.post("/applications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getMyApplications: () => api.get("/applications/me"),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateApplicationStatus: (id, data) => api.put(`/applications/${id}`, data),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  getResume: (filename) => api.get(`/applications/resume/${filename}`, { responseType: "blob" }),
}

// Companies API
export const companiesAPI = {
  getAllCompanies: (filters = {}) => api.get("/companies", { params: filters }),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  createCompany: (formData) => api.post("/companies", formData),
  updateCompany: (id, formData) => api.put(`/companies/${id}`, formData),
}

// Admin API
export const adminAPI = {
  // User management
  getAllUsers: (filters = {}) => api.get("/admin/users", { params: filters }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Job management
  getAllJobs: (filters = {}) => api.get("/admin/jobs", { params: filters }),
  approveJob: (id) => api.put(`/admin/jobs/${id}/approve`),
  rejectJob: (id, reason) => api.put(`/admin/jobs/${id}/reject`, { reason }),

  // Company management
  getAllCompanies: (filters = {}) => api.get("/admin/companies", { params: filters }),
  approveCompany: (id) => api.put(`/admin/companies/${id}/approve`),
  rejectCompany: (id, reason) => api.put(`/admin/companies/${id}/reject`, { reason }),

  // Dashboard data
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getRecentActivity: () => api.get("/admin/dashboard/activity"),
}

// Candidates API (for employers and admins)
export const candidatesAPI = {
  searchCandidates: (filters = {}) => api.get("/candidates", { params: filters }),
  getCandidateById: (id) => api.get(`/candidates/${id}`),
  getShortlistedCandidates: () => api.get("/candidates/shortlisted"),
  shortlistCandidate: (id) => api.post(`/candidates/${id}/shortlist`),
  removeFromShortlist: (id) => api.delete(`/candidates/${id}/shortlist`),
}

// Interview scheduling (for employers)
export const interviewsAPI = {
  scheduleInterview: (data) => api.post("/interviews", data),
  getMyInterviews: () => api.get("/interviews/me"),
  getCandidateInterviews: (candidateId) => api.get(`/interviews/candidate/${candidateId}`),
  updateInterviewStatus: (id, status) => api.put(`/interviews/${id}/status`, { status }),
  rescheduleInterview: (id, newTime) => api.put(`/interviews/${id}/reschedule`, { newTime }),
}

// Messages API
export const messagesAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (conversationId, message) => api.post(`/messages/${conversationId}`, { message }),
  startConversation: (userId, message) => api.post(`/messages/new/${userId}`, { message }),
}

export default api

