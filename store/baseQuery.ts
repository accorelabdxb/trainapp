import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { secureStorage } from "../utils/secureStorage";
import { tokenManager } from "../utils/tokenManager";

// Base URLs for different services
export const BASE_URL = "http://64.227.138.196:8001";
export const ATT_BASE_URL = "http://64.227.138.196:8002";
export const COMMUNITY_BASE_URL = "http://64.227.138.196:8003";
export const CHALLENGES_BASE_URL = "http://64.227.138.196:8004";

// Base query with reauth logic
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Determine base URL from args
  let baseUrl = BASE_URL;
  let queryArgs: FetchArgs;

  if (typeof args === "string") {
    queryArgs = { url: args };
  } else {
    queryArgs = { ...args };
    // Check if baseUrl is specified in args
    if ((args as any).baseUrl) {
      baseUrl = (args as any).baseUrl;
      delete (queryArgs as any).baseUrl;
    }
  }

  // Create base query with the determined base URL
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await secureStorage.getAccessToken();
        // Ensure token is a valid string before using it
        if (token && typeof token === "string" && token.trim().length > 0) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        // Don't override Content-Type if it's already set (e.g., for FormData)
        if (!headers.get("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      } catch (error) {
        console.error("Error preparing headers:", error);
        // Continue without token if there's an error
      }
      return headers;
    },
    timeout: 10000,
  });

  // Add timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const finalArgs = { ...queryArgs, signal: controller.signal };
  let result = await baseQuery(finalArgs, api, extraOptions);
  clearTimeout(timeoutId);

  // Handle 401 errors with token refresh
  if (result.error && result.error.status === 401) {
    try {
      const refreshToken = await secureStorage.getRefreshToken();

      // Ensure refreshToken is a valid string
      if (
        refreshToken &&
        typeof refreshToken === "string" &&
        refreshToken.trim().length > 0
      ) {
        try {
          // Attempt to refresh the token using the auth base URL
          const authBaseQuery = fetchBaseQuery({
            baseUrl: BASE_URL,
            prepareHeaders: async (headers) => {
              headers.set("Content-Type", "application/json");
              return headers;
            },
          });

          const refreshResult = await authBaseQuery(
            {
              url: "/api/v1/Accounts/refresh-token",
              method: "POST",
              body: { refreshToken: String(refreshToken) }, // Ensure it's a string
            },
            api,
            extraOptions
          );

          if (
            refreshResult.data &&
            typeof refreshResult.data === "object" &&
            "accessToken" in refreshResult.data
          ) {
            const newAccessToken = (refreshResult.data as any).accessToken;
            // Ensure newAccessToken is a valid string before storing
            if (newAccessToken && typeof newAccessToken === "string") {
              await secureStorage.setAccessToken(newAccessToken);

              // Retry the original request with new token
              const retryController = new AbortController();
              const retryTimeoutId = setTimeout(
                () => retryController.abort(),
                10000
              );
              const retryBaseQuery = fetchBaseQuery({
                baseUrl,
                prepareHeaders: async (headers) => {
                  try {
                    const token = await secureStorage.getAccessToken();
                    // Ensure token is a valid string before using it
                    if (
                      token &&
                      typeof token === "string" &&
                      token.trim().length > 0
                    ) {
                      headers.set("Authorization", `Bearer ${token}`);
                    }
                    if (!headers.get("Content-Type")) {
                      headers.set("Content-Type", "application/json");
                    }
                  } catch (error) {
                    console.error("Error preparing retry headers:", error);
                  }
                  return headers;
                },
                timeout: 10000,
              });

              result = await retryBaseQuery(
                { ...queryArgs, signal: retryController.signal },
                api,
                extraOptions
              );
              clearTimeout(retryTimeoutId);
            } else {
              throw new Error("Invalid access token received from refresh");
            }
          } else {
            // Refresh failed, logout user
            await tokenManager.handleTokenExpiration();
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          await tokenManager.handleTokenExpiration();
        }
      } else {
        // No refresh token, logout user
        await tokenManager.handleTokenExpiration();
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      await tokenManager.handleTokenExpiration();
    }
  }

  return result;
};
