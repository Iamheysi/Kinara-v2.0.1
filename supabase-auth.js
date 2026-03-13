// ─────────────────────────────────────────────────────────────────────────────
// supabase-auth.js  —  Kinara / Workout Hub  (add BEFORE React/Babel scripts)
// ─────────────────────────────────────────────────────────────────────────────
// SETUP: Replace the two placeholders below with your Supabase project values.
// ─────────────────────────────────────────────────────────────────────────────

const SUPA_URL = 'YOUR_SUPABASE_URL';      // e.g. https://xxxx.supabase.co
const SUPA_KEY = 'YOUR_SUPABASE_ANON_KEY'; // starts with "eyJ..."

// ── Assumed table schemas (adjust column names if yours differ) ───────────────
//
//  profiles   → user_id (PK, uuid), name, bio, goal, photo, theme, lang
//  plans      → id (text, PK), user_id (uuid), data (jsonb)
//  sessions   → id (text, PK), user_id (uuid), date (text), data (jsonb)
//  rest_days  → user_id (uuid), date (text)  [composite PK]
//  schedule   → user_id (PK, uuid), data (jsonb)
//
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const { createClient } = window.supabase;
  if (!createClient) {
    console.error('[Kinara] Supabase CDN not loaded. Make sure the supabase-js script tag appears before this file.');
    return;
  }

  const db = createClient(SUPA_URL, SUPA_KEY);
  let currentUserId = null;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function debounce(fn, ms) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  }

  // ── Auth Gate UI ─────────────────────────────────────────────────────────────
  // The #auth-gate div is added inline to index.html (see JSX-patches file).

  function showAuthGate() {
    const el = document.getElementById('auth-gate');
    if (el) el.style.display = 'flex';
  }

  function hideAuthGate() {
    const el = document.getElementById('auth-gate');
    if (el) el.style.display = 'none';
  }

  function showLoading(msg) {
    const el = document.getElementById('auth-loading');
    if (el) el.textContent = msg || 'Loading…';
  }

  // ── Data Loading ─────────────────────────────────────────────────────────────

  async function loadUserData(userId) {
    showLoading('Loading your data…');
    try {
      const [profileRes, plansRes, sessionsRes, restRes, schedRes] = await Promise.all([
        db.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
        db.from('plans').select('*').eq('user_id', userId),
        db.from('sessions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        db.from('rest_days').select('date').eq('user_id', userId),
        db.from('schedule').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      const p = profileRes.data;
      return {
        theme:       p?.theme       || 'light',
        lang:        p?.lang        || 'en',
        profileName: p?.name        || 'My Profile',
        profileBio:  p?.bio         || '',
        profileGoal: p?.goal        || 'general',
        profilePhoto:p?.photo       || null,
        // null means "use app defaults" — the React useState initializer handles this
        plans:    plansRes.data?.length    ? plansRes.data.map(r => r.data)    : null,
        sessions: sessionsRes.data?.length ? sessionsRes.data.map(r => r.data) : [],
        restDaysLog: restRes.data?.map(r => r.date) || [],
        schedule: schedRes.data?.data || null,
      };
    } catch (e) {
      console.error('[Kinara] Failed to load user data:', e);
      return {}; // app falls back to defaults
    }
  }

  // ── Data Sync Helpers ─────────────────────────────────────────────────────────

  async function syncSessions(userId, sessions) {
    if (!sessions.length) {
      await db.from('sessions').delete().eq('user_id', userId);
      return;
    }
    const rows = sessions.map(s => ({
      id: String(s.id),
      user_id: userId,
      date: s.date,
      data: s,
    }));
    const { error } = await db.from('sessions').upsert(rows, { onConflict: 'id' });
    if (error) throw error;

    // Clean up sessions that were deleted in the app
    const liveIds = rows.map(r => r.id);
    await db.from('sessions').delete().eq('user_id', userId).not('id', 'in', `(${liveIds.map(i => `'${i}'`).join(',')})`);
  }

  async function syncRestDays(userId, restDaysLog) {
    // Fetch what's currently in DB
    const { data: existing } = await db.from('rest_days').select('date').eq('user_id', userId);
    const existingDates = new Set(existing?.map(r => r.date) || []);
    const newDates      = new Set(restDaysLog);

    const toInsert = restDaysLog.filter(d => !existingDates.has(d));
    const toDelete  = [...existingDates].filter(d => !newDates.has(d));

    if (toInsert.length)
      await db.from('rest_days').insert(toInsert.map(date => ({ user_id: userId, date })));
    if (toDelete.length)
      await db.from('rest_days').delete().eq('user_id', userId).in('date', toDelete);
  }

  async function syncPlans(userId, plans) {
    if (!plans.length) return;
    const rows = plans.map(p => ({ id: String(p.id), user_id: userId, data: p }));
    await db.from('plans').upsert(rows, { onConflict: 'id' });

    // Remove deleted plans
    const liveIds = rows.map(r => r.id);
    await db.from('plans').delete().eq('user_id', userId).not('id', 'in', `(${liveIds.map(i => `'${i}'`).join(',')})`);
  }

  async function syncSchedule(userId, schedule) {
    await db.from('schedule').upsert(
      { user_id: userId, data: schedule },
      { onConflict: 'user_id' }
    );
  }

  async function syncProfile(userId, profile) {
    await db.from('profiles').upsert(
      {
        user_id: userId,
        name:  profile.profileName,
        bio:   profile.profileBio,
        goal:  profile.profileGoal,
        photo: profile.profilePhoto,
        theme: profile.theme,
        lang:  profile.lang,
      },
      { onConflict: 'user_id' }
    );
  }

  // ── Global API for React app ──────────────────────────────────────────────────

  // Debounced save — called from useEffect hooks in App()
  window.__kinaraSave = debounce(async (key, value) => {
    if (!currentUserId) return;
    try {
      if (key === 'sessions')  await syncSessions(currentUserId, value);
      if (key === 'restDays')  await syncRestDays(currentUserId, value);
      if (key === 'plans')     await syncPlans(currentUserId, value);
      if (key === 'schedule')  await syncSchedule(currentUserId, value);
      if (key === 'profile')   await syncProfile(currentUserId, value);
    } catch (e) {
      console.error(`[Kinara] Sync error [${key}]:`, e);
    }
  }, 900);

  // Sign-out — call this from a button in your Settings or BurgerDrawer
  window.__kinaraSignOut = async () => {
    await db.auth.signOut();
    currentUserId = null;
    window.__kinaraData = {};
    location.reload();
  };

  // ── Auth state machine ────────────────────────────────────────────────────────

  function mountReact(data) {
    window.__kinaraData = data;
    hideAuthGate();

    if (typeof window.__mountApp === 'function') {
      // Babel already finished — mount now
      window.__mountApp();
    } else {
      // Babel hasn't run yet — flag so it mounts itself when ready
      window.__kinaraReady = true;
    }
  }

  db.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      currentUserId = session.user.id;

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const data = await loadUserData(session.user.id);
        mountReact(data);
      }
    } else {
      currentUserId = null;
      showAuthGate();
    }
  });

  // ── Google Sign-In ────────────────────────────────────────────────────────────

  async function signInWithGoogle() {
    const btn = document.getElementById('google-signin-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Redirecting…'; }

    await db.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('google-signin-btn')
      ?.addEventListener('click', signInWithGoogle);
  });
})();
