
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Building, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/Card";
import { useToast } from "@/hooks/use-toast";

const mockCompanies = [
  { id: 1, name: "TechCorp Inc", industry: "Technology", location: "San Francisco, CA", status: "verified", employees: 250, joined: "2023-02-10" },
  { id: 2, name: "DesignHub", industry: "Design", location: "New York, NY", status: "pending", employees: 45, joined: "2023-05-22" },
  { id: 3, name: "WebSphere", industry: "Web Services", location: "Austin, TX", status: "pending", employees: 120, joined: "2023-06-15" },
  { id: 4, name: "DataMetrics", industry: "Data Analytics", location: "Chicago, IL", status: "verified", employees: 80, joined: "2023-03-01" },
  { id: 5, name: "CloudNine Solutions", industry: "Cloud Computing", location: "Seattle, WA", status: "verified", employees: 320, joined: "2023-01-18" },
  { id: 6, name: "TechStartup", industry: "Technology", location: "Boston, MA", status: "rejected", employees: 15, joined: "2023-07-30" },
];

const Companies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(mockCompanies);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockCompanies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCompanies(filtered);
  };

  const handleViewCompany = (companyId: number) => {
    toast({
      title: "View Company",
      description: `Viewing company ID: ${companyId}`,
    });
    navigate(`/admin/companies/${companyId}`);
  };

  const handleApproveCompany = (companyId: number) => {
    toast({
      title: "Company Approved",
      description: `Company ID: ${companyId} has been approved`,
    });
    setCompanies(companies.map(company => 
      company.id === companyId ? {...company, status: "verified"} : company
    ));
  };

  const handleRejectCompany = (companyId: number) => {
    toast({
      title: "Company Rejected",
      description: `Company ID: ${companyId} has been rejected`,
    });
    setCompanies(companies.map(company => 
      company.id === companyId ? {...company, status: "rejected"} : company
    ));
  };

  const handleDeleteCompany = (companyId: number) => {
    toast({
      title: "Delete Company",
      description: `Company ID: ${companyId} has been deleted`,
    });
    setCompanies(companies.filter(company => company.id !== companyId));
  };

  const handleExportCompanies = () => {
    toast({
      title: "Export Companies",
      description: "Companies data has been exported to CSV",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard/admin")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Company Management</h1>
              <p className="text-muted-foreground">Approve and manage companies</p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      className="w-full pl-9 p-2.5 border border-border rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" onClick={handleExportCompanies}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                Showing {companies.length} companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Company</th>
                      <th className="text-left p-3 font-medium">Industry</th>
                      <th className="text-left p-3 font-medium">Location</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Employees</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="border-b border-border hover:bg-muted/10">
                        <td className="p-3 font-medium">{company.name}</td>
                        <td className="p-3">{company.industry}</td>
                        <td className="p-3">{company.location}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            company.status === 'verified' 
                              ? 'bg-green-100 text-green-800' 
                              : company.status === 'rejected' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="p-3">{company.employees}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleViewCompany(company.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            
                            {company.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-700" 
                                  onClick={() => handleApproveCompany(company.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                                  onClick={() => handleRejectCompany(company.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteCompany(company.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Companies;
