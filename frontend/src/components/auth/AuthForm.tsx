import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Button from "../shared/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../shared/Card";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { authAPI } from "@/api/api";

type AuthType = "signin" | "signup";
type UserRole = "jobseeker" | "employer" | "admin";

interface AuthFormProps {
  className?: string;
  onSuccess?: () => void;
}

interface UserData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  adminCode?: string;
}

const AuthForm = ({ className, onSuccess }: AuthFormProps) => {
  const [authType, setAuthType] = useState<AuthType>("signin");
  const [userRole, setUserRole] = useState<UserRole>("jobseeker");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (authType === "signin") {
        const userData = {
          email: formData.email,
          password: formData.password,
        };
        
        if (userRole === "admin") {
          const adminData = {
            ...userData,
            adminCode: formData.adminCode
          };
          
          const response = await authAPI.login(formData.email, formData.password);
          if (response.data) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            if (response.data.user.role === 'admin') {
              navigate("/dashboard/admin");
            } else if (response.data.user.role === 'employer') {
              navigate("/dashboard/employer");
            } else {
              navigate("/dashboard/candidate");
            }
            onSuccess?.();
          }
        } else {
          const response = await authAPI.login(formData.email, formData.password);
          if (response.data) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            if (response.data.user.role === 'admin') {
              navigate("/dashboard/admin");
            } else if (response.data.user.role === 'employer') {
              navigate("/dashboard/employer");
            } else {
              navigate("/dashboard/candidate");
            }
            onSuccess?.();
          }
        }
      } else {
        const userData: UserData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          role: userRole
        };
        
        if (userRole === "admin") {
          userData.adminCode = formData.adminCode;
        }
        
        const response = await authAPI.register(userData);
        if (response.data) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          if (response.data.user.role === 'admin') {
            navigate("/dashboard/admin");
          } else if (response.data.user.role === 'employer') {
            navigate("/dashboard/employer");
          } else {
            navigate("/dashboard/candidate");
          }
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {authType === "signin" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {authType === "signin"
            ? "Enter your credentials to sign in to your account"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-md overflow-hidden border border-border p-1 mb-4">
            <button
              type="button"
              className={cn(
                "flex-1 text-sm py-2 px-4 rounded-md transition-colors",
                authType === "signin"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setAuthType("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 text-sm py-2 px-4 rounded-md transition-colors",
                authType === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setAuthType("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">I am a:</label>
            <div className="flex rounded-md overflow-hidden border border-border p-1">
              <button
                type="button"
                className={cn(
                  "flex-1 text-sm py-2 px-4 rounded-md transition-colors",
                  userRole === "jobseeker"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setUserRole("jobseeker")}
              >
                Job Seeker
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 text-sm py-2 px-4 rounded-md transition-colors",
                  userRole === "employer"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setUserRole("employer")}
              >
                Employer
              </button>
            </div>
            
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="admin-role"
                className="mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    setUserRole("admin");
                  } else {
                    setUserRole("jobseeker");
                  }
                }}
                checked={userRole === "admin"}
              />
              <label htmlFor="admin-role" className="text-sm">
                {authType === "signin" ? "Sign in as Administrator" : "Register as Administrator"}
              </label>
            </div>
            
            {userRole === "admin" && (
              <div className="space-y-2 mt-2">
                <label htmlFor="adminCode" className="text-sm font-medium">
                  Admin Access Code
                </label>
                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all glass-input"
                  placeholder="Enter admin access code"
                />
                <p className="text-xs text-muted-foreground">
                  Required for administrator access
                </p>
              </div>
            )}
          </div>

          {authType === "signup" && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all glass-input"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all glass-input"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              {authType === "signin" && (
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10 transition-all glass-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {authType === "signin" ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            {authType === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setAuthType("signup")}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setAuthType("signin")}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
