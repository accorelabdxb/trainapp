# Optimization & Gamified Transitions/Animations Guide

This document lists concrete, no-code recommendations to speed up the app, smooth transitions, and add gamified micro-interactions across your Expo/React Native project.

## Goals
- Reduce perceived and actual load times on all screens
- Make navigation and state changes feel responsive and delightful
- Introduce meaningful gamification (streaks, badges, points, feedback)

## Current Setup Snapshot
- Engine: `Hermes` enabled, New Architecture on (good)
- Router: `expo-router` with `(tabs)` and multiple screens
- UI: `nativewind`, `expo-image`, `expo-av`, `expo-haptics`, `expo-blur`
- Media: large image set under `assets/images`, two sample videos

---

## Performance Optimization

### App/Build
- Keep Hermes enabled; it reduces TTI and memory.
- Enable resource shrinking and minification for release builds (Proguard/R8).
- Split by ABI for smaller APKs; prefer Play App Bundles.
- Turn on PNG crunching in release; convert heavy images to WebP where possible.

### Metro/Bundle
- Use production mode when profiling bundle size.
- Prefer dynamic imports for feature-heavy screens to defer parsing.
- Deduplicate libs (date utils, icon sets) if multiple are used.

### Images & Video
- Use `expo-image` caching and `contentFit` to avoid layout thrash.
- Preload critical above-the-fold images on splash/onboarding.
- Convert large PNG/JPG to WebP; keep animated WebP disabled on iOS.
- For `expo-av` videos: set `shouldPlay` only when visible, unload on blur.

### Lists & Data
- Use `FlatList` with `initialNumToRender`, `windowSize`, `removeClippedSubviews`.
- Supply `getItemLayout` when item height is stable to skip measurements.
- Memoize renderItem; avoid inline functions that re-render on state changes.
- Paginate long feeds; show skeletons while fetching.

### State & Re-renders
- Keep contexts focused; avoid global providers housing fast-changing state.
- Memoize selectors; use `useMemo`/`useCallback` for derived values/actions.
- Hoist expensive calculations out of render paths.
- Use `React.memo` for presentational components with stable props.

### Navigation
- Lazy load heavy screens via `expo-router` segments.
- Prefer push/replace patterns that avoid full remount where appropriate.
- Preload likely next routes on user hover/intent (e.g., tab press).

---

## Animation & Transition Strategy

### Libraries
- Prefer `react-native-reanimated` for smooth, 60fps animations and gestures.
- Use `LayoutAnimation` for simple add/remove transitions on lists.
- Consider `moti` for declarative animations if the team prefers simpler APIs.

### Principles
- Animate only what’s necessary; keep durations short (120–250ms).
- Easing: use `Easing.out(Easing.cubic)` for entering, `Easing.in` for exiting.
- Maintain consistent motion patterns across screens for cohesion.

### Navigation Transitions
- Tabs: subtle scale or fade on icon and label when active.
- Stack: slide/fade transitions, with shared element feel for thumbnails.
- Modals: spring up from bottom with light blur behind.

### Micro-Interactions
- Buttons: press-in scale (0.98) + haptic light; release to 1.0.
- Toggles: animate thumb and track color; provide haptic selection.
- Cards: hover/press shadow elevation with subtle tilt.

---

## Gamification UX

### Feedback Loops
- Points: earn on workouts, logging, challenges; show incremental counter.
- Badges: use existing `gold`, `silver`, `bronze` image assets for tiered badges.
- Streaks: daily/weekly activity tracked; celebrate milestones with confetti.

### Motivators
- Progress bars: for challenges (`challenge1.png`, `challenge2.png`) with animated fill.
- Level-ups: scale/fade in badge with glow; play short sound via `expo-av`.
- Daily goals: checklist with animated check-mark and haptic success.

### Social Signals
- Reactions: light burst or sparkle when liking a post; haptic impact.
- Leaderboards: slide-in rows; subtle highlight for rank changes.

