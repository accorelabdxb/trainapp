import axios from "axios";
import { secureStorage } from "./secureStorage";
import { TokenExpiredError, tokenManager } from "./tokenManager";

const BASE_URL = "http://34.136.48.252:8001";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getAccessToken();
      if (token) {
        // Validate token before using it
        if (!tokenManager.isValidToken(token)) {
          console.warn("Invalid token format detected");
        }

        // Check if token is expired
        if (tokenManager.isTokenExpired(token)) {
          console.warn("Token is expired, clearing storage");
          await secureStorage.clearAll();
          throw new TokenExpiredError();
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding token to request:", error);
      if (error instanceof TokenExpiredError) {
        throw error;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to handle it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Handle token expiration
        await tokenManager.handleTokenExpiration();
      } catch (refreshError) {
        // If handling fails, throw the original error
        throw new TokenExpiredError();
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  // Send OTP
  sendOtp: async (phoneNumber: string) => {
    try {
      const response = await api.post("/api/v1/Accounts/send-otp", {
        userId: null,
        phoneNumber: phoneNumber,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (mobileNumber: string, otp: string) => {
    try {
      const response = await api.post("/api/v1/Accounts/verify-otp", {
        mobileNumber: mobileNumber,
        otp: otp,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData: {
    mobileNumber: string;
    username?: string;
    fullName?: string;
    email?: string | null;
    plainPassword?: string | null;
    gymId?: string | null;
    profileDataJson?: any | null;
  }) => {
    try {
      const response = await api.post("/api/v1/Accounts/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
