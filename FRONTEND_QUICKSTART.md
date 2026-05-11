# LeetTrade Frontend Quick Start Guide

## Getting Started

### Install Dependencies
```bash
cd frontend
bun install
```

### Run Development Server
```bash
bun run dev
```
Server runs at `http://localhost:3000`

### Build for Production
```bash
bun run build
```

## Project Structure

### Key Directories
```
src/
├── components/
│   ├── auth/              # Sign in/up pages
│   ├── layout/            # App shell, navigation
│   ├── pages/             # All 15+ page components
│   └── ui/                # Reusable UI primitives
├── lib/
│   ├── auth-store.ts      # Zustand auth state
│   └── mock-data.ts       # Faker mock data generators
├── routes/                # TanStack Router file-based routes
└── styles.css             # Tailwind + design tokens
```

## Key Features

### Authentication (No Backend)
- Email/password validation
- Demo account: `demo@leetrade.com` / `demo123`
- Mock user creation on signup
- Auth stored in Zustand

### Mock Data
- Faker-generated realistic data
- 12+ submissions with varied statuses
- 5+ challenges with different types
- 20+ leaderboard entries
- Audit log with action history

### Design System
- 100% compliant with DESIGN.md
- Dark Raycast-inspired theme
- Hairline borders (#242728)
- Inter typography with ss03
- 8px spacing rhythm

## Navigation

### Public Routes
- `/` - Landing page
- `/signin` - Sign in
- `/signup` - Sign up
- `/challenges` - Challenge catalog
- `/challenges/$id` - Challenge detail
- `/leaderboard` - Global rankings

### Authenticated Routes (Behind `/app`)
- `/app` - Dashboard
- `/app/submissions` - Submissions list
- `/app/submissions/new` - New submission wizard
- `/app/submissions/$id` - Submission detail
- `/app/runs/$id` - Run detail
- `/app/profile` - Profile & settings

### Organizer Routes
- `/app/organizer/challenges` - Challenge manager
- `/app/organizer/traffic-profiles` - Traffic profiles
- `/app/organizer/scoring` - Scoring studio

### Admin Routes
- `/app/admin/review` - Review queue
- `/app/admin/audit` - Audit log

## Quick Testing Flows

### Test Authentication
1. Go to `http://localhost:3000/signin`
2. Click "Try demo account" button
3. Automatically logs in with demo user

### Test Contestant Flow
1. Navigate to `/challenges`
2. Click a challenge card
3. Click "Submit Solution"
4. Complete 3-step wizard
5. View in `/app/submissions`

### Test Organizer Features
1. At top nav, change role to "Organizer"
2. Access organizer pages from sidebar
3. Adjust scoring weights in studio

### Test Admin Features
1. At top nav, change role to "Judge"
2. Access admin pages from sidebar
3. Review submissions and view audit log

## Development Tips

### Form Validation
- All forms have client-side validation
- Invalid submissions show inline errors
- Demo: Try signin with invalid email

### Mock Data Refresh
- Mock data regenerates on each page load
- No persistence between refreshes
- Use browser DevTools to inspect mock data in console

### Tailwind Classes
All pages use Tailwind + custom CSS variables:
- `bg-canvas` - Main background
- `bg-surface` - Card background
- `border-hairline` - 1px divider
- `text-ink` - Headings
- `text-body` - Body text
- `text-mute` - Muted text

### Component Size Limits
Per guidelines, files kept under 200 lines:
- Page components are single responsibility
- Complex sections split into sub-components
- Each page in `/components/pages/` is < 200 lines

## Common Tasks

### Add a New Page
1. Create component in `src/components/pages/`
2. Create route in `src/routes/`
3. Import component in route file
4. Add to sidebar navigation in `AppShell`

### Update Mock Data
1. Edit `src/lib/mock-data.ts`
2. Modify generators or add new ones
3. Use in page components via `generateMock*()`

### Change Theme Colors
1. Edit CSS variables in `src/styles.css`
2. Update Tailwind theme config
3. All components automatically use new colors

### Add Form Validation
1. Use `useState` for form data and errors
2. Implement `validateForm()` function
3. Show errors inline under fields
4. Disable submit if validation fails

## Production Readiness Notes

### What's Ready
✅ Complete UI with all pages
✅ Form validation
✅ Mock data system
✅ Auth state management
✅ Role-based navigation
✅ Responsive design
✅ Design system compliance

### What Needs Backend Integration
⚠️ API calls (replace with TanStack Query mutations)
⚠️ Real authentication (implement with Better Auth)
⚠️ Data persistence (use database)
⚠️ Real-time updates (add WebSocket)
⚠️ File uploads (implement backend endpoint)

## Performance Considerations

- **Bundle Size**: Using Tailwind JIT - only used styles compiled
- **Images**: Using local Faker data instead of API calls
- **Code Splitting**: TanStack Router automatic route code splitting
- **State**: Zustand stores (minimal bundle impact)

## Debugging

### Browser DevTools
- **React DevTools**: Inspect component hierarchy
- **Tailwind CSS Debugger**: Check applied styles
- **Console**: View mock data structure

### Common Issues

**"Module not found" errors**
- Run `bun install` again
- Check file paths (use `#/` alias prefix)

**Form validation not working**
- Check console for JavaScript errors
- Verify useState hooks are imported

**Styling looks wrong**
- Clear browser cache (Cmd+Shift+Delete)
- Check that Tailwind classes are spelled correctly
- Verify CSS variables are defined in styles.css

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Keyboard Shortcuts (Ready for Implementation)
- `Cmd/Ctrl+K` - Open command palette
- `Cmd/Ctrl+S` - Go to submissions
- `Cmd/Ctrl+T` - Go to challenges
- `Cmd/Ctrl+L` - Go to leaderboard