---

## Screen-Specific Ideas

### Dashboard (`app/(tabs)/dashboard.tsx`)
- Animate stats cards in from bottom on first mount.
- Pull-to-refresh: wave animation tied to `useWaveAnimation` hook.

### Challenges (`app/(tabs)/challenges.tsx`)
- Animated progress ring for each challenge; level-up badge reveal.
- Use skeleton placeholders while images load; fade-in on ready.

### Social (`app/(tabs)/social.tsx`)
- List virtualization tuned; press animations on posts; reaction micro-effects.
- Prefetch profile images; fall back to placeholder with crossfade.

### Workout (`app/(tabs)/workout.tsx` and `WorkoutSetCard`)
- Rep counter: haptic on each increment; success flourish at set complete.
- Animated rest timer countdown (color shift + scale pulse).

### Image Edit (`app/imageedit.tsx`)
- Loading states: spinner to checkmark on success; error shake on failure.
- Transition back with success toast and points increment.

---

## Measurement & Monitoring
- Use existing `usePerformanceMonitor` to log render time and interaction latency.
- Profile with Flipper: React Devtools, Network, Images.
- Track TTI per screen; set targets (e.g., <1200ms on mid devices).

---

## API Optimization

### Architecture & Base URLs
- Centralize base URLs and switch via environment (`app.json` `extra` or runtime config). Avoid hard-coded IPs; prefer HTTPS domain with CDN for `BASE_FILE_URL`.
- Consolidate axios clients and interceptors into a single setup to prevent duplication and drift.

### Timeouts, Cancellation, Retry
- Set request `timeout` (e.g., 10s reads, 5s writes for reactions/uploads) to fail fast.
- Use `AbortController` per screen to cancel in-flight calls on unmount or route change.
- Implement retry/backoff (2–3 attempts) for `ECONNABORTED`, `ENETUNREACH`, and `429` with jitter.

### Refresh Token Flow
- Store refresh tokens (key: `REFRESH_TOKEN`) and implement a single-flight refresh that queues and replays pending requests on 401.
- Update `access_token` on success; if refresh fails, logout and show a session-expired banner.

### Caching & Deduplication
- Adopt `react-query` (preferable) or a lightweight cache for GET endpoints (posts, challenges, attendance summary) with SWR semantics.
- Prefetch adjacent tabs on focus and invalidate queries on relevant mutations (e.g., new post, joined challenge).

### Types & Error Mapping
- Add TypeScript DTOs for each endpoint and use them in axios generics to type `response.data`.
- Map errors to user-friendly messages: connectivity, server error, validation. Prefer inline banners/toasts over blocking alerts.

### Uploads & Media
- Normalize file URIs per platform and validate mime types. For large files, show progress and consider chunked/background upload.
- Use `expo-image` with caching for feed thumbnails and profile images.

### Security & Production Hardening
- Use HTTPS only; set `usesCleartextTraffic=false` in prod. Keep dev exceptions via `networkSecurityConfig`.
- Enable server-side caching headers (`ETag`, `Cache-Control`) and leverage them client-side.

---

## Screen-by-Screen Optimization & Flow

### Login (`app/index.tsx`)
- Inline validation and disabled states with button loaders; skeleton for OTP inputs if applicable.
- Prefetch `onboarding` assets and user profile after OTP send for snappy navigation.
- Error visualization: inline banner above form; haptic error; avoid modal alerts.

### Onboarding (`app/onboarding.tsx`)
- Auto-focus OTP inputs with debounced verification; optimistic UI for verification.
- Cancel verification request on route change; show success animation + points preview.
- Resend OTP: cooldown timer with progress ring; haptic feedback on resend.

### Create Account (`app/create-account.tsx`)
- Step-by-step form with deferred validation; use `KeyboardAvoidingView` and smooth scroll to errors.
- Prefetch dashboard data upon final step; success toast + badge animation.

