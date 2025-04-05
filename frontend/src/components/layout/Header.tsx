
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, Search, User, X, Users, Building, Shield } from "lucide-react";
import Button from "../shared/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Profiles", path: "/profiles" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    
    switch (user.role) {
      case "employer":
        return "/dashboard/employer";
      case "admin":
        return "/dashboard/admin";
      case "jobseeker":
      default:
        return "/dashboard/candidate";
    }
  };

  // Get dashboard icon based on user role
  const getDashboardIcon = () => {
    if (!user) return <User className="h-4 w-4 mr-2" />;
    
    switch (user.role) {
      case "employer":
        return <Building className="h-4 w-4 mr-2" />;
      case "admin":
        return <Shield className="h-4 w-4 mr-2" />;
      case "jobseeker":
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? 
          "bg-white/80 backdrop-blur-lg shadow-sm py-3" : 
          "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-semibold text-xl"
        >
          <Briefcase className="h-6 w-6" />
          <span>Jobpply</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            // Only show Profiles and Contact links to everyone except job seekers
            (link.name !== "Profiles" && link.name !== "Contact") || 
            !isAuthenticated || 
            (isAuthenticated && user?.role !== "jobseeker") ? (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )}
              >
                {link.name}
              </Link>
            ) : null
          ))}
          
          {isAuthenticated && (
            <Link
              to={getDashboardLink()}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname.includes("/dashboard")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              Dashboard
            </Link>
          )}
          
          {isAuthenticated && user?.role === "jobseeker" && (
            <Link
              to="/saved-jobs"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/saved-jobs"
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              Saved Jobs
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-muted-foreground mr-1">Hello,</span>
                <span className="font-medium">{user?.fullName || user?.email}</span>
                {user?.role && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {user.role === "jobseeker" ? "Job Seeker" : 
                     user.role === "employer" ? "Employer" : "Admin"}
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(getDashboardLink())}
                className="flex items-center"
              >
                {getDashboardIcon()}
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" href="/auth/signin">
                Sign In
              </Button>
              <Button size="sm" href="/auth/signup">
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                // Only show Profiles and Contact links to everyone except job seekers
                (link.name !== "Profiles" && link.name !== "Contact") || 
                !isAuthenticated || 
                (isAuthenticated && user?.role !== "jobseeker") ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium",
                      location.pathname === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    {link.name}
                  </Link>
                ) : null
              ))}
              
              {isAuthenticated && (
                <>
                  <Link
                    to={getDashboardLink()}
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium",
                      location.pathname.includes("/dashboard")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    Dashboard
                  </Link>
                  
                  {user?.role === "jobseeker" && (
                    <Link
                      to="/saved-jobs"
                      className={cn(
                        "px-4 py-3 rounded-md text-sm font-medium",
                        location.pathname === "/saved-jobs"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      )}
                    >
                      Saved Jobs
                    </Link>
                  )}
                </>
              )}
            </nav>
            <div className="flex items-center space-x-4 pt-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => navigate(getDashboardLink())}>
                    {getDashboardIcon()}
                    Dashboard
                  </Button>
                  <Button className="flex-1" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" href="/auth/signin">
                    Sign In
                  </Button>
                  <Button className="flex-1" href="/auth/signup">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
