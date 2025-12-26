import { decode as atob } from "base-64";
import { authEvents } from "./authEvents";
import { secureStorage } from "./secureStorage";

export class TokenExpiredError extends Error {
  constructor(message: string = "Token has expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export const tokenManager = {
  // Check if an error is a token expiration error
  isTokenExpiredError(error: any): boolean {
    if (!error) return false;

    return (
      error?.name === "TokenExpiredError" ||
      error?.response?.status === 401 ||
      error?.status === 401 ||
      error?.message === "TOKEN_EXPIRED"
    );
  },

  // Handle token expiration
  async handleTokenExpiration(): Promise<void> {
    try {
      // Clear all stored authentication data
      await secureStorage.clearAll();

      // Broadcast logout event so UI/state can react
      authEvents.triggerLogout();

      // Throw a specific error that components can catch
      throw new TokenExpiredError();
    } catch (error) {
      console.error("Error handling token expiration:", error);
      throw new TokenExpiredError();
    }
  },

  // Validate token format (basic validation)
  isValidToken(token: string): boolean {
    if (!token || typeof token !== "string") {
      return false;
    }

    // Basic JWT token validation (has 3 parts separated by dots)
    const parts = token.split(".");
    return parts.length === 3;
  },

  // Get token expiration time (if it's a JWT token)
  getTokenExpiration(token: string): Date | null {
    try {
      if (!token || typeof token !== "string") {
        return null;
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }

      // Safe base64 decode for React Native/Hermes
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      if (payload.exp) {
        return new Date(payload.exp * 1000);
      }

      return null;
    } catch (error) {
      // Fallback if atob is not available or fails
      console.warn("Error parsing token expiration:", error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    if (!token || typeof token !== "string") {
      return true; // No token means expired
    }

    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return false; // Can't determine, assume valid
    }

    return new Date() > expiration;
  },
};
