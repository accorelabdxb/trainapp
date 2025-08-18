import React, { Component, ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 justify-center items-center bg-black p-4">
          <Text className="text-white text-xl font-bold mb-4">
            Something went wrong
          </Text>
          <Text className="text-white/60 text-center mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </Text>
          <TouchableOpacity
            className="bg-amber-500 px-6 py-3 rounded-xl"
            onPress={() => this.setState({ hasError: false, error: undefined })}
          >
            <Text className="text-black font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
