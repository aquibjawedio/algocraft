import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import SpinLoader from "@/components/shared/SpinLoader";
import {
  CheckCircle,
  XCircle,
  MailCheck,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

const VerifyEmailPage = () => {
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (!isLoading && !error) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate("/auth/login");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex flex-col items-center justify-center h-screen">
        <SpinLoader />
        <p className="text-muted-foreground text-sm mt-4">
          Verifying your email...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground flex flex-col items-center justify-center h-screen px-6 text-center">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">
          Verification Failed
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <div className="flex gap-3 flex-wrap items-center justify-center">
          <Button variant="outline">
            <MailCheck className="h-4 w-4" />
            <Link to="/auth/resend">Resend Verification Email</Link>
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-2 justify-center cursor-pointer"
          >
            <LayoutDashboard />
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex flex-col items-center justify-center h-screen px-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold text-green-500 mb-2">
        Email Verified!
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your email has been successfully verified. You will be redirected to
        login in <span className="font-medium">{countdown}</span> seconds.
      </p>
      <Button variant="link" className="text-foreground border">
        <LogIn />
        <Link to="/auth/login">Go to Login</Link>
      </Button>
    </div>
  );
};

export default VerifyEmailPage;
