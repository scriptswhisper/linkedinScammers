import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If authentication was successful, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      // If for some reason auth failed, redirect to login after a delay
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Processing LinkedIn Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please wait while we complete your authentication...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
