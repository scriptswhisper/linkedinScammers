import axios from 'axios';

// Set base URL for API requests
const API_URL = 'http://localhost:3005/api/users';

// Define types for API requests/responses
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Define a type for API errors
interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        }
    };
    message?: string;
}

// Type guard function to check if an error is an API error
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('message' in error ||
            ('response' in error &&
                typeof (error as ApiError).response === 'object'))
    );
}

// API functions
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        console.log("Sending login request for email:", credentials.email);
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
        console.log("Login successful for:", credentials.email);
        return response.data;
    } catch (error: unknown) {
        if (isApiError(error)) {
            console.error('Login error details:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
        } else {
            console.error('Unknown login error:', error);
        }
        throw error;
    }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
        console.log("Sending registration request with data:", {
            username: userData.username,
            email: userData.email,
            password: "********" // Don't log the actual password
        });

        const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
        console.log("Registration successful for:", userData.email);
        return response.data;
    } catch (error: unknown) {
        if (isApiError(error)) {
            console.error('Registration error details:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
        } else {
            console.error('Unknown registration error:', error);
        }
        throw error;
    }
};

export const getProfile = async (token: string): Promise<User> => {
    try {
        console.log("Fetching user profile with token");
        const response = await axios.get<User>(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Profile fetch successful");
        return response.data;
    } catch (error: unknown) {
        if (isApiError(error)) {
            console.error('Get profile error details:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
        } else {
            console.error('Unknown profile fetch error:', error);
        }
        throw error;
    }
};

export const updateProfile = async (token: string, userData: Partial<User>): Promise<User> => {
    try {
        console.log("Updating user profile with data:", userData);
        const response = await axios.put<User>(`${API_URL}/me`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Profile update successful");
        return response.data;
    } catch (error: unknown) {
        if (isApiError(error)) {
            console.error('Update profile error details:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
        } else {
            console.error('Unknown profile update error:', error);
        }
        throw error;
    }
};