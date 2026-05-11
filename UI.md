# LeetTrade Frontend UI Planning (Shadcn-first, No API Integration)

## Problem statement
Define a complete frontend page and component plan for LeetTrade with role-based UX flows, modal patterns, and interlinked navigation. Scope is strictly UI architecture and component planning (dummy data, dummy toasts, no API integration).

## Current state analysis
- `frontend/` is initialized with TanStack Start + React + Tailwind + shadcn-style primitive components.
- Existing app UI is starter-level (`/` route only) and not aligned with the dark Raycast-like theme in `DESIGN.md`.
- `DESIGN.md` establishes core visual language: dark-only surfaces, white primary CTA, hairline borders, no drop shadows, 8px spacing rhythm, and strict component behavior guidance.
- Product scope in `PLAN.md` implies multi-role experience: Contestant, Organizer, Judge/Admin, Viewer.

## Proposed approach
Plan UI in two layers:
1. **Design system foundation** (tokens, shell, reusable components, modal standards, feedback patterns).
2. **Page system** (route map + per-role pages + page-level component composition and interlinking behavior).

No server state coupling in this phase. All interactions use local/dummy state and toast feedback.

### Phase 1 scope lock
- **In scope first:** Public + Contestant pages.
- **Deferred to Phase 2:** Organizer + Admin/Judge pages (kept fully planned for continuity, but scheduled after Phase 1).

## UX principles for this platform
- High-information density but low cognitive load.
- Persistent orientation: global nav + contextual breadcrumbs + page headers.
- Fast action affordances: prominent primary CTA, keyboard-forward interactions where relevant.
- Safety in destructive actions: confirm dialogs with consequence copy.
- Progressive disclosure: details in drawers/modals rather than route sprawl.
- Empty/loading/error skeleton states planned for every data surface (dummy mode for now).

## Information architecture and route map

### Public routes
- `/` — Marketing/Landing (platform value proposition + CTA to Dashboard and Challenges)
- `/challenges` — Challenge catalog (tabs/filters/search UI, paginated list with dummy content)
- `/challenges/$challengeId` — Challenge details (rules, scoring weights, contract summary, sample payloads)
- `/leaderboard` — Global/live leaderboard (table + stats cards + run snapshot drawer trigger)
- `/leaderboard/$challengeId` — Challenge-specific leaderboard view

### Auth-shell routes (UI-only; mock auth state)
- `/app` — Role-aware dashboard hub (entry point with cards for primary actions)
- `/app/submissions` — Submission list/history
- `/app/submissions/new` — Submission creation wizard (UI steps only)
- `/app/submissions/$submissionId` — Submission details (status timeline, logs panel, run metadata)
- `/app/runs/$runId` — Benchmark run details (latency charts placeholders, correctness summary, events table)
- `/app/replays` — Replay center (saved replay presets + replay modal launch)
- `/app/profile` — User profile/preferences
- `/app/settings` — App settings (theme locked to dark, notifications preferences, keyboard prefs)

### Organizer routes
- `/app/organizer/challenges` — Manage challenge definitions
- `/app/organizer/challenges/new` — Create challenge flow (schema builder UI-only)
- `/app/organizer/challenges/$challengeId/edit` — Edit challenge config
- `/app/organizer/traffic-profiles` — Load profile templates
- `/app/organizer/scoring` — Scoring weight editor and simulation panel (dummy)

### Judge/Admin routes
- `/app/admin/review` — Submission review queue
- `/app/admin/audit` — Audit logs and run disputes
- `/app/admin/moderation` — Invalidations/actions history

## Global layout and navigation plan
- **Primary app shell**: top nav + left rail (desktop), collapsible drawer (tablet/mobile), content container.
- **Role switcher** (dummy) in header to preview contestant/organizer/admin experiences.
- **Breadcrumbs** on all non-root app pages.
- **Command bar entry** in header (`Ctrl/Cmd+K`) with mock actions and quick links.
- **Sticky action rail** on long pages (submission detail, challenge editor) for primary actions.

## Component planning (Shadcn UI focus)

### Core primitives to standardize
- `AppShell`, `TopNav`, `SideNav`, `MobileNavDrawer`, `PageHeader`, `SectionHeader`, `StatsCard`, `DataCard`
- `EntityTable` (sorting/filter controls UI), `PaginationBar`, `FilterBar`, `SearchInput`
- `StatusBadge`, `MetricPill`, `KbdHint`, `EmptyState`, `SkeletonBlock`
- `ToastProvider` wrappers for success/error/info dummy actions

### Domain components
- `ChallengeCard`, `ChallengeRuleList`, `ScoringWeightCard`
- `SubmissionTimeline`, `SubmissionStatusPanel`, `BuildLogViewer`
- `RunMetricsPanel`, `LatencyChartStub`, `CorrectnessSummary`, `FailureTraceList`
- `LeaderboardTable`, `RankDeltaChip`, `RunSnapshotDrawer`
- `SchemaFieldBuilder`, `TrafficPatternEditor`, `ScoringSimulatorPanel`

### Monaco editor usage plan
- Use Monaco for structured editing surfaces only:
  - challenge contract JSON/YAML preview editor
  - scoring formula editor (read-write, local validation UI only)
  - replay script preview panel
