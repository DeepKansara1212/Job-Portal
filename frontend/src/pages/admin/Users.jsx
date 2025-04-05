import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  UsersIcon, 
  UserPlus, 
  Filter as FilterIcon, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Download
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/Card";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Enhanced mock data with more entries
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "jobseeker", status: "active", registered: "2023-05-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "employer", status: "active", registered: "2023-06-22" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "jobseeker", status: "inactive", registered: "2023-04-10" },
  { id: 4, name: "Emily Brown", email: "emily@example.com", role: "employer", status: "active", registered: "2023-07-01" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "jobseeker", status: "active", registered: "2023-05-30" },
  { id: 6, name: "Sarah Garcia", email: "sarah@example.com", role: "employer", status: "pending", registered: "2023-08-15" },
  { id: 7, name: "David Lee", email: "david@example.com", role: "jobseeker", status: "active", registered: "2023-09-05" },
  { id: 8, name: "Jennifer White", email: "jennifer@example.com", role: "employer", status: "inactive", registered: "2023-07-20" },
  { id: 9, name: "Thomas Brown", email: "thomas@example.com", role: "jobseeker", status: "pending", registered: "2023-08-30" },
  { id: 10, name: "Lisa Johnson", email: "lisa@example.com", role: "employer", status: "active", registered: "2023-06-15" },
  { id: 11, name: "Andrew Davis", email: "andrew@example.com", role: "jobseeker", status: "active", registered: "2023-05-10" },
  { id: 12, name: "Michelle Wilson", email: "michelle@example.com", role: "employer", status: "active", registered: "2023-09-18" },
];

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Apply filters whenever filter settings change
  useEffect(() => {
    let result = [...mockUsers];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(user => user.status === filterStatus);
    }
    
    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterStatus, filterRole]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDeleteUser = (userId) => {
    // Remove the user from both the filtered and complete list
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
  };

  const handleExportUsers = () => {
    // Create CSV content
    const headers = ["ID", "Name", "Email", "Role", "Status", "Registered"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(user => 
        [
          user.id,
          user.name,
          user.email,
          user.role,
          user.status,
          user.registered
        ].join(",")
      )
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "users.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterClick = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const applyFilter = (filterType, value) => {
    if (filterType === "status") {
      setFilterStatus(value);
    } else if (filterType === "role") {
      setFilterRole(value);
    }
  };

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterRole("all");
    setSearchTerm("");
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
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage all {mockUsers.length} users in the system</p>
            </div>
            <Button onClick={() => navigate("/admin/users/new")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
                
                <div className="flex gap-2">
                  <DropdownMenu open={showFilterMenu} onOpenChange={setShowFilterMenu}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" onClick={handleFilterClick}>
                        <FilterIcon className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                      <div className="space-y-4 p-2">
                        <div>
                          <h4 className="mb-2 text-sm font-medium">Status</h4>
                          <div className="flex flex-col gap-2">
                            {["all", "active", "inactive", "pending"].map((status) => (
                              <div 
                                key={status} 
                                className={`px-2 py-1 rounded cursor-pointer hover:bg-muted ${filterStatus === status ? 'bg-muted' : ''}`}
                                onClick={() => applyFilter("status", status)}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-medium">Role</h4>
                          <div className="flex flex-col gap-2">
                            {["all", "jobseeker", "employer"].map((role) => (
                              <div 
                                key={role} 
                                className={`px-2 py-1 rounded cursor-pointer hover:bg-muted ${filterRole === role ? 'bg-muted' : ''}`}
                                onClick={() => applyFilter("role", role)}
                              >
                                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={resetFilters}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" onClick={handleExportUsers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} users
                {filterStatus !== "all" && ` with status: ${filterStatus}`}
                {filterRole !== "all" && ` and role: ${filterRole}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/10">
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : user.status === 'inactive' 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.registered).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleViewUser(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Users;
