import { api, tagTypes } from "../api";
import { ATT_BASE_URL } from "../baseQuery";

export interface AttendanceHistory {
  checkInTime: string;
  Checkinstatus: number;
}

export interface AttendanceSummaryResponse {
  history: AttendanceHistory[];
  totalcoinsEarned: number;
}

export interface CheckInResponse {
  success: boolean;
  message?: string;
}

// Attendance API slice
export const attendanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkIn: builder.mutation<CheckInResponse, void>({
      query: () => ({
        url: "/api/v1/Attendance/check-in",
        method: "POST",
        baseUrl: ATT_BASE_URL,
      }),
      invalidatesTags: [tagTypes.Attendance, tagTypes.Dashboard],
    }),

    getAttendanceSummary: builder.query<
      AttendanceSummaryResponse,
      { startDate: string; endDate: string }
    >({
      query: (params) => ({
        url: "/api/v1/Attendance/summary/me",
        method: "GET",
        params,
        baseUrl: ATT_BASE_URL,
      }),
      providesTags: [tagTypes.Attendance],
      keepUnusedDataFor: 300, // Keep for 5 minutes
    }),
  }),
});

export const { useCheckInMutation, useGetAttendanceSummaryQuery } =
  attendanceApi;
