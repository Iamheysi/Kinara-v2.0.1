// ─────────────────────────────────────────────────────────────────────────────
// supabase-auth.js  —  Kinara / Workout Hub  (add BEFORE React/Babel scripts)
// ─────────────────────────────────────────────────────────────────────────────
// SETUP: Create a config.js file (see config.example.js) that defines:
//   const SUPA_URL = 'https://YOUR_PROJECT_REF.supabase.co';
//   const SUPA_KEY = 'YOUR_ANON_KEY_HERE';
// config.js must be loaded BEFORE this script.
// ─────────────────────────────────────────────────────────────────────────────

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

  // ── Auth Screen i18n ─────────────────────────────────────────────────────────
  // Defined first — must survive even if Supabase CDN fails to load,
  // so that language toggle buttons (inline onclick) always respond.

  const AUTH_I18N = {
    en: {
      subtitle: 'Sign in to sync your workouts',
      subtitleSignup: 'Create your Kinara account',
      subtitleConfirm: 'Almost there!',
      welcomeBack: 'Welcome Back',
      emailPlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      signInBtn: 'Sign In',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign Up',
      or: 'or',
      googleBtn: 'Continue with Google',
      createAccount: 'Create Your Account',
      confirmEmailPlaceholder: 'Confirm email address',
      passwordMinPlaceholder: 'Password (min. 6 characters)',
      createAccountBtn: 'Create Account',
      hasAccount: 'Already have an account?',
      signInLink: 'Sign In',
      checkEmail: 'Check Your Email',
      didntReceive: "Didn't receive it? Check your spam folder or",
      resendEmail: 'resend email',
      backToSignIn: 'Back to Sign In',
      tryBtn: 'Explore Kinara',
      trySubtitle: 'Take a look around — no account needed',
      tryCaveat: 'Your data will not be saved. Create an account to keep your progress.',
      emailMismatch: 'Email addresses do not match.',
      fillAll: 'Please fill in all fields.',
      passMin: 'Password must be at least 6 characters.',
      enterBoth: 'Please enter email and password.',
      creatingAccount: 'Creating account…',
      signingIn: 'Signing in…',
      redirecting: 'Redirecting…',
      resending: 'Sending…',
      resent: 'Email sent!',
      resendFail: 'Resend failed — try again',
      loading: 'Loading your data…',
      verifyBtn: 'Verify Code',
      verifying: 'Verifying…',
      otpInstructions: 'Enter the 8-digit code from your email, or click the link in the message.',
      otpInvalid: 'Invalid code. Please try again.',
      otpExpired: 'Code expired. We sent a new one — check your email.',
      confirmSent: 'We sent a verification code to',
    },
    ru: {
      subtitle: 'Войдите, чтобы сохранять тренировки',
      subtitleSignup: 'Создайте аккаунт Kinara',
      subtitleConfirm: 'Почти готово!',
      welcomeBack: 'С возвращением',
      emailPlaceholder: 'Электронная почта',
      passwordPlaceholder: 'Пароль',
      signInBtn: 'Войти',
      noAccount: 'Нет аккаунта?',
      signUpLink: 'Регистрация',
      or: 'или',
      googleBtn: 'Продолжить с Google',
      createAccount: 'Создать аккаунт',
      confirmEmailPlaceholder: 'Подтвердите адрес почты',
      passwordMinPlaceholder: 'Пароль (мин. 6 символов)',
      createAccountBtn: 'Создать аккаунт',
      hasAccount: 'Уже есть аккаунт?',
      signInLink: 'Войти',
      checkEmail: 'Проверьте почту',
      didntReceive: 'Не получили? Проверьте спам или',
      resendEmail: 'отправить повторно',
      backToSignIn: 'Назад ко входу',
      tryBtn: 'Попробовать Kinara',
      trySubtitle: 'Посмотрите приложение — без регистрации',
      tryCaveat: 'Данные не сохранятся. Создайте аккаунт, чтобы не потерять прогресс.',
      emailMismatch: 'Адреса почты не совпадают.',
      fillAll: 'Пожалуйста, заполните все поля.',
      passMin: 'Пароль должен содержать минимум 6 символов.',
      enterBoth: 'Введите почту и пароль.',
      creatingAccount: 'Создаём аккаунт…',
      signingIn: 'Входим…',
      redirecting: 'Перенаправляем…',
      resending: 'Отправляем…',
      resent: 'Письмо отправлено!',
      resendFail: 'Не удалось — попробуйте снова',
      loading: 'Загружаем данные…',
      verifyBtn: 'Подтвердить код',
      verifying: 'Проверяем…',
      otpInstructions: 'Введите 8-значный код из письма или перейдите по ссылке в сообщении.',
      otpInvalid: 'Неверный код. Попробуйте ещё раз.',
      otpExpired: 'Код истёк. Мы отправили новый — проверьте почту.',
      confirmSent: 'Мы отправили код подтверждения на',
    },
  };

  let authLang = 'en';

  function applyAuthLang(lang) {
    authLang = lang;
    const strings = AUTH_I18N[lang] || AUTH_I18N.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) el.textContent = strings[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key]) el.placeholder = strings[key];
    });

    const enBtn = document.getElementById('auth-lang-en');
    const ruBtn = document.getElementById('auth-lang-ru');
    if (enBtn && ruBtn) {
      if (lang === 'en') {
        enBtn.style.background = '#2B55CC'; enBtn.style.color = '#fff'; enBtn.style.borderColor = '#2B55CC';
        ruBtn.style.background = 'transparent'; ruBtn.style.color = '#5A6A84'; ruBtn.style.borderColor = '#C4CFEA';
      } else {
        ruBtn.style.background = '#2B55CC'; ruBtn.style.color = '#fff'; ruBtn.style.borderColor = '#2B55CC';
        enBtn.style.background = 'transparent'; enBtn.style.color = '#5A6A84'; enBtn.style.borderColor = '#C4CFEA';
      }
    }
  }

  // Exposed to inline onclick handlers — must be set before any guard returns.
  window.setAuthLang = applyAuthLang;

  function t18n(key) {
    return (AUTH_I18N[authLang] || AUTH_I18N.en)[key] || key;
  }

  // ── CDN guard — show visible error and bail if Supabase didn't load ──────────

  function showCdnError() {
    // Inject a banner into the auth card so the user knows what's wrong
    document.addEventListener('DOMContentLoaded', () => {
      const card = document.querySelector('#auth-gate > div:not([style*="margin-top"])');
      if (!card) return;
      const banner = document.createElement('div');
      banner.style.cssText = 'background:#FFF0F0;border:1px solid #F5C6C6;border-radius:10px;padding:14px 16px;margin-bottom:12px;font-size:13px;color:#8B2020;line-height:1.5;font-family:\'DM Sans\',sans-serif;';
      banner.innerHTML = '⚠️ <strong>Could not connect to the server.</strong><br>Check your internet connection and reload the page. If this keeps happening, try a different browser or network.';
      card.prepend(banner);

      // Disable all auth action buttons gracefully
      ['email-signin-btn','email-signup-btn','google-signin-btn','try-guest-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) { btn.disabled = true; btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed'; }
      });
    });
  }

  const { createClient } = window.supabase || {};
  if (!createClient) {
    console.error('[Kinara] Supabase CDN not loaded. Make sure the supabase-js script tag appears before this file.');
    showCdnError();
    return;
  }

  if (typeof SUPA_URL === 'undefined' || typeof SUPA_KEY === 'undefined' || !SUPA_URL || !SUPA_KEY) {
    console.error('[Kinara] Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
    showCdnError();
    return;
  }

  // ── Supabase client ──────────────────────────────────────────────────────────

  const db = createClient(SUPA_URL, SUPA_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  let currentUserId = null;
  let signingOut = false;
  let appMounted = false;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function debounce(fn, ms) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  }

  // ── Auth Gate UI ─────────────────────────────────────────────────────────────

  function showAuthGate() {
    const el = document.getElementById('auth-gate');
    if (el) { el.style.display = 'flex'; switchView('signin'); }
  }

  function hideAuthGate() {
    const el = document.getElementById('auth-gate');
    if (el) el.style.display = 'none';
  }

  // ── Guest / Trial mode ──────────────────────────────────────────────────────

  window.__kinaraGuest = false;

  function launchGuestMode() {
    window.__kinaraGuest = true;
    window.__kinaraUserEmail = null;
    window.__kinaraGuestLang = authLang;
    mountReact({});
  }

  // ── Data Loading ─────────────────────────────────────────────────────────────

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);
  }

  async function loadUserData(userId) {
    switchView('loading');
    try {
      const [profileRes, plansRes, sessionsRes, restRes, schedRes] = await withTimeout(
        Promise.all([
          db.from('profiles').select('*').eq('id', userId).maybeSingle(),
          db.from('plans').select('*').eq('user_id', userId),
          db.from('sessions').select('*').eq('user_id', userId).order('logged_date', { ascending: false }),
          db.from('rest_days').select('logged_date').eq('user_id', userId),
          db.from('schedule').select('*').eq('user_id', userId).maybeSingle(),
        ]),
        12000
      );

      const p = profileRes.data;
      return {
        profileName:  p?.name  || 'My Profile',
        profileBio:   p?.bio   || '',
        profileGoal:  p?.goal  || 'general',
        profilePhoto: p?.photo || null,
        plans:       plansRes.data?.length    ? plansRes.data.map(r => r.data)    : null,
        sessions:    sessionsRes.data?.length ? sessionsRes.data.map(r => r.data) : [],
        restDaysLog: restRes.data?.map(r => r.logged_date) || [],
        schedule:    schedRes.data?.data || null,
      };
    } catch (e) {
      console.error('[Kinara] Failed to load user data:', e);
      return {};
    }
  }

  // ── Data Sync Helpers ─────────────────────────────────────────────────────────

  async function syncSessions(userId, sessions) {
    await db.from('sessions').delete().eq('user_id', userId);
    if (sessions.length) {
      const rows = sessions.map(s => ({ user_id: userId, logged_date: s.date, data: s }));
      const { error } = await db.from('sessions').insert(rows);
      if (error) throw error;
    }
  }

  async function syncRestDays(userId, restDaysLog) {
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
    await db.from('plans').delete().eq('user_id', userId);
    if (plans.length) {
      const rows = plans.map(p => ({ user_id: userId, data: p }));
      await db.from('plans').insert(rows);
    }
  }

  async function syncSchedule(userId, schedule) {
    await db.from('schedule').delete().eq('user_id', userId);
    await db.from('schedule').insert({ user_id: userId, data: schedule });
  }

  async function syncProfile(userId, profile) {
    await db.from('profiles').upsert(
      { id: userId, name: profile.profileName, bio: profile.profileBio, goal: profile.profileGoal, photo: profile.profilePhoto },
      { onConflict: 'id' }
    );
  }

  // ── Global API for React app ──────────────────────────────────────────────────

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
    if (window.__kinaraGuest || !currentUserId || signingOut) return;
    pendingCalls[key] = { uid: currentUserId, value };
    clearTimeout(pendingTimers[key]);
    pendingTimers[key] = setTimeout(async () => {
      const call = pendingCalls[key];
      delete pendingCalls[key];
      if (!call || signingOut) return;
      try { await syncFns[key](call.uid, call.value); }
      catch (e) { console.error(`[Kinara] Sync error [${key}]:`, e); }
    }, 900);
  };

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

  window.__kinaraSignOut = async () => {
    if (window.__kinaraGuest) { location.reload(); return; }
    signingOut = true;
    appMounted = false;
    await flushPendingSync();
    currentUserId = null;
    await db.auth.signOut();
    location.reload();
  };

  window.__kinaraUserEmail = null;

  // ── Auth state machine ────────────────────────────────────────────────────────

  function mountReact(data) {
    window.__kinaraData = data;
    hideAuthGate();
    if (typeof window.__mountApp === 'function') {
      window.__mountApp();
    } else {
      window.__kinaraReady = true;
    }
  }

  db.auth.onAuthStateChange(async (event, session) => {
    if (signingOut) return;

    if (session?.user) {
      currentUserId = session.user.id;
      window.__kinaraUserEmail = session.user.email || null;

      if (awaitingEmailConfirm && !session.user.email_confirmed_at) return;
      awaitingEmailConfirm = false;

      // Set appMounted BEFORE the await to prevent a race condition where a
      // second auth event during loadUserData triggers a double-mount.
      if (!appMounted) {
        appMounted = true;
        const data = await loadUserData(session.user.id);
        mountReact(data);
      }
    } else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
      currentUserId = null;
      window.__kinaraUserEmail = null;
      appMounted = false;
      showAuthGate();
    }
  });

  // ── Google Sign-In ────────────────────────────────────────────────────────────

  async function signInWithGoogle() {
    const btn = document.getElementById('google-signin-btn');
    if (btn) { btn.disabled = true; btn.textContent = t18n('redirecting'); }
    await db.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
  }

  // ── Email/Password Auth ────────────────────────────────────────────────────

  function showError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  }

  let lastSignupEmail = '';
  let awaitingEmailConfirm = false;

  function switchView(view) {
    const signIn    = document.getElementById('auth-signin-view');
    const signUp    = document.getElementById('auth-signup-view');
    const confirm   = document.getElementById('auth-confirm-view');
    const loadingEl = document.getElementById('auth-loading-view');
    const subtitle  = document.getElementById('auth-loading');

    if (signIn)    signIn.style.display    = 'none';
    if (signUp)    signUp.style.display    = 'none';
    if (confirm)   confirm.style.display   = 'none';
    if (loadingEl) loadingEl.style.display = 'none';

    if (view === 'signup') {
      if (signUp) signUp.style.display = 'flex';
      if (subtitle) subtitle.textContent = t18n('subtitleSignup');
    } else if (view === 'confirm') {
      if (confirm) confirm.style.display = 'flex';
      if (subtitle) subtitle.textContent = t18n('subtitleConfirm');
      clearOtpInputs();
      showError('otp-error', '');
      setTimeout(() => { const first = document.querySelector('.otp-digit'); if (first) first.focus(); }, 100);
    } else if (view === 'loading') {
      if (loadingEl) loadingEl.style.display = 'flex';
      if (subtitle) subtitle.textContent = t18n('loading');
    } else {
      if (signIn) signIn.style.display = 'flex';
      if (subtitle) subtitle.textContent = t18n('subtitle');
      awaitingEmailConfirm = false;
    }
    showError('auth-error', '');
    showError('signup-error', '');
  }

  async function signInWithEmail() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const pass  = document.getElementById('auth-password')?.value;
    if (!email || !pass) { showError('auth-error', t18n('enterBoth')); return; }

    showError('auth-error', '');
    const btn = document.getElementById('email-signin-btn');
    if (btn) { btn.disabled = true; btn.textContent = t18n('signingIn'); }

    const { error } = await db.auth.signInWithPassword({ email, password: pass });
    if (error) {
      showError('auth-error', error.message);
      if (btn) { btn.disabled = false; btn.textContent = t18n('signInBtn'); }
    } else {
      switchView('loading');
    }
  }

  async function signUpWithEmail() {
    const email   = document.getElementById('signup-email')?.value?.trim();
    const confirm = document.getElementById('signup-email-confirm')?.value?.trim();
    const pass    = document.getElementById('signup-password')?.value;

    if (!email || !confirm || !pass) { showError('signup-error', t18n('fillAll')); return; }
    if (email.toLowerCase() !== confirm.toLowerCase()) { showError('signup-error', t18n('emailMismatch')); return; }
    if (pass.length < 6) { showError('signup-error', t18n('passMin')); return; }

    showError('signup-error', '');
    const btn = document.getElementById('email-signup-btn');
    if (btn) { btn.disabled = true; btn.textContent = t18n('creatingAccount'); }

    const { data, error } = await db.auth.signUp({
      email,
      password: pass,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    if (error) {
      showError('signup-error', error.message);
      if (btn) { btn.disabled = false; btn.textContent = t18n('createAccountBtn'); }
    } else if (data?.session) {
      // Auto-confirmed — onAuthStateChange handles mount
    } else {
      lastSignupEmail = email;
      awaitingEmailConfirm = true;
      const display = document.getElementById('confirm-email-display');
      if (display) display.textContent = email;
      switchView('confirm');
    }
  }

  async function resendConfirmation() {
    if (!lastSignupEmail) return;
    const link = document.getElementById('resend-confirm-link');
    if (link) link.textContent = t18n('resending');
    const { error } = await db.auth.resend({ type: 'signup', email: lastSignupEmail });
    if (link) link.textContent = error ? t18n('resendFail') : t18n('resent');
    if (!error) setTimeout(() => { if (link) link.textContent = t18n('resendEmail'); }, 4000);
  }

  // ── OTP Input Behavior ─────────────────────────────────────────────────────

  function getOtpCode() {
    return Array.from(document.querySelectorAll('.otp-digit')).map(i => i.value).join('');
  }

  function updateVerifyButton() {
    const btn = document.getElementById('verify-otp-btn');
    const code = getOtpCode();
    if (btn) {
      const ready = code.length === 8;
      btn.disabled = !ready;
      btn.style.background = ready ? '#2B55CC' : '#C4CFEA';
      btn.style.cursor = ready ? 'pointer' : 'not-allowed';
    }
  }

  function clearOtpInputs() {
    document.querySelectorAll('.otp-digit').forEach(i => {
      i.value = '';
      i.classList.remove('otp-filled');
    });
    updateVerifyButton();
  }

  function shakeOtpInputs() {
    document.querySelectorAll('.otp-digit').forEach(i => {
      i.classList.remove('otp-error-shake');
      void i.offsetWidth;
      i.classList.add('otp-error-shake');
      i.style.borderColor = '#D9534F';
    });
    setTimeout(() => {
      document.querySelectorAll('.otp-digit').forEach(i => {
        i.classList.remove('otp-error-shake');
        i.style.borderColor = '';
      });
    }, 600);
  }

  function setupOtpInputs() {
    const digits = document.querySelectorAll('.otp-digit');
    digits.forEach((input, idx) => {
      input.addEventListener('input', () => {
        const val = input.value.replace(/\D/g, '');
        input.value = val.charAt(0) || '';
        input.classList.toggle('otp-filled', !!input.value);
        if (val && idx < digits.length - 1) digits[idx + 1].focus();
        updateVerifyButton();
        if (getOtpCode().length === 8) verifyOtp();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          digits[idx - 1].focus();
          digits[idx - 1].value = '';
          digits[idx - 1].classList.remove('otp-filled');
          updateVerifyButton();
        }
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 8);
        pasted.split('').forEach((ch, i) => {
          if (digits[i]) { digits[i].value = ch; digits[i].classList.toggle('otp-filled', true); }
        });
        const focusIdx = Math.min(pasted.length, digits.length - 1);
        digits[focusIdx].focus();
        updateVerifyButton();
        if (pasted.length === 8) verifyOtp();
      });
    });
  }

  async function verifyOtp() {
    const code = getOtpCode();
    if (code.length !== 8 || !lastSignupEmail) return;

    showError('otp-error', '');
    const btn = document.getElementById('verify-otp-btn');
    if (btn) { btn.disabled = true; btn.textContent = t18n('verifying'); }

    const { error } = await db.auth.verifyOtp({ email: lastSignupEmail, token: code, type: 'email' });

    if (error) {
      shakeOtpInputs();
      clearOtpInputs();
      const isExpired = error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('invalid');
      showError('otp-error', isExpired ? t18n('otpInvalid') : error.message);
      if (btn) { btn.disabled = true; btn.style.background = '#C4CFEA'; btn.style.cursor = 'not-allowed'; btn.textContent = t18n('verifyBtn'); }
      const first = document.querySelector('.otp-digit');
      if (first) first.focus();
    }
  }

  // ── Bind buttons on DOMContentLoaded ───────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    setupOtpInputs();

    document.getElementById('google-signin-btn')
      ?.addEventListener('click', signInWithGoogle);
    document.getElementById('email-signin-btn')
      ?.addEventListener('click', signInWithEmail);
    document.getElementById('email-signup-btn')
      ?.addEventListener('click', signUpWithEmail);

    document.getElementById('show-signup-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signup'); });
    document.getElementById('show-signin-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signin'); });
    document.getElementById('back-to-signin-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); switchView('signin'); });
    document.getElementById('resend-confirm-link')
      ?.addEventListener('click', (e) => { e.preventDefault(); resendConfirmation(); });
    document.getElementById('verify-otp-btn')
      ?.addEventListener('click', verifyOtp);

    document.getElementById('auth-password')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') signInWithEmail(); });
    document.getElementById('signup-password')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') signUpWithEmail(); });
    document.getElementById('signup-email-confirm')
      ?.addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('signup-password')?.focus(); });

    document.getElementById('try-guest-btn')
      ?.addEventListener('click', launchGuestMode);
  });
})();
