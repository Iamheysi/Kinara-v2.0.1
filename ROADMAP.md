# Kinara — Product Roadmap

> **Current state:** Feature-complete single-page app (HTML + CDN React + Supabase) running locally / on GitHub.
> **End state:** Deployed web app + native mobile app on App Store & Google Play (v1.0).

---

## Table of Contents

1. [Phase 1 — Production Web App (Client-Ready)](#phase-1--production-web-app)
2. [Phase 2 — Progressive Web App (PWA)](#phase-2--progressive-web-app)
3. [Phase 3 — Native Mobile App v1.0](#phase-3--native-mobile-app-v10)
4. [Backlog / Post-Launch](#backlog--post-launch)

---

## Phase 1 — Production Web App

> Goal: turn the current GitHub-hosted prototype into a real, deployable, maintainable product.

### 1.1  Migrate off single-file / CDN architecture

| Task | Why it matters |
|------|---------------|
| Scaffold a proper **Vite + React** project | Babel-in-browser JSX compilation is ~5-10x slower than a built bundle; breaks lighthouse scores |
| Split `index.html` (~150 KB!) into component files | Maintainability; enables code splitting and tree shaking |
| Replace CDN React / Supabase `<script>` tags with npm packages | Version-locked, tree-shakeable, works offline |
| Add **TypeScript** (optional but recommended) | Catches bugs at write-time, self-documenting props |
| Set up **ESLint + Prettier** | Consistent style, catches common React pitfalls |

**Output:** A standard `npm run dev / npm run build` project that produces a minified, optimised bundle.

---

### 1.2  Hosting & Domain

| Task | Notes |
|------|-------|
| Choose a hosting platform | **Vercel** (recommended) or Netlify — both have zero-config Vite integration and free tiers |
| Register a custom domain | e.g. `kinara.app` — critical for perceived legitimacy |
| Connect domain → hosting provider | Automated SSL via Let's Encrypt (included by Vercel/Netlify) |
| Set up **preview deployments** | Every pull request gets its own URL for QA |
| Configure `www` → apex redirect | Standard SEO hygiene |

---

### 1.3  Supabase — Production Setup

The current project likely uses a development Supabase instance. Before any real users:

| Task | Notes |
|------|-------|
| Create a **separate Supabase project** for production | Never let dev data mix with real user data |
| Move credentials to **environment variables** | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env` — no `config.js` hack needed |
| Audit **Row Level Security (RLS)** policies on every table | Each table must restrict reads/writes to `auth.uid() = user_id`. If any table lacks RLS, all user data is publicly readable |
| Enable **email confirmations** in Supabase Auth settings (prod) | Prevents throwaway accounts |
| Set **JWT expiry** to a sensible value (1 hour default is fine) | Shorter = more refreshes; longer = bigger security window |
| Enable **Supabase backups** (Pro plan) | Point-in-time recovery for user data |
| Add **database indexes** on `user_id` columns | Queries degrade linearly without them as user base grows |

---

### 1.4  Error Monitoring & Analytics

| Task | Tool | Why |
|------|------|-----|
| Crash & error reporting | **Sentry** (free tier) | Know when users hit JS errors in production before they report it |
| Product analytics | **Plausible** (privacy-first, paid) or **PostHog** (free self-host) | Understand which features are used, drop-off points |
| Performance monitoring | Vercel Analytics (free, built-in) | Core Web Vitals tracking |

---

### 1.5  UX — Gaps to Fill Before Launch

These are features implied by the UI but not yet built:

| Feature | Priority | Notes |
|---------|----------|-------|
| **Onboarding flow** | High | New users land with 0 plans, 0 sessions — they need guidance. A 3-step wizard (set goal → pick or create first plan → see dashboard) dramatically improves activation |
| **Empty states** | High | Every tab needs an empty-state illustration + CTA for new users (currently shows blank space) |
| **Reminders / notifications** | Medium | Settings UI mentions it; implementation is missing |
| **Achievements** | Medium | Mentioned in profile; adds retention |
| **Help & Support page** | Medium | Linked in settings; missing content |
| **Password reset flow** | High | "Forgot password?" is not implemented — blocks sign-in recovery |
| **Delete account** | High | Required by Apple App Store & GDPR |
| **Data export (GDPR)** | High | JSON export exists — verify it exports everything |
| **Terms of Service & Privacy Policy** | High | Legal requirement before accepting real users |

---

### 1.6  Performance Audit

| Task | Target |
|------|--------|
| Lighthouse Performance score | ≥ 90 |
| First Contentful Paint | < 1.5 s on mobile 4G |
| Bundle size | < 200 KB gzipped (current single HTML is already ~150 KB uncompressed) |
| Image optimisation | Profile photos should be resized/compressed before Supabase upload |
| Lazy-load heavy tabs (Progress, Calendar) | Reduces initial bundle |

---

### 1.7  Security Audit

| Item | Status |
|------|--------|
| Supabase anon key in client | Acceptable — anon key is public by design; RLS enforces access |
| RLS on all tables | Must verify — see 1.3 |
| Input sanitisation | Profile name/bio are rendered as text, not HTML — verify no `dangerouslySetInnerHTML` with user content |
| OAuth redirect validation | Verify `redirectTo` cannot be hijacked to an external domain |
| Rate limiting on sign-up | Configure in Supabase Auth settings to prevent abuse |

---

### Phase 1 Checklist Summary

- [ ] Vite + React project scaffold
- [ ] All components extracted from `index.html`
- [ ] Deployed on Vercel / Netlify
- [ ] Custom domain live with SSL
- [ ] Production Supabase project + env vars
- [ ] RLS verified on all tables
- [ ] Sentry error monitoring live
- [ ] Analytics live
- [ ] Password reset flow
- [ ] Delete account
- [ ] Terms of Service + Privacy Policy pages
- [ ] Onboarding wizard
- [ ] Empty states on all tabs
- [ ] Lighthouse ≥ 90 on mobile

---

## Phase 2 — Progressive Web App

> Goal: make Kinara installable on any phone without going through an app store.
> A PWA is the fastest, cheapest path to "mobile app" feel.

### What a PWA gives you

- **Install to home screen** (Android & iOS)
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
- [ ] Add `apple-touch-icon` for iOS
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
- [ ] Installable on iOS (Safari)
- [ ] Works offline
- [ ] Splash screen on launch

---

## Phase 3 — Native Mobile App v1.0

> Goal: ship Kinara on the **Apple App Store** and **Google Play Store** as a proper native app.

### Recommended Path: Capacitor

**Why Capacitor over React Native:**
- Reuses the existing Vite/React web codebase — no port required
- Adds a thin native shell around the web app
- Access to native APIs (haptics, camera, local notifications, health kit)
- Maintained by the Ionic team — stable, production-proven
- Ships to both iOS and Android from one codebase

**Why not React Native:**
- Would require rewriting all UI components in React Native primitives (significant effort)
- Better fit for a greenfield native-first app

### 3.1  Capacitor Setup

```bash
npm install @capacitor/core @capacitor/cli
npx cap init Kinara app.kinara.www
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

Native plugins to add:
| Plugin | Purpose |
|--------|---------|
| `@capacitor/haptics` | Vibration on set completion, timer end |
| `@capacitor/local-notifications` | Workout reminders (replaces web push) |
| `@capacitor/camera` | Profile photo from camera roll |
| `@capacitor/status-bar` | Control status bar color to match theme |
| `@capacitor/splash-screen` | Branded launch screen |
| `@capacitor/keyboard` | Keyboard avoidance for weight/rep inputs |

### 3.2  Native UX Refinements

| Item | Notes |
|------|-------|
| Safe area insets (iPhone notch) | CSS `env(safe-area-inset-*)` — verify existing layout handles it |
| Tap highlight removal | Already using `user-select: none` in workout log |
| Scroll behaviour | Native momentum scrolling (`-webkit-overflow-scrolling: touch`) |
| Keyboard handling | Weight input fields must scroll into view when keyboard opens |
| Pull-to-refresh | Optional: re-sync from Supabase |
| Haptics on key interactions | Set logged, rest timer end, PR achieved |

### 3.3  App Store Requirements (Apple)

Before submitting to Apple:

| Requirement | Notes |
|-------------|-------|
| **Apple Developer Account** | $99/year |
| **App Privacy Policy URL** | Must be publicly accessible |
| **Age rating** | 4+ (no objectionable content) |
| **Screenshots** | 6.7" iPhone, 6.1" iPhone, 12.9" iPad (at minimum) |
| **App Review Guidelines** | No references to competitors; must not scrape or harvest data |
| **Sign in with Apple** | **Required** if app offers any third-party sign-in (Google OAuth). Must add Apple as a sign-in option |
| **Health data** | If reading Apple Health, requires `NSHealthShareUsageDescription` and entitlement |
| **Delete account** | In-app account deletion is required by App Store guidelines |
| **TestFlight beta** | Run 2-4 week beta before public release |

### 3.4  Google Play Requirements

| Requirement | Notes |
|-------------|-------|
| **Google Play Developer Account** | $25 one-time |
| **Target SDK** | Must target latest Android SDK |
| **Privacy Policy** | Required in store listing |
| **Data safety form** | Declare what data is collected and how |
| **Adaptive icons** | Foreground + background layer icons for Android |
| **Play Internal Testing** | Release to internal testers first |
| **Open Testing / Beta** | 14-day minimum for full review fast-track |

### 3.5  Sign in with Apple (Required)

Because Kinara supports Google OAuth, Apple requires a matching "Sign in with Apple" option on iOS.

- [ ] Add Supabase Apple OAuth provider
- [ ] Add "Sign in with Apple" button to auth screen
- [ ] Configure Apple developer credentials in Supabase

### 3.6  v1.0 Feature Completion

These must be done before App Store submission:

| Feature | Status |
|---------|--------|
| Password reset | Not built |
| Delete account (in-app) | Not built — **App Store required** |
| Sign in with Apple | Not built — **App Store required** |
| Terms of Service screen | Not built |
| Privacy Policy screen | Not built |
| Onboarding flow | Not built |
| Local notifications (workout reminders) | Not built |
| Offline mode (Phase 2) | Not built |

### 3.7  Pre-Launch Checklist

- [ ] TestFlight beta with ≥ 10 real users for 2+ weeks
- [ ] All App Store screenshots generated
- [ ] App Store listing copy written (EN + RU)
- [ ] Play Store listing copy written (EN + RU)
- [ ] Privacy Policy hosted at public URL
- [ ] Terms of Service hosted at public URL
- [ ] Support email address set up
- [ ] Crash monitoring (Sentry) live on native builds
- [ ] All Phase 1 & 2 checklist items complete

---

## Backlog / Post-Launch

Features to consider after v1.0 ships:

| Feature | Notes |
|---------|-------|
| Apple Health / Google Fit integration | Sync workouts to system health app |
| Workout timer on lock screen | Live Activity (iOS 16+) showing rest timer |
| Apple Watch companion app | Rest timer and set logging from wrist |
| Social / sharing | Share PRs and milestones as image cards |
| Coach mode | One account managing multiple athletes |
| AI-generated plan suggestions | Based on logged history and stated goal |
| Barbell plate calculator | Quick widget for loading plates |
| Video exercise library | Short demo clips per exercise |
| Paid subscription / monetisation | Unlock advanced analytics, unlimited plans |
| Third-party plan import | Import from Boostcamp, Hevy CSV export |

---

## Timeline Estimate (rough)

| Phase | Effort | Notes |
|-------|--------|-------|
| **Phase 1** — Production web | 4–6 weeks | Largest effort: Vite migration + legal/infra setup |
| **Phase 2** — PWA | 2–3 weeks | Mostly plugin config + offline logic |
| **Phase 3** — Native v1.0 | 4–6 weeks | Capacitor setup + Apple/Google submission process + review time |
| **App Store review** | 1–3 weeks | Apple review is the wild card (average 2-3 days but can be rejected) |
| **Total to v1.0 launch** | **~3–4 months** | Assumes 1-2 developers working on it |

---

*Last updated: March 2026*
