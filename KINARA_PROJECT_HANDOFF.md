# Kinara — Project Handoff Document

## What this app is
Kinara is a self-contained workout tracker. It runs entirely in the browser.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React (hooks only, no router) |
| Styling | Inline styles (no Tailwind compiler, no CSS files) |
| Fonts | Google Fonts via `@import` — Barlow Condensed, DM Sans, JetBrains Mono |
| Icons | Hand-coded inline SVGs (no icon library) |
| Persistence | `window.storage` API (Claude artifact persistent storage) |
| Charts | Hand-coded SVG bar charts |
| Sound | Web Audio API — `playBeeps()` for rest timer end |

## Component map
- `KinaraApp` — root, holds all state, renders sidebar + header + tab content
- `Sidebar` — left nav, 220px wide, logo + nav items + user card
- `Header` — top bar, greeting + session timer pill + settings btn + burger
- `SettingsModal` — fullscreen overlay, theme + language + export/import
- `PRModal` — confetti celebration overlay for new personal records
- `HomeTab` — dashboard: hero, 4 stats, quick start, up next, recent activity
- `PlansTab` — plan list grid → plan detail view with editable exercises
- `LogTab` — workout session: warmup, exercise cards, set checkboxes, rest timer
- `RestTab` — rest day logging + recovery facts
- `CalendarTab` — month grid + session detail panel
- `ProgressTab` — overview / strength / training load tabs with SVG charts

### Helpers
- `LogoMark` — SVG diamond logo
- `BurgerBtn` — animated 3-line → X toggle button
- `Toggle` — pill toggle switch
- `DRow` — drawer row with hover + arrow
- `Divider` / `SLabel` — layout primitives

## State structure (`KinaraApp`)

```js
theme — "dark" | "light"
lang — "en" | "ru"
tab — "home" | "plans" | "log" | "rest" | "calendar" | "progress"
menuOpen — bool (burger menu)
showSettings — bool (settings modal)
plans — Plan[] (starts from DEFAULT_PLANS, editable)
sessions — Session[] (grows as workouts are finished)
activeWorkout — ActiveWorkout | null (live session in progress)
restLogged — bool (today's rest day flag)
todayLogged — bool (any activity today)
selectedMonth — Date (calendar view)
selectedDay — number | null (selected calendar day)
showPR — PR[] | null (triggers confetti modal)
```

```ts
// Key types (approximate)
Plan = { id, name, panel, accent, warmup:{enabled,duration}, notes, exercises: Exercise[] }
Exercise = { id, name, sets:number, reps:number, rest:number }
Session = { id, date:ISO, planName, duration:seconds, exercises: LoggedExercise[], totalVolume:kg }
ActiveWorkout = { planId, planName, elapsed:seconds, warmup:{enabled,done,elapsed,duration},
 exercises: ActiveExercise[], currentExIdx, restTimer:{remaining,total,exIdx}|null }
ActiveExercise = { ...Exercise, sets: SetEntry[] }
SetEntry = { reps, weight:string, done:bool }
```

## Design tokens (both themes)

### Dark theme (`DARK`)
- bg `#070707` · surface `#0C0C0C` · card `#111111`
- primary `#C4826A` (warm clay/terracotta)
- textPrimary `#EBEBEB` · textSecondary `#5A5A5A` · textMuted `#2C2C2C`
- success `#4E7D4E` · purple `#6E64B0` · gold `#C9A84C`

### Light theme (`LIGHT`)
- bg `#EDF0FA` · surface `#FFFFFF` · card `#F5F7FF`
- primary `#2B55CC` (royal blue)
- textPrimary `#0D1B36` · textSecondary `#5A6A84` · textMuted `#A8B6CC`

## Key behaviors & decisions already made
- No `localStorage` — Claude artifacts don't support it; use `window.storage` for persistence or keep state in-memory.
- Single artifact — all code lives in one `.jsx` artifact (id: `remixed-fe5cec21`).
- Surgical edits — always ask Claude to use `update` (not rewrite) for small changes. Describe which component to change.
- Rest day nudge — appears as a top banner when no activity logged today; dismissible.
- PR detection — compares max weight per exercise across all sessions; triggers confetti modal.
- Rest timer — uses `setInterval` in a `useEffect`, plays 3-beep audio via Web Audio API when it hits zero.
- Warmup timer — counts up (not down); marked done by user manually.
- Fonts — injected via a `<style>` tag in a `useEffect` that re-runs on theme change.
- Translations — `TR.en` and `TR.ru` objects; `t = TR[lang]` passed as prop to all tabs.
- Plan panels — each plan has a panel key (`push` / `pull` / `legs` / `upper`) that maps to a gradient background.

## What's already built ✅
- Full navigation (sidebar + header + burger)
- Dark / light theme toggle
- English / Russian language toggle
- Home dashboard (stats, quick start, weekly bar chart, up next, recent activity)
- Plans tab (grid → detail view, editable exercises, add/remove/reorder)
- Log Workout tab (plan selector → live session with set tracking, rest timer, warmup)
- Finish workout → saves session → PR detection → confetti modal
- Rest Day tab with recovery facts
- Calendar tab with month grid + session detail panel
- Progress tab (overview / strength / training load sub-tabs)
- Settings modal (theme, language, export/import stubs, reminders stub)

## Backlog — what to build next

### High priority
- Persistent storage — wire `window.storage` so sessions & plans survive page refresh
- Warmup countdown — make warmup timer count down, not up
- Add new plan from scratch — the "New Plan" button creates a plan but UX is rough
- Edit plan name & notes — currently read-only in edit mode

### Medium priority
- Exercise library — searchable list of 60+ exercises with muscle group tags
- Superset support — group two exercises to share a rest timer
- Body weight tracking — simple log + sparkline in Progress tab
- Workout notes — free-text note per session
- Share workout — generate a summary card (PNG)

### Low priority / polish
- Haptic feedback on set completion (`navigator.vibrate`)
- Animated number counters on home stats
- Onboarding flow for first-time users

## How to use this document in a new chat
1. Open a new Claude chat.
2. Paste this entire document at the top of your first message.
3. Then describe what you want to build or fix.
4. Attach the latest version of the artifact code (copy it from the artifact panel).
