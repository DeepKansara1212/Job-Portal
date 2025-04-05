import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../shared/Card";
import Button from "../shared/Button";
import { authAPI } from "@/api/api";

const EmailVerification = ({ email, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    // Start countdown timer for resend button
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, you would call your API
      // const response = await authAPI.verifyEmail(email, verificationCode);
      
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Hardcoded verification for demo - replace with actual API call in production
      if (verificationCode === "123456") {
        // Update user verification status in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.emailVerified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        onVerificationSuccess();
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // In a real implementation, you would call your API
      // await authAPI.resendVerificationCode(email);
      
      // Simulating API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTimer(60);
    } catch (error) {
      console.error("Error resending code:", error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification code to <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="text-sm font-medium">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all glass-input"
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Verify Email
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive a code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={timer > 0 || isLoading}
              className="text-primary hover:underline text-sm mt-1 disabled:opacity-50 disabled:hover:no-underline"
            >
              {timer > 0 ? `Resend code in ${timer}s` : "Resend verification code"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;