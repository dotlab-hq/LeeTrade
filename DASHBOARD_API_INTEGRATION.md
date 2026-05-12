# Dashboard API Integration & Dynamic Authentication

## Overview
This document outlines the changes made to integrate the Dashboard with real APIs and implement dynamic authentication based on better-auth sessions.

## Changes Made

### 1. Auth Store Refactoring (`auth-store.ts`)
**Problem:** Auth store was trying to call `useMe()` hook inside Zustand store, which doesn't work properly.

**Solution:** 
- Removed hook call from store
- Changed `initAuth()` to accept session data as parameter
- Store now only handles data management, not fetching
- Proper separation of concerns: fetching happens in `AuthInitializer`, storage happens in store

```typescript
// Before
initAuth: async () => {
  const query = useMe()  // ❌ Can't call hooks in store
  // ...
}

// After
initAuth: (sessionData) => {
  if (sessionData?.user) {
    set({ user: { ...sessionData.user }, isAuthenticated: true })
  }
}
```

### 2. Root Layout Auth Initialization (`__root.tsx`)
**Problem:** Auth state wasn't initialized before routes rendered, causing user data to be missing on first load.

**Solution:**
- Added `AuthInitializer` component that wraps the app
- Component fetches user session via `useMe()` hook on mount
- Shows loading state while auth initializes
- Calls `useAuthStore.initAuth()` with fetched session data
- Ensures user context is available to all child routes

```typescript
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthStore()
  const { data: sessionData, isLoading, isError } = useMe()

  useEffect(() => {
    if (!isLoading) {
      initAuth(sessionData)
    }
  }, [sessionData, isLoading, initAuth])

  if (!isInitialized && isLoading) return <LoadingScreen />
  return <>{children}</>
}
```

### 3. Dashboard Page API Integration (`dashboard-page.tsx`)
**Problem:** Dashboard showed hardcoded leaderboard data, not user-specific submissions.

**Solution:**
- Replaced `useLeaderboard()` with `useSubmissions()` hook
- Filter submissions by current user ID using `useMemo`
- Calculate user-specific statistics (total, completed, score sum)
- Show only user's recent submissions in the list
- Maintain all motion effects from previous redesign

```typescript
// Before
const { data: leaderboard } = useLeaderboard(challengeId)
<p>{leaderboard?.entries.length || 0}</p>  // Shows all submissions

// After
const { data: submissions } = useSubmissions()
const userSubmissions = submissions.filter(sub => sub.userId === user.id)
<p>{userSubmissions.length}</p>  // Shows only user's submissions
```

### 4. Landing Page Dynamic Navigation (`routes/index.tsx`)
**Problem:** Landing page navbar always showed "Sign In" even when user was logged in.

**Solution:**
- Added `useAuthStore` hook to Landing component
- Conditionally render navbar based on auth state:
  - If authenticated: Show "Welcome, [Name]" + "Dashboard" button
  - If not authenticated: Show "Sign In" + "Get Started" buttons
  - While loading: Show skeleton placeholder
- Smooth transitions with proper loading states

```typescript
function Landing() {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return (
    <>
      {isLoading ? (
        <SkeletonPlaceholder />
      ) : isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <Link to="/app">Dashboard</Link>
        </>
      ) : (
        <>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Get Started</Link>
        </>
      )}
    </>
  )
}
```

## Authentication Flow

### User Login
1. User navigates to `/signin` and authenticates via better-auth
2. Session is created server-side
3. `AuthInitializer` component calls `useMe()` to fetch session
4. Session data is passed to `useAuthStore.initAuth()`
5. User object is set in store with role from better-auth
6. Navigation redirects to `/app` dashboard

### Page Load (Authenticated User)
1. App loads, renders `AuthInitializer`
2. `useMe()` fetches user session from `/api/v1/auth/me`
3. Auth store is initialized with user data
4. `isLoading` becomes false, child routes render
5. Dashboard shows user's actual submissions from API
6. Landing page shows "Dashboard" button instead of "Sign In"

### Page Load (Guest User)
1. App loads, renders `AuthInitializer`
2. `useMe()` returns error (not authenticated)
3. Auth store is initialized with null user
4. `isLoading` becomes false, routes render
5. Route guards redirect guests away from `/app`
6. Landing page shows "Sign In" + "Get Started" buttons

## API Endpoints Used

### Authentication
- `GET /api/v1/auth/me` - Fetch current user session
  - Used by: `useMe()` hook
  - Returns: `{ user: { id, email, name, role } }`

### Submissions
- `GET /api/v1/submissions` - Fetch all submissions
  - Used by: `useSubmissions()` hook
  - Returns: `{ submissions: Submission[] }`
  - Note: Filtered by user ID in frontend component

## Key Features

✅ **Auto-detecting Role**: Role is extracted from better-auth session  
✅ **Dynamic Navbar**: Shows different buttons based on auth state  
✅ **Real-time Data**: Dashboard uses actual API submission data  
✅ **Loading States**: Smooth animations during async operations  
✅ **Error Handling**: Gracefully handles auth failures  
✅ **Motion System**: Maintains motion effects from previous redesign  
✅ **Accessibility**: All loading states respect prefers-reduced-motion  

## Testing Checklist

- [ ] Guest visits landing page → sees "Sign In" button
- [ ] User logs in → session is fetched
- [ ] Dashboard loads → shows user's submissions
- [ ] Dashboard stats are correct (total, completed)
- [ ] Landing page updates → shows "Dashboard" button + user name
- [ ] User logs out → landing page reverts to "Sign In"
- [ ] Page refresh → auth persists from session
- [ ] Role is correctly extracted from session
- [ ] Loading skeleton appears during auth check
- [ ] Motion effects work smoothly on all transitions

## Performance Considerations

1. **Auth Caching**: `useMe()` uses 5-minute stale time to minimize API calls
2. **Query Key Filtering**: Submissions are filtered in memory using `useMemo`
3. **Lazy Initialization**: Auth only initializes once at app load
4. **Skeleton Loading**: Shows lightweight skeleton during async operations

## Migration Notes

If updating existing code:
1. Remove any direct `useMe()` calls from components
2. Use `useAuthStore()` instead to access user data
3. Dashboard automatically filters submissions by user
4. Landing page is now fully dynamic

## Files Modified
- `frontend/src/lib/auth-store.ts` - Fixed auth initialization
- `frontend/src/routes/__root.tsx` - Added AuthInitializer component
- `frontend/src/components/pages/dashboard-page.tsx` - Integrated useSubmissions API
- `frontend/src/routes/index.tsx` - Dynamic navbar based on auth state
