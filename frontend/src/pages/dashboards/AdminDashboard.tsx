import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building, 
  ChevronRight, 
  ClipboardList, 
  Clock, 
  FileText, 
  Plus, 
  Settings, 
  User,
  Users,
  Shield,
  AlertTriangle,
  BarChart4,
  Globe,
  Database,
  Activity
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  
  // Admin navigation handlers - updated to use direct navigation without toasts
  const handleAdminSettings = () => {
    navigate("/admin/settings");
  };
  
  const handleUserManagement = () => {
    navigate("/admin/users");
  };
  
  const handleCompanyApproval = () => {
    navigate("/admin/companies");
  };
  
  const handleSystemSettings = () => {
    navigate("/admin/settings");
  };
  
  const handleContentManagement = () => {
    navigate("/admin/settings");
  };
  
  const handleAnalyticsDashboard = () => {
    navigate("/admin/reports");
  };
  
  const handleViewAllUsers = () => {
    navigate("/admin/users");
  };
  
  const handleViewAllCompanies = () => {
    navigate("/admin/companies");
  };
  
  const handleViewAllReports = () => {
    navigate("/admin/reports");
  };
  
  const handleViewUser = (userId: number) => {
    navigate(`/admin/users/${userId}`);
  };
  
  const handleEditUser = (userId: number) => {
    navigate(`/admin/users/${userId}/edit`);
  };
  
  const handleViewCompany = (companyId: number) => {
    navigate(`/admin/companies/${companyId}`);
  };
  
  const handleReviewCompany = (companyId: number) => {
    navigate(`/admin/companies/${companyId}/review`);
  };
  
  const handleRejectCompany = (companyId: number) => {
    navigate(`/admin/companies/${companyId}/reject`);
  };
  
  const handleInvestigateReport = (reportId: number) => {
    navigate(`/admin/reports/${reportId}/investigate`);
  };
  
  const handleDismissReport = (reportId: number) => {
    navigate(`/admin/reports/${reportId}/dismiss`);
  };
  
  const handleDetailedAnalytics = () => {
    navigate("/admin/reports");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Platform overview and management
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="destructive" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                System Alerts (3)
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">2,543</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Building className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">187</div>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Briefcase className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Activity className="h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">12.4k</div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </CardContent>
            </Card>
          </div> */}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar - Admin Controls */}
            <div className="md:col-span-1 space-y-6">
              {/* Admin Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Admin Profile</CardTitle>
                  <CardDescription>System administrator</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 mr-4 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Admin User</h3>
                      <p className="text-sm text-muted-foreground">System Administrator</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" onClick={handleAdminSettings}>
                    Admin Settings
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Quick Admin Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Admin Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" size="sm" onClick={handleUserManagement}>
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleCompanyApproval}>
                    <Building className="mr-2 h-4 w-4" />
                    Company Approval
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleSystemSettings}>
                    <Database className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleContentManagement}>
                    <Globe className="mr-2 h-4 w-4" />
                    Content Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleAnalyticsDashboard}>
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Analytics Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              {/* System Health */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">System Health</CardTitle>
                  <CardDescription>Performance and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Server Load</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Database Usage</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Requests</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="pt-2 text-sm text-green-500 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    All systems operational
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* User Management Tabs */}
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="border-b border-border">
                      <div className="px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="users">Users</TabsTrigger>
                          <TabsTrigger value="companies">Companies</TabsTrigger>
                          <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>
                      </div>
                    </div>
                    
                    {/* Users Tab */}
                    <TabsContent value="users" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Recent User Registrations</h3>
                        <Button variant="ghost" size="sm" onClick={handleViewAllUsers}>
                          View All Users
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div 
                            key={i} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">User Name {i}</div>
                              <div className="text-sm text-muted-foreground">
                                {i === 1 || i === 3 ? "Job Seeker" : "Employer"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Registered {i === 1 ? "Today" : i === 2 ? "Yesterday" : i === 3 ? "3 days ago" : "1 week ago"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button size="sm" variant="outline" onClick={() => handleViewUser(i)}>View</Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(i)}>Edit</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Companies Tab */}
                    <TabsContent value="companies" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Recent Company Registrations</h3>
                        <Button variant="ghost" size="sm" onClick={handleViewAllCompanies}>
                          View All Companies
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">
                                {i === 1 ? "TechCorp Inc" : i === 2 ? "DesignHub" : "WebSphere"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {i === 1 ? "Technology" : i === 2 ? "Design" : "Web Services"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {i === 1 ? "Verified" : i === 2 ? "Pending Review" : "Pending Documents"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              {i === 1 ? (
                                <Button size="sm" variant="outline" onClick={() => handleViewCompany(i)}>
                                  View Profile
                                </Button>
                              ) : (
                                <>
                                  <Button size="sm" onClick={() => handleReviewCompany(i)}>
                                    Review
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRejectCompany(i)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Reports Tab */}
                    <TabsContent value="reports" className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Recent Reports</h3>
                        <Button variant="ghost" size="sm" onClick={handleViewAllReports}>
                          View All Reports
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="mb-2 sm:mb-0">
                              <div className="font-medium">
                                {i === 1 ? "Inappropriate Job Posting" : i === 2 ? "Suspicious Account" : "Spam Messages"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Reported by: {i === 1 ? "User ID 5892" : i === 2 ? "User ID 4721" : "System Flag"}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {i === 1 ? "High Priority" : i === 2 ? "Medium Priority" : "Low Priority"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button size="sm" onClick={() => handleInvestigateReport(i)}>Investigate</Button>
                              <Button size="sm" variant="outline" onClick={() => handleDismissReport(i)}>Dismiss</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Analytics Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Platform Analytics</CardTitle>
                  <CardDescription>Overview of key platform metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">User Growth (Last 30 Days)</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target: 500 new users</span>
                        <span>Actual: 428 new users</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">85% of monthly target</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Job Applications (Last 30 Days)</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Previous Month: 8,245</span>
                        <span>Current Month: 9,872</span>
                      </div>
                      <Progress value={120} className="h-2" />
                      <div className="text-xs text-green-500 mt-1">+20% increase from previous month</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Company Registrations (Last 30 Days)</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target: 50 new companies</span>
                        <span>Actual: 37 new companies</span>
                      </div>
                      <Progress value={74} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">74% of monthly target</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button variant="ghost" className="w-full" onClick={handleDetailedAnalytics}>
                    View Detailed Analytics
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
