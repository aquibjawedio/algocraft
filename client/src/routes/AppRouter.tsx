import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResendEmailPage from "@/features/auth/pages/ResendEmailPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import ProblemPage from "@/features/problem/pages/ProblemPage";
import ProblemsTablePage from "@/features/problem/pages/ProblemsTablePage";
import ProfilePage from "@/features/user/pages/ProfilePage";
import Layout from "@/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRouter = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="dark">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth/login"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />
            }
          />
          <Route
            path="/auth/register"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />
            }
          />
          <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
          <Route path={`/profile`} element={<ProfilePage />} />
          <Route path="/problems" element={<ProblemsTablePage />} />
        </Route>
        <Route path="/problems/:slug" element={<ProblemPage />} />
        // Email Verification and Password Reset
        <Route path="/auth/resend" element={<ResendEmailPage />} />
        <Route
          path="/auth/verify/:token"
          element={
            isAuthenticated ? <Navigate to="/profile" /> : <VerifyEmailPage />
          }
        />
        // Not Found Route
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
