# Autologin Test Guide

## Issues Fixed

### 1. Missing Redirect Logic for Unauthenticated Users

**Problem**: The `AuthRouter` in `app/_layout.tsx` was only redirecting authenticated users away from login screens, but wasn't redirecting unauthenticated users to the login screen when they tried to access protected routes.

**Fix**: Added logic to redirect unauthenticated users to the login screen when they try to access protected routes (tabs).

### 2. Token Validation During Initialization

**Problem**: The `ProfileContext` was setting users as authenticated based only on token existence, without validating if the token was expired or invalid.

**Fix**: Added token validation during initialization to check if the stored token is valid and not expired before setting the user as authenticated.

## How to Test Autologin

### Test 1: Fresh Login and Reload

1. **Login**: Enter phone number and complete OTP verification
2. **Navigate**: Go to dashboard or any tab
3. **Reload**: Close and reopen the app (or reload in development)
4. **Expected**: Should automatically log in and go to dashboard

### Test 2: Invalid Token Handling

1. **Login**: Complete normal login process
2. **Manually Expire Token**:
   - Go to device storage and modify the stored token to make it invalid
   - Or wait for token to naturally expire (if it has a short expiration)
3. **Reload**: Close and reopen the app
4. **Expected**: Should clear storage and redirect to login screen

### Test 3: Protected Route Access

1. **Without Login**: Try to access any tab route directly (e.g., `/dashboard`)
2. **Expected**: Should redirect to login screen

### Test 4: Authenticated User on Login Screen

1. **Login**: Complete login process
2. **Navigate to Login**: Try to go back to login screen
3. **Expected**: Should redirect to dashboard

## Code Changes Made

### `app/_layout.tsx`

```typescript
// Added redirect logic for unauthenticated users
if (!user?.isAuthenticated && inAuthGroup) {
  router.replace("/");
  return;
}

// Enhanced login screen detection
const isOnLoginScreen = !currentRoute;
```

### `context/ProfileContext.tsx`

```typescript
// Added token validation during initialization
if (tokenManager.isValidToken(token) && !tokenManager.isTokenExpired(token)) {
  // Set user as authenticated
} else {
  // Clear storage if token is invalid/expired
  await secureStorage.clearAll();
}
```

## Debugging Tips

### Check Console Logs

Look for these log messages:

- `"Stored token is invalid or expired, clearing storage"` - Token validation failed
- `"Error initializing auth:"` - General auth initialization error
- `"Token is expired, clearing storage"` - API request with expired token

### Check Storage

Use device storage inspection tools to verify:

- `access_token` is stored
- `user_data` is stored
- Both are cleared on logout/expiration

### Network Tab

Monitor API requests to see if:

- Authorization header is included
- 401 responses trigger token clearing
- Requests are made with valid tokens

## Expected Behavior

### On App Startup

1. Check for stored token
2. Validate token format and expiration
3. If valid: Set user as authenticated, redirect to dashboard
4. If invalid: Clear storage, stay on login screen

### On Route Navigation

1. If authenticated + on login screen → redirect to dashboard
2. If not authenticated + on protected route → redirect to login
3. If authenticated + on protected route → allow access
4. If not authenticated + on login screen → allow access

This should resolve the autologin issues you were experiencing.
