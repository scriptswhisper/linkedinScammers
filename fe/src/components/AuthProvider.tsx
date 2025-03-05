import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

// Determine the base URL based on the environment
const BASE_URL =
  import.meta.env.VITE_ENV_MODE === "production"
    ? import.meta.env.VITE_PROD_SERVER_URL
    : import.meta.env.VITE_LOCAL_SERVER_URL;

console.log("BASE_URL in AuthProvider FE : ", BASE_URL);
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
    window.location.href = `${BASE_URL}/api/auth/linkedin`;
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
