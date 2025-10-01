import axios from "axios";
import { secureStorage } from "./secureStorage";
import { TokenExpiredError, tokenManager } from "./tokenManager";
import { Platform } from "react-native";

const BASE_URL = "http://34.59.166.225:8001";
const ATT_BASE_URL = "http://34.59.166.225:8002";
const COMMUNITY_BASE_URL = "http://34.59.166.225:8003";
const CHALLENGES_BASE_URL = "http://34.59.166.225:8004"
export const BASE_FILE_URL = "http://34.59.166.225/uploads/";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attapi = axios.create({
  baseURL: ATT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const commapi = axios.create({
  baseURL: COMMUNITY_BASE_URL,
});

const challengeapi = axios.create({
  baseURL: CHALLENGES_BASE_URL,
});

// Request interceptor to add token to headers (for AUTH API)
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

// Request interceptor to add token to headers (for ATTENDANCE API)
attapi.interceptors.request.use(
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
      console.error("Error adding token to attendance request:", error);
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

commapi.interceptors.request.use(
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
      console.error("Error adding token to attendance request:", error);
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
challengeapi.interceptors.request.use(
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
      console.error("Error adding token to attendance request:", error);
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

// Response interceptor to handle token expiration (for AUTH API)
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

// Response interceptor to handle token expiration (for ATTENDANCE API)
attapi.interceptors.response.use(
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

commapi.interceptors.response.use(
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
challengeapi.interceptors.response.use(
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

export const attendanceAPI = {
  checkIn: async () => {
    try {
      const response = await attapi.post("/api/v1/Attendance/check-in");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceSummary: async (startDate: string, endDate: string) => {
    try {
      const response = await attapi.get("/api/v1/Attendance/summary/me", {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const communityAPI = {
  createPost: async (
    content: string,
    file: { uri: string; name: string; type: string }
  ) => {
    try {
      const formData = new FormData();

      formData.append("content", content);
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const response = await commapi.post("/api/v1/Community/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllPosts: async () => {
    try {
      const response = await commapi.get("/api/v1/Community/posts");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
      likePost: async (postId: number) => {
      try {
        const response = await commapi.post(
          `/api/v1/Community/posts/${postId}/like`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    unlikePost: async (postId: number) => {
    try {
      const response = await commapi.delete(
        `/api/v1/Community/posts/${postId}/like`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const challengesAPI = {
  getUpcomingChallenges: async () => {
    try { 
      const response = await challengeapi.get("/api/v1/challenges/upcoming");
      return response.data;
    } catch (error) {
      throw error;
    }             
  },
    getActiveChallenges: async () => {
    try { 
      const response = await challengeapi.get("/api/v1/challenges/active");
      return response.data;
    } catch (error) {
      throw error;
    }             
  },
joinChallenge: async (challengeId: string | number) => {
    try {
      // It makes a POST request to the specific endpoint
      const response = await challengeapi.post(
        `/api/v1/Challenges/${challengeId}/join`
      );
      return response.data;
    } catch (error) {
      // This allows your component to catch and handle the error
      throw error;
    }
  },
  getMyChallenges: async () => {
    try {
      const response = await challengeapi.get(
        "/api/v1/Challenges/users/me/challenges"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getChallengeDetails: async (challengeId: string | number) => {
    try {
      const response = await challengeapi.get(
        `/api/v1/Challenges/${challengeId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
}

export default api;
