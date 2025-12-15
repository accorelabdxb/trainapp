import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Tag types for cache invalidation
export const tagTypes = {
  Auth: "Auth",
  User: "User",
  Challenges: "Challenges",
  Posts: "Posts",
  Attendance: "Attendance",
  Dashboard: "Dashboard",
} as const;

// Main API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(tagTypes),
  keepUnusedDataFor: 60, // Keep cached data for 60 seconds
  refetchOnFocus: true, // Refetch when app comes to foreground
  refetchOnReconnect: true, // Refetch when network reconnects
  endpoints: () => ({}),
});
