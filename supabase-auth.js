// ─────────────────────────────────────────────────────────────────────────────
// supabase-auth.js  —  Kinara / Workout Hub  (add BEFORE React/Babel scripts)
// ─────────────────────────────────────────────────────────────────────────────
// SETUP: Replace the two placeholders below with the Supabase project values.
// ─────────────────────────────────────────────────────────────────────────────

const SUPA_URL = 'https://rivnhmnseyeqocpdatfj.supabase.co';      // e.g. https://xxxx.supabase.co
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdm5obW5zZXllcW9jcGRhdGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDQ3OTgsImV4cCI6MjA4ODkyMDc5OH0.lKEMitwo4_rq9fKKxwa0yy9VY_wxFpwy2i_pbj5T91M'; // starts with "eyJ..."

// ── Actual table schemas ──────────────────────────────────────────────────────
//
//  profiles   → id (PK, uuid = auth user id), name, bio, goal, photo
//  plans      → id (bigint, auto PK), user_id (uuid), data (jsonb)
//  sessions   → id (bigint, auto PK), user_id (uuid), logged_date (date), data (jsonb)
//  rest_days  → id (bigint, auto PK), user_id (uuid), logged_date (date)
//  schedule   → id (bigint, auto PK), user_id (uuid), data (jsonb)
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
  let signingOut = false;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function debounce(fn, ms) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  }

  // ── Auth Gate UI ─────────────────────────────────────────────────────────────
  // The #auth-gate div is added inline to index.html (see JSX-patches file).

  function showAuthGate() {
    const el = document.getElementById('auth-gate');
    if (el) { el.style.display = 'flex'; switchView('signin'); }
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
        db.from('profiles').select('*').eq('id', userId).maybeSingle(),
        db.from('plans').select('*').eq('user_id', userId),
        db.from('sessions').select('*').eq('user_id', userId).order('logged_date', { ascending: false }),
        db.from('rest_days').select('logged_date').eq('user_id', userId),
        db.from('schedule').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      const p = profileRes.data;
      return {
        profileName: p?.name        || 'My Profile',
        profileBio:  p?.bio         || '',
        profileGoal: p?.goal        || 'general',
        profilePhoto:p?.photo       || null,
        // null means "use app defaults" — the React useState initializer handles this
        plans:    plansRes.data?.length    ? plansRes.data.map(r => r.data)    : null,
        sessions: sessionsRes.data?.length ? sessionsRes.data.map(r => r.data) : [],
        restDaysLog: restRes.data?.map(r => r.logged_date) || [],
        schedule: schedRes.data?.data || null,
      };
    } catch (e) {
      console.error('[Kinara] Failed to load user data:', e);
      return {}; // app falls back to defaults
    }
  }

  // ── Data Sync Helpers ─────────────────────────────────────────────────────────

  async function syncSessions(userId, sessions) {
    // Replace strategy: delete all user sessions then re-insert
    // (DB id is auto bigint so we can't upsert by app-level id)
    await db.from('sessions').delete().eq('user_id', userId);
    if (sessions.length) {
      const rows = sessions.map(s => ({
        user_id: userId,
        logged_date: s.date,
        data: s,
      }));
      const { error } = await db.from('sessions').insert(rows);
      if (error) throw error;
    }
  }

  async function syncRestDays(userId, restDaysLog) {
    // Diff-based sync using the correct column name: logged_date
    const { data: existing } = await db.from('rest_days').select('logged_date').eq('user_id', userId);
    const existingDates = new Set(existing?.map(r => r.logged_date) || []);
    const newDates      = new Set(restDaysLog);

    const toInsert = restDaysLog.filter(d => !existingDates.has(d));
    const toDelete  = [...existingDates].filter(d => !newDates.has(d));

    if (toInsert.length)
      await db.from('rest_days').insert(toInsert.map(logged_date => ({ user_id: userId, logged_date })));
    if (toDelete.length)
      await db.from('rest_days').delete().eq('user_id', userId).in('logged_date', toDelete);
  }

  async function syncPlans(userId, plans) {
    // Replace strategy: delete all user plans then re-insert
    // (DB id is auto bigint so we can't upsert by app-level id)
    await db.from('plans').delete().eq('user_id', userId);
    if (plans.length) {
      const rows = plans.map(p => ({ user_id: userId, data: p }));
      await db.from('plans').insert(rows);
    }
  }

  async function syncSchedule(userId, schedule) {
    // Delete then insert (no unique constraint on user_id, id is auto bigint)
    await db.from('schedule').delete().eq('user_id', userId);
    await db.from('schedule').insert({ user_id: userId, data: schedule });
  }

  async function syncProfile(userId, profile) {
    // profiles.id IS the auth user uuid (not a separate user_id column)
    await db.from('profiles').upsert(
      {
        id:    userId,
        name:  profile.profileName,
        bio:   profile.profileBio,
        goal:  profile.profileGoal,
        photo: profile.profilePhoto,
      },
      { onConflict: 'id' }
    );
  }

  // ── Global API for React app ──────────────────────────────────────────────────

  // Per-key debounced save — each key gets its own timer so they don't cancel each other
  const syncFns = {
    sessions: (uid, v) => syncSessions(uid, v),
    restDays: (uid, v) => syncRestDays(uid, v),
    plans:    (uid, v) => syncPlans(uid, v),
    schedule: (uid, v) => syncSchedule(uid, v),
    profile:  (uid, v) => syncProfile(uid, v),
  };
  const pendingTimers = {};
  const pendingCalls  = {};

  window.__kinaraSave = (key, value) => {
    if (!currentUserId || signingOut) return;
    // Store the latest value so flush can use it
    pendingCalls[key] = { uid: currentUserId, value };
    clearTimeout(pendingTimers[key]);
    pendingTimers[key] = setTimeout(async () => {
      const call = pendingCalls[key];
      delete pendingCalls[key];
      if (!call || signingOut) return;
      try {
        await syncFns[key](call.uid, call.value);
      } catch (e) {
        console.error(`[Kinara] Sync error [${key}]:`, e);
      }
    }, 900);
  };

  // Flush all pending debounced writes immediately (used before sign-out)
  async function flushPendingSync() {
    const keys = Object.keys(pendingCalls);
    for (const key of keys) {
      clearTimeout(pendingTimers[key]);
      const call = pendingCalls[key];
      delete pendingCalls[key];
      if (call && syncFns[key]) {
        try { await syncFns[key](call.uid, call.value); }
        catch (e) { console.error(`[Kinara] Flush error [${key}]:`, e); }
      }
    }
  }

  // Sign-out — flush pending data to cloud, then sign out
  window.__kinaraSignOut = async () => {
    signingOut = true;
    await flushPendingSync();      // save any unsaved data before signing out
    currentUserId = null;
    await db.auth.signOut();
    location.reload();
  };

  // ── Expose user email to React app ──────────────────────────────────────────
  window.__kinaraUserEmail = null;

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
      window.__kinaraUserEmail = session.user.email || null;

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const data = await loadUserData(session.user.id);
        mountReact(data);
      }
    } else {
      currentUserId = null;
      window.__kinaraUserEmail = null;
      if (!signingOut) showAuthGate();
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

  // ── Email/Password Auth ────────────────────────────────────────────────────

  function showError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  }

  let lastSignupEmail = '';

  function switchView(view) {
    const signIn  = document.getElementById('auth-signin-view');
    const signUp  = document.getElementById('auth-signup-view');
    const confirm = document.getElementById('auth-confirm-view');
    const loading = document.getElementById('auth-loading');
    if (signIn)  signIn.style.display  = 'none';
    if (signUp)  signUp.style.display  = 'none';
    if (confirm) confirm.style.display = 'none';

    if (view === 'signup') {
      if (signUp) signUp.style.display = 'flex';
      if (loading) loading.textContent = 'Create your Kinara account';
    } else if (view === 'confirm') {
      if (confirm) confirm.style.display = 'flex';
      if (loading) loading.textContent = 'Almost there!';
    } else {
      if (signIn) signIn.style.display = 'flex';
      if (loading) loading.textContent = 'Sign in to sync your workouts';
    }
    showError('auth-error', '');
    showError('signup-error', '');
  }

  async function signInWithEmail() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const pass  = document.getElementById('auth-password')?.value;
    if (!email || !pass) { showError('auth-error', 'Please enter email and password.'); return; }

    showError('auth-error', '');
    const btn = document.getElementById('email-signin-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

    const { error } = await db.auth.signInWithPassword({ email, password: pass });
    if (error) {
      showError('auth-error', error.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }
  }

  async function signUpWithEmail() {
    const email   = document.getElementById('signup-email')?.value?.trim();
    const confirm = document.getElementById('signup-email-confirm')?.value?.trim();
    const pass    = document.getElementById('signup-password')?.value;

    if (!email || !confirm || !pass) { showError('signup-error', 'Please fill in all fields.'); return; }
    if (email.toLowerCase() !== confirm.toLowerCase()) { showError('signup-error', 'Email addresses do not match.'); return; }
    if (pass.length < 6) { showError('signup-error', 'Password must be at least 6 characters.'); return; }

    showError('signup-error', '');
    const btn = document.getElementById('email-signup-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }

    const { error } = await db.auth.signUp({
      email,
      password: pass,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    if (error) {
      showError('signup-error', error.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
    } else {
      lastSignupEmail = email;
      const display = document.getElementById('confirm-email-display');
      if (display) display.textContent = email;
      switchView('confirm');
    }
  }

  async function resendConfirmation() {
    if (!lastSignupEmail) return;
    const link = document.getElementById('resend-confirm-link');
    if (link) link.textContent = 'Sending…';
    const { error } = await db.auth.resend({ type: 'signup', email: lastSignupEmail });
    if (link) link.textContent = error ? 'Resend failed — try again' : 'Email sent!';
    if (!error) setTimeout(() => { if (link) link.textContent = 'resend email'; }, 4000);
  }

  // ── Bind buttons on DOMContentLoaded ───────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('google-signin-btn')
      ?.addEventListener('click', signInWithGoogle);
    document.getElementById('email-signin-btn')
      ?.addEventListener('click', signInWithEmail);
    document.getElementById('email-signup-btn')
      ?.addEventListener('click', signUpWithEmail);

    // View toggles
    document.getElementById('show-signup-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signup'); });
    document.getElementById('show-signin-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signin'); });
    document.getElementById('back-to-signin-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signin'); });
    document.getElementById('resend-confirm-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); resendConfirmation(); });

    // Allow Enter key to submit
    document.getElementById('auth-password')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') signInWithEmail(); });
    document.getElementById('signup-password')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') signUpWithEmail(); });
    document.getElementById('signup-email-confirm')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('signup-password')?.focus(); });
  });
})();
