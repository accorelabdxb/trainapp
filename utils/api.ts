import axios from "axios";

const BASE_URL = "http://34.136.48.252:8001";
const SECRET_TOKEN = "YOUR_SECRET_TOKEN"; // Replace with actual token

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SECRET_TOKEN}`,
  },
});

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
    console.log(JSON.stringify({ mobileNumber, otp }, null, 2));
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
    email?: string;
    plainPassword?: string;
    gymId?: string;
    profileDataJson?: any;
  }) => {
    try {
      console.log(JSON.stringify(userData, null, 2));
      const response = await api.post("/api/v1/Accounts/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
