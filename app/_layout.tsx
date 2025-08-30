import { Slot } from "expo-router";
import React from "react";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { AppProvider } from "../context/AppContext";
import { ProfileProvider } from "../context/ProfileContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ProfileProvider>
          <Slot />
        </ProfileProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
