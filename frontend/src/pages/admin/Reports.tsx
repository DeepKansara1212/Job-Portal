
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/Card";
import { useToast } from "@/hooks/use-toast";

const mockReports = [
  { 
    id: 1, 
    title: "Inappropriate Job Posting", 
    description: "This job posting contains discriminatory language",
    reportedBy: "User ID 5892", 
    reportedEntityType: "job",
    reportedEntityId: 123,
    status: "pending", 
    priority: "high",
    createdAt: "2023-08-15T10:30:00Z" 
  },
  { 
    id: 2, 
    title: "Suspicious Account", 
    description: "This account is posting fake job listings",
    reportedBy: "User ID 4721", 
    reportedEntityType: "user",
    reportedEntityId: 45,
    status: "investigating", 
    priority: "medium",
    createdAt: "2023-08-12T15:45:00Z" 
  },
  { 
    id: 3, 
    title: "Spam Messages", 
    description: "User sending spam messages to multiple job seekers",
    reportedBy: "System Flag", 
    reportedEntityType: "user",
    reportedEntityId: 67,
    status: "pending", 
    priority: "low",
    createdAt: "2023-08-10T09:15:00Z" 
  },
  { 
    id: 4, 
    title: "Fraudulent Company", 
    description: "This company might be conducting a hiring scam",
    reportedBy: "User ID 2345", 
    reportedEntityType: "company",
    reportedEntityId: 12,
    status: "resolved", 
    priority: "high",
    createdAt: "2023-08-05T14:20:00Z" 
  },
  { 
    id: 5, 
    title: "Inaccurate Job Information", 
    description: "Salary range is misleading and doesn't match interview offer",
    reportedBy: "User ID 8732", 
    reportedEntityType: "job",
    reportedEntityId: 234,
    status: "dismissed", 
    priority: "medium",
    createdAt: "2023-08-02T11:10:00Z" 
  },
];

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState(mockReports);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockReports.filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setReports(filtered);
  };

  const handleViewReport = (reportId: number) => {
    toast({
      title: "View Report",
      description: `Viewing report ID: ${reportId}`,
    });
    navigate(`/admin/reports/${reportId}`);
  };

  const handleInvestigateReport = (reportId: number) => {
    toast({
      title: "Investigating Report",
      description: `Report ID: ${reportId} is being investigated`,
    });
    setReports(reports.map(report => 
      report.id === reportId ? {...report, status: "investigating"} : report
    ));
  };

  const handleResolveReport = (reportId: number) => {
    toast({
      title: "Report Resolved",
      description: `Report ID: ${reportId} has been resolved`,
    });
    setReports(reports.map(report => 
      report.id === reportId ? {...report, status: "resolved"} : report
    ));
  };

  const handleDismissReport = (reportId: number) => {
    toast({
      title: "Report Dismissed",
      description: `Report ID: ${reportId} has been dismissed`,
    });
    setReports(reports.map(report => 
      report.id === reportId ? {...report, status: "dismissed"} : report
    ));
  };

  const handleExportReports = () => {
    toast({
      title: "Export Reports",
      description: "Reports data has been exported to CSV",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
              <h1 className="text-2xl font-bold">Report Management</h1>
              <p className="text-muted-foreground">Investigate and resolve reported issues</p>
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
                      placeholder="Search reports..."
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
                  <Button variant="outline" onClick={handleExportReports}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Showing {reports.length} reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Report</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Reported By</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Priority</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-border hover:bg-muted/10">
                        <td className="p-3">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {report.description}
                          </div>
                        </td>
                        <td className="p-3 capitalize">{report.reportedEntityType}</td>
                        <td className="p-3">{report.reportedBy}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'resolved' 
                              ? 'bg-green-100 text-green-800' 
                              : report.status === 'dismissed' 
                                ? 'bg-gray-100 text-gray-800' 
                                : report.status === 'investigating'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`flex items-center ${
                            report.priority === 'high' 
                              ? 'text-red-500' 
                              : report.priority === 'medium' 
                                ? 'text-yellow-500' 
                                : 'text-green-500'
                          }`}>
                            <AlertTriangle className={`h-4 w-4 mr-1 ${
                              report.priority !== 'high' && 'hidden'
                            }`} />
                            {report.priority}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(report.createdAt)}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleViewReport(report.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            
                            {(report.status === 'pending' || report.status === 'investigating') && (
                              <>
                                {report.status === 'pending' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700" 
                                    onClick={() => handleInvestigateReport(report.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Investigate</span>
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-green-500 hover:text-green-700" 
                                  onClick={() => handleResolveReport(report.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sr-only">Resolve</span>
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                                  onClick={() => handleDismissReport(report.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="sr-only">Dismiss</span>
                                </Button>
                              </>
                            )}
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

export default Reports;