### Dashboard (`app/(tabs)/dashboard.tsx`)
- Query-based data with caching and background refresh; skeleton stats cards.
- Pull-to-refresh tied to `useWaveAnimation`; throttle refresh requests; haptic selection.
- Preload adjacent tabs (social/challenges) when dashboard becomes active.

### Social (`app/(tabs)/social.tsx`)
- Virtualized list with tuned `initialNumToRender`, `windowSize`; memoized `renderItem`.
- Prefetch profile/thumb images; fade in images, skeleton rows during fetch.
- Optimistic reactions: update UI instantly; rollback on error; haptic impact.

### Challenges (`app/(tabs)/challenges.tsx`)
- Cache challenges lists; show segmented skeletons; animated progress rings.
- Optimistic “Join” with immediate state update; confetti on success; rollback on failure.
- Prefetch `getChallengeDetails` when a card enters viewport.

### Workout (`app/(tabs)/workout.tsx` & `components/WorkoutSetCard`)
- Rep counter: local state with haptic on each increment; animated rest timer.
- Persist workout state with debounce; avoid writing on each keystroke.
- Use `LayoutAnimation` for adding/removing sets; memoize set item components.

### Camera & Edit (`app/(tabs)/camera.tsx`, `components/CameraEdit/index.tsx`, `app/imageedit.tsx`)
- Lazy-load camera; pause/unmount camera preview when hidden.
- Image edit: loader-to-checkmark transition on success; error shake; toast + points.
- Upload progress bar; cancelable uploads; retry with exponential backoff.

### Attendance Summary (`app/attendancesummary.tsx`)
- Parameterized query with cache keyed by date range; `getItemLayout` for rows.
- Skeleton for chart/table; prefetch summary for recent ranges.

### Workout Plan (`app/workoutplan.tsx`)
- Prefetch plan data; collapse/expand animations for sections; memoized items.
- Offline-friendly cache with revalidate on focus.

### Redeem, Thirty Day Warrior, Weight Loss Challenge
- Consistent progress bars and reward animations; haptic success on redemption.
- Cache reward inventory; skeletons for items; optimistic redemption with rollback.

---

## Detailed Documentation Enhancements

### Implementation Checklist
- Configure axios clients: `timeout`, interceptors, refresh single-flight, retries.
- Add DTOs for API responses and request params; align payload keys.
- Introduce skeleton loaders across lists and cards; centralize styles.
- Adopt a motion system: durations, easings, and shared patterns for stack/tabs.
- Add “Reduce Motion” preference and respect system setting.
- Measurement: log API latency, render times, and error categories with `usePerformanceMonitor`.

### RTK Query Adoption

### Why RTK Query Here
- Built-in caching, request deduplication, cancellation, and auto-refetch on focus/reconnect.
- Tag-based invalidation keeps lists and details synchronized after mutations.
- Simple optimistic updates and rollback for smooth, gamified interactions.
- Good DevTools visibility; predictable data layer improves perceived performance.

### Migration Checklist
- Audit axios instances and duplicated interceptors; decide a single base URL strategy per environment.
- Install packages: `@reduxjs/toolkit`, `react-redux`.
- Configure a Redux store and wrap the app with `Provider`.
- Implement `baseQueryWithReauth` that attaches tokens and refreshes on 401.
- Add a timeout/cancellation wrapper using `AbortController`.
- Define `tagTypes`: `Auth`, `User`, `Challenges`, `Posts`, `Attendance`, `Dashboard`.
- Port endpoints (queries/mutations) into `createApi`; type responses with DTOs.
- Replace screen-level API calls with RTK Query hooks (`useGet...Query`, `use...Mutation`).
- Add optimistic updates for reactions, join, redeem; rollback on error.
- Prefetch adjacent tabs and detail views on focus/visibility.
- Instrument latency and error categories; remove legacy axios clients when stable.

