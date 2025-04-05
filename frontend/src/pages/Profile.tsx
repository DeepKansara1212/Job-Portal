
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    bio: "Experienced frontend developer with a passion for creating beautiful, responsive user interfaces.",
    skills: "JavaScript, React, TypeScript, Tailwind CSS, Node.js",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Navigate back to dashboard after successful update
      navigate("/dashboard/candidate");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-4 text-muted-foreground">Please sign in to access your profile.</p>
            <Button className="mt-6" href="/auth/signin">
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard/candidate")}>
              Back to Dashboard
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4">
                    {formData.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <Button variant="outline" size="sm">
                    Upload New Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          className="w-full p-2 border border-border rounded-md"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="w-full p-2 border border-border rounded-md bg-muted"
                          value={formData.email}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full p-2 border border-border rounded-md"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <input
                          type="text"
                          name="location"
                          className="w-full p-2 border border-border rounded-md"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        name="bio"
                        rows={4}
                        className="w-full p-2 border border-border rounded-md"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Skills</label>
                      <textarea
                        name="skills"
                        rows={2}
                        className="w-full p-2 border border-border rounded-md"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Separate skills with commas"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-4">
                    <Button 
                      type="submit" 
                      className="ml-auto"
                      isLoading={isSubmitting}
                    >
                      {!isSubmitting && "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
