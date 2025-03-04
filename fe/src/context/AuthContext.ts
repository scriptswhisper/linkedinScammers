// OR: /home/clod/Desktop/blacklist-linkedin-scammers/fe/context/AuthContext.ts
import { createContext } from "react";

// Define the User type
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  role?: string;
}

// Define the shape of the auth context
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loginWithLinkedIn: () => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => { },
  logout: () => { },
  loginWithLinkedIn: () => { }
});