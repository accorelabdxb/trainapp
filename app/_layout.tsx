import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { AppProvider } from "../context/AppContext";
import { ProfileProvider, useProfileContext } from "../context/ProfileContext";
import "./globals.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Component to handle authentication routing
const AuthRouter = () => {
  const router = useRouter();
  const segments = useSegments();
  const { state } = useProfileContext();
  const { user, isInitialized, isLoading } = state;

  useEffect(() => {
    // Don't redirect while still initializing
    if (!isInitialized || isLoading) {
      return;
    }

    // Ensure segments is available
    if (!segments) {
      return;
    }

    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === "(tabs)";
    const inLoginFlow =
      currentRoute === "onboarding" || currentRoute === "create-account";

    // If user is authenticated and trying to access login screens, redirect to dashboard
    if (user?.isAuthenticated && user?.token && inLoginFlow) {
      router.replace("/(tabs)/dashboard");
      return;
    }
  }, [user, isInitialized, isLoading, segments, router]);

  return <Slot />;
};

export default function RootLayout() {
  return (
   <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <ProfileProvider>
            <AuthRouter />
          </ProfileProvider>
        </AppProvider>
      </ErrorBoundary>
   </SafeAreaProvider>
  );
}
