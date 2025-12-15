import { api, tagTypes } from "../api";

export interface SendOtpRequest {
  userId: null;
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: {
    isProfileExist: boolean;
  };
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  isOtpVerified: boolean;
  token?: string;
  accessToken?: string;
  userId?: string;
  id?: string;
}

export interface RegisterRequest {
  mobileNumber: string;
  username?: string;
  fullName?: string;
  email?: string | null;
  plainPassword?: string | null;
  gymId?: string | null;
  profileDataJson?: any | null;
}

export interface RegisterResponse {
  success: boolean;
  userId?: string;
}

// Auth API slice
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/api/v1/Accounts/send-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.Auth],
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/api/v1/Accounts/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.Auth, tagTypes.User],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/api/v1/Accounts/register",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.Auth, tagTypes.User],
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation, useRegisterMutation } =
  authApi;
