import { HapticFeedback } from "@/utils/haptics";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Component, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error | FetchBaseQueryError;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error | FetchBaseQueryError): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error | FetchBaseQueryError, errorInfo: any) {
    console.error("ApiErrorBoundary caught an error:", error, errorInfo);
    HapticFeedback.error();

    // Log network errors specifically
    if ("status" in error) {
      console.error("API Error Status:", error.status);
      console.error("API Error Data:", error.data);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  getErrorMessage = (): string => {
    const { error } = this.state;

    if (!error) return "Something went wrong";

    // Handle RTK Query errors
    if ("status" in error) {
      if (error.status === "FETCH_ERROR") {
        return "You're offline. Check your connection and try again.";
      }
      if (error.status === "TIMEOUT_ERROR") {
        return "Request timed out. Please try again.";
      }
      if (typeof error.status === "number") {
        if (error.status === 401) {
          return "Your session has expired. Please log in again.";
        }
        if (error.status === 403) {
          return "You don't have permission to access this.";
        }
        if (error.status === 404) {
          return "The requested resource was not found.";
        }
        if (error.status >= 500) {
          return "Server error. Please try again later.";
        }
      }

      // Try to get message from error data
      if (
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        return String(error.data.message);
      }
    }

    // Handle regular errors
    if (error instanceof Error) {
      return error.message || "An unexpected error occurred.";
    }

    return "Something went wrong. Please try again.";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.getErrorMessage();
      const isNetworkError =
        this.state.error &&
        "status" in this.state.error &&
        (this.state.error.status === "FETCH_ERROR" ||
          this.state.error.status === "TIMEOUT_ERROR");

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {isNetworkError ? (
              <>
                <Text style={styles.emoji}>📡</Text>
                <Text style={styles.title}>Connection Issue</Text>
              </>
            ) : (
              <>
                <Text style={styles.emoji}>⚠️</Text>
                <Text style={styles.title}>Something went wrong</Text>
              </>
            )}

            <Text style={styles.message}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  retryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
