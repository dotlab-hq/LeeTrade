# LeetTrade Frontend Routing Map

## Public Routes (No Auth Required)

```
/ (Landing Page)
├── Hero section with features
├── CTA to challenges & leaderboard
└── Links to signin/signup

/signin (Sign In)
├── Email + password form
├── Demo account quick access
└── Link to signup

/signup (Sign Up)
├── Full name, email, password fields
├── Form validation
└── Link to signin

/challenges (Challenge Catalog)
├── Search and difficulty filter
├── Grid of challenges
└── → Click challenge to view details

/challenges/$challengeId (Challenge Detail)
├── Rules, scoring, contract info
├── Resource limits display
└── [Submit Solution] → /app/submissions/new
    [View Leaderboard] → /leaderboard/$challengeId

/leaderboard (Global Leaderboard)
├── Challenge selector
├── Ranked submissions table
└── → Click submission to view detail
```

## Authenticated Routes (/app shell)

```
/app (Authenticated Shell + Role Switcher)
│
├── CONTESTANT PAGES
│   ├── /app (Dashboard)
│   │   ├── Stats cards
│   │   ├── Recent submissions
│   │   ├── Active challenges
│   │   └── [New Submission] → /app/submissions/new
│   │
│   ├── /app/submissions (Submissions List)
│   │   ├── Search + status filter
│   │   ├── Paginated list
│   │   ├── [New Submission] → /app/submissions/new
│   │   └── → Click to /app/submissions/$submissionId
│   │
│   ├── /app/submissions/new (New Submission Wizard)
│   │   ├── Step 1: Basic Info
│   │   ├── Step 2: Upload Code
│   │   ├── Step 3: Review
│   │   └── [Submit] → /app/submissions
│   │
│   ├── /app/submissions/$submissionId (Submission Detail)
│   │   ├── Metadata + description
│   │   ├── Tabs: Runs | Logs | Settings
│   │   ├── Runs list with metrics
│   │   ├── [Start New Run]
│   │   └── → Click run to /app/runs/$runId
│   │
│   ├── /app/runs/$runId (Run Detail)
│   │   ├── Overall score & breakdown
│   │   ├── Latency, throughput metrics
│   │   ├── Request statistics
│   │   ├── Event timeline
│   │   ├── [Export Results]
│   │   └── [Replay Run]
│   │
│   └── /app/profile (Profile & Settings)
│       ├── User info display
│       ├── Notification preferences
│       ├── Keyboard shortcuts
│       └── [Logout]
│
├── ORGANIZER PAGES (Role = organizer)
│   ├── /app/organizer/challenges (Challenge Manager)
│   │   ├── Search challenges
│   │   ├── Challenge table
│   │   └── [View] [Edit] [Delete]
│   │
│   ├── /app/organizer/traffic-profiles (Traffic Profiles)
│   │   ├── Profile cards grid
│   │   ├── Pre-configured templates
│   │   ├── [Clone] [Delete] buttons
│   │   └── [New Profile] button
│   │
│   └── /app/organizer/scoring (Scoring Studio)
│       ├── Weight sliders
│       ├── Real-time validation
│       ├── Preset quick buttons
│       ├── Score breakdown preview
│       ├── [Save]
│       └── [Reset]
│
└── ADMIN PAGES (Role = admin/judge)
    ├── /app/admin/review (Submission Review Queue)
    │   ├── Pending submissions list
    │   ├── Detail panel with flags
    │   ├── [Approve] [Reject] buttons
    │   └── Status updates
    │
    └── /app/admin/audit (Audit Log)
        ├── Severity filter buttons
        ├── Event table (timestamp, action, actor, target, severity)
        ├── Color-coded action types
        └── [Export Log] button
```

## Navigation Patterns

### Primary Navigation (Sidebar)
All authenticated pages accessible from consistent left sidebar:
- Dashboard
- Submissions
- Challenges
- Leaderboard
- Profile
- Settings
- [Logout]

### Role-Based Navigation
The sidebar adapts based on user role set in header dropdown:
- **Contestant**: Basic nav items only
- **Organizer**: Basic nav + Organizer section
- **Admin**: Basic nav + Admin section
- **Viewer**: Leaderboard & challenges only

### Quick Action CTAs
Every relevant page has prominent CTAs for common actions:
- Dashboard → [New Submission]
- Challenges → [Submit Solution]
- Submissions → [Start New Run]
- Run → [Replay Run]

### Back Navigation
All detail pages provide "Back to list" buttons:
- Submission detail → back to submissions list
- Run detail → back to submission detail
- Challenge detail → back to challenges list

## External Navigation Entry Points

### Landing Page Links
- [Explore Challenges] → /challenges
- [View Leaderboard] → /leaderboard
- [Get Started] → /signin (redirects to /app if authenticated)

### Auth Flow
1. User clicks [Sign In] or [Get Started]
2. → /signin or /signup
3. On successful auth → /app (redirects if trying to access auth pages while authenticated)

### Challenge Flow
1. Browse /challenges
2. Click challenge → /challenges/$challengeId
3. Click [Submit Solution] → /signin (if not auth) then /app/submissions/new
4. Create submission → /app/submissions/$submissionId

### Leaderboard Flow
1. View /leaderboard (global)
2. Select challenge from dropdown → updates same page with challenge-specific data
3. Click submission row → /app/submissions/$submissionId

## Status & Redirect Rules

### Auth Redirects
- Unauthenticated user accessing /app/* → /signin
- Authenticated user accessing /signin or /signup → /app
- Login successful → /app
- Logout → /signin

### Role-Based Page Access
- Organizer pages only visible when role = organizer
- Admin pages only visible when role = admin
- Non-role users accessing restricted pages → 404 or redirect to dashboard

### 404 Pages
- Invalid $submissionId → stay on submissions list
- Invalid $runId → stay on submission detail
- Invalid $challengeId → stay on challenges list

## Route State Management

### Query Parameters (for filtering/pagination)
- /app/submissions?page=2&status=completed
- /leaderboard?challenge=challenge-1&sort=score

### Navigation State (modal/drawer triggers)
- Run snapshot drawer triggered from leaderboard row click
- Submission details via sidebar panel pattern ready

## Keyboard Shortcuts (Ready for Implementation)
- Cmd/Ctrl+K → Command palette
- Cmd/Ctrl+S → Go to submissions
- Cmd/Ctrl+T → Go to challenges
- Cmd/Ctrl+L → Go to leaderboard
