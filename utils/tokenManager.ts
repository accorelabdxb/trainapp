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
      error?.message === "TOKEN_EXPIRED"
    );
  },

  // Handle token expiration
  async handleTokenExpiration(): Promise<void> {
    try {
      // Clear all stored authentication data
      await secureStorage.clearAll();

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

      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp) {
        return new Date(payload.exp * 1000);
      }

      return null;
    } catch (error) {
      console.error("Error parsing token expiration:", error);
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
