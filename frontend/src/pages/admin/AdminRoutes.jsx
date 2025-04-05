
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import AdminSettings from "./AdminSettings";
import Users from "./Users";
import Companies from "./Companies";
import Reports from "./Reports";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated and is an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth/signin" replace />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<div>User Details Page</div>} />
      <Route path="/users/:id/edit" element={<div>Edit User Page</div>} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<div>Company Details Page</div>} />
      <Route path="/companies/:id/review" element={<div>Company Review Page</div>} />
      <Route path="/companies/:id/reject" element={<div>Company Rejection Page</div>} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/:id/investigate" element={<div>Report Investigation Page</div>} />
      <Route path="/reports/:id/dismiss" element={<div>Report Dismissal Page</div>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
