
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your admin settings have been updated successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
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
            <h1 className="text-2xl font-bold">Admin Settings</h1>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your admin preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="text-sm font-medium">
                    Admin Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    defaultValue="admin@example.com"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium">
                    Change Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    placeholder="New password"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="admin-code" className="text-sm font-medium">
                    Admin Access Code
                  </label>
                  <input
                    id="admin-code"
                    type="password"
                    defaultValue="admin12345"
                    className="w-full p-2 border border-border rounded-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    This code is required for admin access
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New User Registrations</h4>
                      <p className="text-sm text-muted-foreground">Get notified when new users sign up</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="user-reg-notif"
                        className="h-4 w-4 border border-border rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Company Registrations</h4>
                      <p className="text-sm text-muted-foreground">Get notified when new companies register</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="company-reg-notif"
                        className="h-4 w-4 border border-border rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Report Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified about new reports</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="report-notif"
                        className="h-4 w-4 border border-border rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