- Non-editor forms remain standard shadcn inputs/select/textarea.

## Modal and overlay design patterns

### Standard modal taxonomy
- **ConfirmDialog**: destructive actions (invalidate submission, delete draft, reset weights).
- **ActionModal**: focused workflows under 3 steps (new traffic profile, quick replay launch).
- **WizardModal**: multi-step constrained tasks when route change is unnecessary.
- **Drawer**: side-panel for contextual details (run snapshot, user profile quick view).
- **CommandDialog**: global quick actions and navigation.
- **Toast stack**: dummy success/error/info notifications for all mutation-like interactions.

### Modal behavior standards
- One primary action + one secondary action max in footer.
- Escape closes non-destructive dialogs only.
- Focus trap + return focus to trigger element.
- Prevent background scroll while open.
- Consistent sizing tokens (`sm`, `md`, `lg`, `xl`, `full`) mapped to use cases.
- Clear irreversible-action language in confirm dialogs.

## Page-by-page UX blueprint

1. **Landing**: hero, feature strips, CTA cards, “Explore Challenges” and “View Leaderboard” shortcuts.
2. **Challenges Catalog**: filter chips, search, difficulty/status badges, paginated cards/table toggle.
3. **Challenge Detail**: overview, rules tabs, scoring model card, contract preview (Monaco read-only), submit button.
4. **Leaderboard Views**: sortable table, rank change chips, details drawer, time-range toggles.
5. **Dashboard (`/app`)**: quick stats, recent submissions, quick actions, role-specific widgets.
6. **Submission List**: status chips, timestamps, challenge tags, pagination and bulk action stubs.
7. **New Submission Wizard**: 3-step flow (metadata, artifact mock upload UI, review/confirm) with dummy toasts.
8. **Submission Detail**: timeline, logs panel, benchmark summary cards, “Run Replay” modal trigger.
9. **Run Detail**: metric tabs, chart placeholders, event feed table, export/report action stubs.
10. **Replay Center**: saved replays list, clone/run buttons, replay configuration modal.
11. **Profile/Settings**: account card, notification toggles, keyboard shortcuts/help modal.
12. **Organizer Challenge Manager**: challenge list, create/edit routes, schema builder with Monaco.
13. **Organizer Traffic Profiles**: templates grid, profile editor modal, preview panel.
14. **Organizer Scoring Studio**: weight sliders/inputs, simulation chart stubs, compare presets modal.
15. **Admin Review Queue**: queue table, review drawer, approve/reject/invalidate confirmation dialogs.
16. **Admin Audit & Moderation**: timeline table, diff modal, replay evidence drawer.

## Interlinking and navigation rules
- Primary public journey: Landing -> Challenges -> Challenge Detail -> Leaderboard.
- Primary contestant journey: Dashboard -> New Submission -> Submission Detail -> Run Detail -> Leaderboard.
- Organizer journey: Dashboard -> Challenge Manager -> Scoring Studio -> Traffic Profiles.
- Admin journey: Dashboard -> Review Queue -> Audit -> Moderation history.
- Every list page links to detail pages; every detail page provides “back to list” and at least one “next action” CTA.

## Design-token application from DESIGN.md
- Enforce dark-only palette and surface ladder.
- Primary CTA always white pill style; accents reserved for data/category semantics.
- 1px hairline borders as default separation.
- 8px spacing scale with generous section spacing.
- Inter typography with required OpenType settings (`ss03` etc.) in app shell.
- No drop shadows on cards; depth via surface steps only.

## Non-functional UI planning constraints
- No API calls; all data from typed local mock modules.
- All interaction handlers produce deterministic dummy toasts/states.
- Pagination controls exist on list-heavy pages even with fake datasets.
- Accessibility-first: keyboard nav, focus visible, ARIA labels, dialog semantics.
- File-size discipline: split page into sectional components to keep core logic concise.

## Structured todo plan
1. Define route architecture and role-based navigation shell for all planned pages.
2. Establish theme/token alignment layer to match `DESIGN.md`.
3. Build reusable page scaffolding components (headers, cards, tables, pagination, states).
4. Define and scaffold modal/drawer/command-dialog patterns with shared behaviors.
5. Plan and scaffold public pages (landing, challenges, challenge detail, leaderboard).
6. Plan and scaffold contestant pages (dashboard, submissions, runs, replays, settings/profile).
7. Plan and scaffold organizer pages (challenge manager, traffic profiles, scoring studio).
8. Plan and scaffold admin pages (review queue, audit, moderation).
9. Integrate Monaco editor surfaces for contract/scoring/replay editing contexts.
10. Add consistent dummy toast flows and inter-page CTA linking map.
11. Prepare a UI consistency checklist against `DESIGN.md` before implementation.

## Notes and considerations
- Current stylesheet appears to include a different visual direction; implementation should consolidate to a single theme system aligned with `DESIGN.md`.
- Because scope is broad, delivery should proceed in vertical slices by role while preserving one shared component vocabulary.
- If route count is reduced for MVP, retain component and modal standards to avoid redesign churn.
