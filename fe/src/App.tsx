import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Layout components
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

// Page components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashBoardPage";
import ReportScammerPage from "./pages/ReportScammerPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

// UI Components
import { Toaster } from "./components/ui/toaster";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authentication callback route */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportScammerPage />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster /> {/* Add Toaster component here for notifications */}
    </div>
  );
}

export default App;
