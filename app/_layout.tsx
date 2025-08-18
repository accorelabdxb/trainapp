import { Slot } from "expo-router";
import React from "react";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { AppProvider } from "../context/AppContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Slot />
      </AppProvider>
    </ErrorBoundary>
  );
}
