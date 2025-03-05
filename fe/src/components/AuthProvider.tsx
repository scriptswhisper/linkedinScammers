import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
// Props for the AuthProvider component
// const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3005';
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component that will wrap your app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check for OAuth callback parameters
    if (location.pathname === "/auth/callback") {
      const params = new URLSearchParams(location.search);
      const callbackToken = params.get("token");
      const callbackUserBase64 = params.get("user");

      if (callbackToken && callbackUserBase64) {
        try {
          // Decode the base64 user data
          const decodedUserStr = atob(callbackUserBase64);
          const userData = JSON.parse(decodedUserStr);

          // Login with the received data
          login(callbackToken, userData);

          console.log(
            "Successfully processed LinkedIn authentication callback"
          );
        } catch (error) {
          console.error("Error processing auth callback:", error);
        }
      }
    }

    // Check for saved token and user in localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // If parsing fails, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, [location.pathname, location.search]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const loginWithLinkedIn = () => {
    // Redirect to the LinkedIn OAuth endpoint
    window.location.href = "http://localhost:3005/api/auth/linkedin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        loginWithLinkedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
