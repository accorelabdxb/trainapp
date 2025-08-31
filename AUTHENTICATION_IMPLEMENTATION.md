# Authentication Implementation Guide

## Overview

This implementation provides secure token storage, auto-login functionality, and proper token expiration handling for the TrainApp. The system uses `expo-secure-store` for secure storage and implements a comprehensive authentication flow.

## Key Features

### 🔐 Secure Token Storage

- Uses `expo-secure-store` for encrypted storage
- Stores access tokens, user data, and refresh tokens securely
- Automatic token validation and expiration checking

### 🔄 Auto-Login

- Automatically checks for stored tokens on app startup
- Routes users to appropriate screens based on authentication status
- Seamless user experience with no manual login required

### ⚡ Token Management

- Automatic token inclusion in API requests
- Token expiration detection and handling
- Automatic logout on token expiration

## Architecture

### File Structure

```
utils/
├── secureStorage.ts      # Secure storage utilities
├── tokenManager.ts       # Token validation and management
└── api.ts               # API client with token handling

context/
├── ProfileContext.tsx    # Authentication state management
└── hooks/
    └── useProfile.ts     # Authentication hooks

app/
├── _layout.tsx          # Authentication routing
├── index.tsx            # Login screen
├── onboarding.tsx       # OTP verification
└── create-account.tsx   # Account creation
```

## Implementation Details

### 1. Secure Storage (`utils/secureStorage.ts`)

Provides encrypted storage for sensitive data:

```typescript
// Store access token
await secureStorage.setAccessToken(token);

// Get access token
const token = await secureStorage.getAccessToken();

// Store user data
await secureStorage.setUserData(userData);

// Clear all data (logout)
await secureStorage.clearAll();
```

### 2. Token Manager (`utils/tokenManager.ts`)

Handles token validation and expiration:

```typescript
// Check if token is expired
if (tokenManager.isTokenExpired(token)) {
  // Handle expiration
}

// Validate token format
if (tokenManager.isValidToken(token)) {
  // Use token
}

// Handle token expiration error
if (tokenManager.isTokenExpiredError(error)) {
  // Redirect to login
}
```

### 3. API Client (`utils/api.ts`)

Automatically includes tokens in requests and handles expiration:

```typescript
// Request interceptor adds token to headers
api.interceptors.request.use(async (config) => {
  const token = await secureStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenManager.handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);
```

### 4. Authentication Context (`context/ProfileContext.tsx`)

Manages authentication state and auto-login:

```typescript
// Auto-login on app startup
useEffect(() => {
  const initializeAuth = async () => {
    const isAuthenticated = await secureStorage.isAuthenticated();
    if (isAuthenticated) {
      const userData = await secureStorage.getUserData();
      const token = await secureStorage.getAccessToken();
      // Set user in context
    }
  };
  initializeAuth();
}, []);
```

### 5. Authentication Routing (`app/_layout.tsx`)

Handles navigation based on authentication status:

```typescript
useEffect(() => {
  // Redirect authenticated users away from login screens
  if (user?.isAuthenticated && inLoginFlow) {
    router.replace("/(tabs)/dashboard");
  }

  // Redirect unauthenticated users to login
  if (!user?.isAuthenticated && inAuthGroup) {
    router.replace("/");
  }
}, [user, segments]);
```

## Authentication Flow

### 1. App Startup

1. Check for stored access token
2. If token exists and is valid, restore user session
3. Route to appropriate screen (dashboard or create account)

### 2. Login Process

1. User enters phone number
2. Send OTP to phone number
3. User enters OTP
4. Verify OTP and receive access token
5. Store token securely
6. Route to dashboard or create account

### 3. Auto-Login

1. App checks for stored token on startup
2. If valid token exists, restore user session
3. Skip login screens and go directly to main app

### 4. Token Expiration

1. API request fails with 401
2. Clear stored tokens
3. Redirect user to login screen
4. Show "Session Expired" message

## Usage Examples

### Storing User Data After Login

```typescript
const handleLogin = async () => {
  const response = await authAPI.verifyOtp(mobileNumber, otp);
  const accessToken = response.token;

  const userData = {
    id: response.userId,
    mobileNumber,
    token: accessToken,
    isAuthenticated: true,
  };

  await setUser(userData); // Automatically stores in secure storage
};
```

### Handling Token Expiration

```typescript
try {
  const response = await api.get("/protected-endpoint");
} catch (error) {
  if (tokenManager.isTokenExpiredError(error)) {
    Alert.alert("Session Expired", "Please log in again");
    router.replace("/");
  }
}
```

### Logout

```typescript
const handleLogout = async () => {
  await logout(); // Clears secure storage and context
  router.replace("/");
};
```

## Security Features

### 🔒 Encrypted Storage

- Uses iOS Keychain and Android Keystore
- Data is encrypted at rest
- Secure against device compromise

### 🕒 Token Validation

- Validates token format before use
- Checks token expiration
- Automatic cleanup of expired tokens

### 🚫 Secure Logout

- Clears all stored data
- Resets authentication state
- Prevents unauthorized access

## Error Handling

### Token Expiration

- Automatic detection of 401 responses
- Clear user data and redirect to login
- User-friendly error messages

### Network Errors

- Graceful handling of network failures
- Retry mechanisms for transient errors
- Clear error messages to users

### Storage Errors

- Fallback handling for storage failures
- Graceful degradation of features
- Error logging for debugging

## Best Practices

### ✅ Do's

- Always validate tokens before use
- Clear sensitive data on logout
- Handle token expiration gracefully
- Use secure storage for sensitive data
- Provide clear error messages

### ❌ Don'ts

- Don't store tokens in plain text
- Don't ignore token expiration
- Don't expose tokens in logs
- Don't store sensitive data in AsyncStorage
- Don't skip error handling

## Testing

### Manual Testing

1. Test login flow with valid credentials
2. Test auto-login after app restart
3. Test token expiration handling
4. Test logout functionality
5. Test error scenarios

### Automated Testing

```typescript
// Test token storage
test("should store token securely", async () => {
  await secureStorage.setAccessToken("test-token");
  const token = await secureStorage.getAccessToken();
  expect(token).toBe("test-token");
});

// Test token expiration
test("should detect expired token", () => {
  const expiredToken = "expired.jwt.token";
  expect(tokenManager.isTokenExpired(expiredToken)).toBe(true);
});
```

## Troubleshooting

### Common Issues

1. **Token not being stored**

   - Check if expo-secure-store is properly installed
   - Verify storage permissions

2. **Auto-login not working**

   - Check if token is being stored correctly
   - Verify token validation logic

3. **Token expiration not detected**

   - Check API response interceptor
   - Verify token format validation

4. **Navigation loops**
   - Check authentication routing logic
   - Verify user state management

### Debug Tips

- Enable console logging for token operations
- Check secure storage contents
- Monitor API request headers
- Verify authentication state in context

## Future Enhancements

### Planned Features

- Refresh token implementation
- Biometric authentication
- Multi-factor authentication
- Session management
- Offline authentication

### Performance Optimizations

- Token caching strategies
- Lazy loading of user data
- Background token refresh
- Optimized storage operations
