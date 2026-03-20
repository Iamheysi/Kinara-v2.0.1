# Kinara — Product Roadmap

> **Current state:** Vite + React SPA with Supabase auth & cloud sync, deployed on Vercel.
> **End state:** Deployed web app + native Android app on **Google Play** and **RuStore** (v1.0).
>
> 📍 **We are here → Phase 1, section 1.5 (UX Gaps to Fill Before Launch)**

---

## Table of Contents

1. [Phase 1 — Production Web App (Client-Ready)](#phase-1--production-web-app)
2. [Phase 2 — Progressive Web App (PWA)](#phase-2--progressive-web-app)
3. [Phase 3 — Native Mobile App v1.0 (Android — Google Play + RuStore)](#phase-3--native-mobile-app-v10-android--google-play--rustore)
4. [Backlog / Post-Launch](#backlog--post-launch)

---

## Phase 1 — Production Web App

> Goal: turn the current GitHub-hosted prototype into a real, deployable, maintainable product.

### 1.1  Migrate off single-file / CDN architecture

| Task | Why it matters | Status |
|------|---------------|--------|
| Scaffold a proper **Vite + React** project | Babel-in-browser JSX compilation is ~5-10x slower than a built bundle; breaks lighthouse scores | ✅ Done |
| Split `index.html` (~150 KB!) into component files | Maintainability; enables code splitting and tree shaking | ✅ Done |
| Replace CDN React / Supabase `<script>` tags with npm packages | Version-locked, tree-shakeable, works offline | ✅ Done |
| Add **TypeScript** (optional but recommended) | Catches bugs at write-time, self-documenting props | ⬜ Deferred |
| Set up **ESLint + Prettier** | Consistent style, catches common React pitfalls | ✅ Done |

**Output:** A standard `npm run dev / npm run build` project that produces a minified, optimised bundle.

---

### 1.2  Hosting & Domain

| Task | Notes | Status |
|------|-------|--------|
| Choose a hosting platform | **Vercel** — zero-config Vite integration, free tier | ✅ Done |
| Register a custom domain | e.g. `kinara.app` — critical for perceived legitimacy | ⬜ Not started |
| Connect domain → hosting provider | Automated SSL via Let's Encrypt (included by Vercel) | ⬜ Blocked by domain |
| Set up **preview deployments** | Every pull request gets its own URL for QA | ✅ Done (Vercel auto) |
| Configure `www` → apex redirect | Standard SEO hygiene | ⬜ Blocked by domain |

---

### 1.3  Supabase — Production Setup

The current project uses a Supabase instance with auth and cloud sync.

| Task | Notes | Status |
|------|-------|--------|
| Create a **separate Supabase project** for production | Never let dev data mix with real user data | ⬜ Not started |
| Move credentials to **environment variables** | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env` | ✅ Done |
| Audit **Row Level Security (RLS)** policies on every table | Each table must restrict reads/writes to `auth.uid() = user_id` | ⬜ Not started |
| Enable **email confirmations** in Supabase Auth settings (prod) | Prevents throwaway accounts | ⬜ Not started |
| Set **JWT expiry** to a sensible value (1 hour default is fine) | Shorter = more refreshes; longer = bigger security window | ⬜ Not started |
| Enable **Supabase backups** (Pro plan) | Point-in-time recovery for user data | ⬜ Not started |
| Add **database indexes** on `user_id` columns | Queries degrade linearly without them as user base grows | ⬜ Not started |

---

### 1.4  Error Monitoring & Analytics

| Task | Tool | Why | Status |
|------|------|-----|--------|
| Crash & error reporting | **Sentry** (free tier) | Know when users hit JS errors in production | ⬜ Not started |
| Product analytics | **Plausible** or **PostHog** | Understand which features are used, drop-off points | ⬜ Not started |
| Performance monitoring | Vercel Analytics (free, built-in) | Core Web Vitals tracking | ⬜ Not started |

---

### 1.5  UX — Gaps to Fill Before Launch

> 📍 **Current focus area**

These are features implied by the UI but not yet built:

| Feature | Priority | Notes | Status |
|---------|----------|-------|--------|
| **Onboarding flow** | High | 3-step wizard (name → goal → plan) with animations | ✅ Done |
| **Empty states** | High | Every tab has empty-state with icon + CTA | ✅ Done |
| **Reminders / notifications** | Medium | Settings UI shows "Coming Soon"; push notifications planned for Phase 2/3 | 🔧 In progress |
| **Achievements** | Medium | 25 achievements with full modal, progress bars, gamified design | ✅ Done |
| **Help & Support page** | Medium | Accessible from settings and burger drawer | ✅ Done |
| **Password reset flow** | High | Forgot password + new password views with Supabase integration | ✅ Done |
| **Delete account** | High | Danger Zone in Settings: reset progress, clear data, delete account with confirmation | ✅ Done |
| **Data export (GDPR)** | High | JSON export exists — verify completeness | ✅ Done |
| **Terms of Service & Privacy Policy** | High | Pages created, accessible from burger drawer and settings | ✅ Done |

---

### 1.6  Performance Audit

| Task | Target | Status |
|------|--------|--------|
| Lighthouse Performance score | ≥ 90 | ⬜ Not started |
| First Contentful Paint | < 1.5 s on mobile 4G | ⬜ Not started |
| Bundle size | < 200 KB gzipped | ⬜ Not started |
| Image optimisation | Profile photos resized/compressed before upload | ✅ Done |
| Lazy-load heavy tabs (Progress, Calendar) | Reduces initial bundle | ⬜ Not started |

---

### 1.7  Security Audit

| Item | Status |
|------|--------|
| Supabase anon key in client | ✅ Acceptable — anon key is public by design; RLS enforces access |
| RLS on all tables | ⬜ Must verify — see 1.3 |
| Input sanitisation | ✅ Profile name/bio rendered as text, no `dangerouslySetInnerHTML` |
| OAuth redirect validation | ⬜ Verify `redirectTo` cannot be hijacked |
| Rate limiting on sign-up | ⬜ Configure in Supabase Auth settings |

---

### Phase 1 Checklist Summary

- [x] Vite + React project scaffold
- [x] All components extracted from `index.html`
- [x] Deployed on Vercel
- [ ] Custom domain live with SSL
- [x] Production Supabase project + env vars
- [ ] RLS verified on all tables
- [ ] Sentry error monitoring live
- [ ] Analytics live
- [x] Password reset flow
- [x] Delete account (Danger Zone in Settings)
- [x] Terms of Service + Privacy Policy pages
- [x] Onboarding wizard (3-step: name → goal → plan)
- [x] Empty states on all tabs
- [x] Skeleton loading screen with shimmer animation
- [x] Milestone celebration modals (1, 5, 10, 25, 50, 100 workouts)
- [x] Upgrade prompt / premium tier teaser (Kinara Pro)
- [x] Enhanced home dashboard (time-based greeting, personalized hero)
- [x] Sidebar polish (hover effects, Pro teaser, clickable profile)
- [ ] Lighthouse ≥ 90 on mobile

---

## Phase 2 — Progressive Web App

> Goal: make Kinara installable on any phone without going through an app store.
> A PWA is the fastest, cheapest path to "mobile app" feel.

### What a PWA gives you

- **Install to home screen** (Android)
- **Offline support** — workout log keeps working with no internet
- **App-like UI** — full-screen, no browser chrome
- **Push notifications** — remind users to log a workout (with their permission)
- **No app store approval needed** — ship instantly

### 2.1  Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "Kinara",
  "short_name": "Kinara",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#2B55CC",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Tasks:
- [ ] Design app icons (192px, 512px, maskable variant)
- [ ] Add `<link rel="manifest">` to `index.html`
- [ ] Add `theme-color` meta tag

### 2.2  Service Worker + Offline Support

Use **Workbox** (via `vite-plugin-pwa`) for automatic service worker generation.

Caching strategy:
- **App shell** (HTML, CSS, JS) → Cache-first
- **Supabase API calls** → Network-first with offline fallback
- **Fonts & icons** → Cache-first, long TTL
- **Profile photos** → Stale-while-revalidate

Offline behaviour:
- User can view their plans and recent sessions from cache
- Workout logging works offline; syncs to Supabase when back online (queue pending writes)

Tasks:
- [ ] Install `vite-plugin-pwa`
- [ ] Configure Workbox caching strategies
- [ ] Implement offline write queue (IndexedDB buffer → sync on reconnect)
- [ ] Add "You're offline" banner in the UI
- [ ] Test offline mode with DevTools

### 2.3  Push Notifications

- [ ] Implement Web Push via **Supabase Edge Functions** or a notification service (OneSignal free tier)
- [ ] Prompt for notification permission after user is established (not on first visit)
- [ ] Notification types for v1: daily workout reminder, streak at-risk alert

### 2.4  PWA Quality Bar

- [ ] Lighthouse PWA score: 100
- [ ] Installable on Android (Chrome)
- [ ] Works offline
- [ ] Splash screen on launch

---

## Phase 3 — Native Mobile App v1.0 (Android — Google Play + RuStore)

> Goal: ship Kinara on **Google Play Store** and **RuStore** as a proper native Android app.
> RuStore targets the Russian-speaking audience in parallel with Google Play.

### Recommended Path: Capacitor

**Why Capacitor over React Native:**
- Reuses the existing Vite/React web codebase — no port required
- Adds a thin native shell around the web app
- Access to native APIs (haptics, camera, local notifications)
- Maintained by the Ionic team — stable, production-proven

**Why not React Native:**
- Would require rewriting all UI components in React Native primitives (significant effort)
- Better fit for a greenfield native-first app

### 3.1  Capacitor Setup

```bash
npm install @capacitor/core @capacitor/cli
npx cap init Kinara app.kinara.www
npm install @capacitor/android
npx cap add android
```

Native plugins to add:
| Plugin | Purpose |
|--------|---------|
| `@capacitor/haptics` | Vibration on set completion, timer end |
| `@capacitor/local-notifications` | Workout reminders |
| `@capacitor/camera` | Profile photo from camera roll |
| `@capacitor/status-bar` | Control status bar color to match theme |
| `@capacitor/splash-screen` | Branded launch screen |
| `@capacitor/keyboard` | Keyboard avoidance for weight/rep inputs |

### 3.2  Native UX Refinements

| Item | Notes |
|------|-------|
| Safe area insets | CSS `env(safe-area-inset-*)` — verify existing layout handles it |
| Tap highlight removal | Already using `user-select: none` in workout log |
| Scroll behaviour | Native momentum scrolling (`-webkit-overflow-scrolling: touch`) |
| Keyboard handling | Weight input fields must scroll into view when keyboard opens |
| Pull-to-refresh | Optional: re-sync from Supabase |
| Haptics on key interactions | Set logged, rest timer end, PR achieved |

### 3.3  Google Play Requirements

| Requirement | Notes |
|-------------|-------|
| **Google Play Developer Account** | $25 one-time |
| **Target SDK** | Must target latest Android SDK |
| **Privacy Policy** | Required in store listing |
| **Data safety form** | Declare what data is collected and how |
| **Adaptive icons** | Foreground + background layer icons for Android |
| **Play Internal Testing** | Release to internal testers first |
| **Open Testing / Beta** | 14-day minimum for full review fast-track |

### 3.4  RuStore Requirements

| Requirement | Notes |
|-------------|-------|
| **RuStore Developer Account** | Free registration at console.rustore.ru |
| **Privacy Policy (Russian)** | Must comply with Federal Law No. 152-FZ on Personal Data |
| **App description (Russian)** | Full store listing in Russian |
| **APK or AAB upload** | Same Capacitor build as Google Play |
| **Content rating** | RuStore has its own rating system |
| **Moderation** | RuStore review process (typically 1–3 business days) |
| **RuStore SDK (optional)** | For in-app purchases and push notifications via RuStore |
| **Screenshots** | Phone + tablet screenshots (RU locale) |

### 3.5  v1.0 Feature Completion

These must be done before store submissions:

| Feature | Status |
|---------|--------|
| Password reset | ✅ Done |
| Delete account (in-app) | ✅ Done — Danger Zone in Settings |
| Terms of Service screen | ✅ Done |
| Privacy Policy screen | ✅ Done |
| Onboarding flow | ✅ Done — 3-step wizard |
| Local notifications (workout reminders) | Not built |
| Offline mode (Phase 2) | Not built |
| Full Russian localisation | 🔧 In progress |

### 3.6  Pre-Launch Checklist

**Google Play:**
- [ ] Play Store internal testing with ≥ 10 real users for 2+ weeks
- [ ] All Play Store screenshots generated (Android phone + tablet)
- [ ] Play Store listing copy written (EN + RU)
- [ ] Privacy Policy hosted at public URL
- [ ] Terms of Service hosted at public URL
- [ ] Support email address set up
- [ ] Crash monitoring (Sentry) live on native builds
- [ ] All Phase 1 & 2 checklist items complete

**RuStore:**
- [ ] RuStore developer account created
- [ ] RuStore listing copy written (RU)
- [ ] Screenshots generated with Russian locale
- [ ] Privacy Policy in Russian hosted at public URL
- [ ] Compliance with Federal Law No. 152-FZ verified
- [ ] RuStore moderation passed
- [ ] Support contact accessible for Russian users

---

## Backlog / Post-Launch

Features to consider after v1.0 ships:

| Feature | Notes |
|---------|-------|
| Google Fit integration | Sync workouts to system health app |
| Social / sharing | Share PRs and milestones as image cards |
| Coach mode | One account managing multiple athletes |
| AI-generated plan suggestions | Based on logged history and stated goal |
| Barbell plate calculator | Quick widget for loading plates |
| Video exercise library | Short demo clips per exercise |
| Paid subscription / monetisation | Unlock advanced analytics, unlimited plans |
| Third-party plan import | Import from Boostcamp, Hevy CSV export |
| iOS support via Capacitor | Extend to App Store after Android launch |
| Yandex Metrica integration | Analytics for Russian audience |

---

## Timeline Estimate (rough)

| Phase | Effort | Notes |
|-------|--------|-------|
| **Phase 1** — Production web | 4–6 weeks | Largest effort: Vite migration + legal/infra setup |
| **Phase 2** — PWA | 2–3 weeks | Mostly plugin config + offline logic |
| **Phase 3** — Native Android v1.0 | 3–4 weeks | Capacitor setup + Google Play & RuStore submission + review time |
| **Total to v1.0 launch** | **~2–3 months** | Assumes 1 developer working on it |

---

*Last updated: March 2026*
