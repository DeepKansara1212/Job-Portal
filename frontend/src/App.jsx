import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import Jobs from "./pages/Jobs"
import JobDetails from "./pages/JobDetails"
import Dashboard from "./pages/Dashboard"
import CandidateDashboard from "./pages/dashboards/CandidateDashboard"
import EmployerDashboard from "./pages/dashboards/EmployerDashboard"
import CompanyProfile from "./pages/CompanyProfile"
import Companies from "./pages/Companies"
import SavedJobs from "./pages/SavedJobs"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Profiles from "./pages/Profiles"
import Contact from "./pages/Contact"
import Profile from "./pages/Profile"
import AdminRoutes from "@/pages/admin/AdminRoutes"
import ProfileDescription from "./pages/ProfileDescription"
import UploadResume from "./pages/UploadResume"
import PostJob from "./pages/PostJob"
import CreateCompany from "./pages/company/CreateCompany"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<ProfileDescription />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/admin" element={<Navigate to="/admin" replace />} />

            {/* Company Routes - Important: Order matters! */}
            <Route path="/company/create" element={<CreateCompany />} />
            <Route path="/company/:id" element={<CompanyProfile />} />

            <Route path="/saved-jobs" element={<SavedJobs />} />

            {/* Authentication Routes */}
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            {/* Job Management Routes */}
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/upload-resume/:jobId" element={<UploadResume />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
    </TooltipProvider>
  </QueryClientProvider>
)

export default App