### Store & Setup (Documentation)
- Create a minimal store with RTK Query’s reducer and middleware.
- Wrap your root in `Provider` and ensure `api.middleware` is included.

```ts
// store.ts (concept)
import { configureStore } from '@reduxjs/toolkit';
import { api } from './rtk/api';

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Base Query with Reauth & Timeout (Concept)
- Attach `Authorization` from secure storage.
- On 401, attempt refresh once; update `access_token` and replay; otherwise logout and show banner.
- Apply a request timeout via `AbortController` for non-idempotent calls.

```ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

const rawBaseQuery = fetchBaseQuery({ baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
});

export const baseQueryWithReauth: any = async (args, api, extra) => {
  let controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  const result = await rawBaseQuery({ ...args, signal: controller.signal }, api, extra);
  clearTimeout(timeoutId);

  if (result.error && result.error.status === 401) {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (refreshToken) {
      const refresh = await rawBaseQuery({ url: '/auth/refresh', method: 'POST', body: { refreshToken } }, api, extra);
      if (refresh.data?.accessToken) {
        await SecureStore.setItemAsync('access_token', refresh.data.accessToken);
        return rawBaseQuery(args, api, extra);
      }
    }
    // logout path
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }
  return result;
};
```

### Endpoints & Tag Plan (Tailored)
- Auth
  - `login`, `refresh`, `logout`
  - Invalidates: `Auth`, `User`
- User
  - `getUserProfile` (query) → Provides: `User`
  - `updateUserProfile` (mutation) → Invalidates: `User`
- Challenges
  - `getChallenges` (query) → Provides: `Challenges`
  - `getChallengeDetails(id)` (query) → Provides: `Challenges`
  - `joinChallenge(id)` (mutation) → Invalidates: `Challenges`
- Social/Community
  - `getPosts(page)` (query) → Provides: `Posts`
  - `reactToPost(id, type)` (mutation) → Optimistic update via `updateQueryData('getPosts')`; optionally Invalidates: `Posts`
- Attendance
  - `getAttendanceSummary(range)` (query) → Provides: `Attendance`
- Dashboard
  - `getDashboardStats` (query) → Provides: `Dashboard`

### Query Keys & Prefetch
- Keys include params: `getPosts({ page })`, `getAttendanceSummary({ range })`, `getChallengeDetails({ id })`.
- Prefetch on tab focus: dashboard → prefetch social/challenges.
- Prefetch on visibility: when a challenge card approaches viewport, prefetch its details.

### Optimistic Updates Patterns
- Reactions: immediately toggle local reaction state in posts list; rollback if mutation fails.
- Join Challenge: update joined flag and progress locally; rollback on 4xx/5xx.
- Redeem: decrement inventory locally; rollback and show banner on failure.

### Phased Adoption
- Phase 1: Adopt read endpoints (dashboard stats, challenges list, posts, attendance summary) and enable caching + prefetch.
- Phase 2: Add mutations with optimistic updates (react, join, redeem) and proper invalidation.
- Phase 3: Replace residual axios usages; finalize refresh flow, timeouts, and metrics.

---

### KPIs
- TTI per screen (<1200ms mid devices), list time-to-skeleton (<200ms).
- API median latency per endpoint (<300ms cached, <700ms network).
- Error banners vs alerts ratio; user-visible errors reduced by 50%.

---

## References & Where to Apply
- `utils/api.ts`: clients, interceptors, DTO types, retries.
- `utils/tokenManager.ts`: refresh flow, `isValidToken`, expiration.
- `components/common/*`: skeletons, loaders, micro-interactions.
- `hooks/usePerformanceMonitor.ts`: latency and render timing.
- `constants/animations.ts`: durations, easing, motion tokens.

This plan keeps code changes minimal while giving clear, staged, and measurable steps to optimize performance and add engaging, gamified motion throughout the app.