const { useEffect, useMemo, useRef, useState } = React;

const DARK = {
  bg: "#070707",
  surface: "#0C0C0C",
  card: "#111111",
  primary: "#C4826A",
  textPrimary: "#EBEBEB",
  textSecondary: "#5A5A5A",
  textMuted: "#2C2C2C",
  success: "#4E7D4E",
  purple: "#6E64B0",
  gold: "#C9A84C",
  danger: "#D46A6A",
};

const LIGHT = {
  bg: "#EDF0FA",
  surface: "#FFFFFF",
  card: "#F5F7FF",
  primary: "#2B55CC",
  textPrimary: "#0D1B36",
  textSecondary: "#5A6A84",
  textMuted: "#A8B6CC",
  success: "#4E7D4E",
  purple: "#6E64B0",
  gold: "#C9A84C",
  danger: "#D46A6A",
};

const TR = {
  en: {
    home: "Dashboard",
    plans: "Plans",
    log: "Log Workout",
    rest: "Rest Day",
    calendar: "Calendar",
    progress: "Progress",
    settings: "Settings",
    morning: "Good Morning, Alex.",
    noActivity: "No activity logged today — rest days count toward your streak too.",
    logRest: "Log Rest Day",
    dismiss: "Dismiss",
    activeSession: "Active Session",
    finishWorkout: "Finish Workout",
    warmup: "Warm-up Complete",
    trainingLoad: "Training Load",
  },
  ru: {
    home: "Дашборд",
    plans: "Планы",
    log: "Лог тренировки",
    rest: "День отдыха",
    calendar: "Календарь",
    progress: "Прогресс",
    settings: "Настройки",
    morning: "Доброе утро, Алекс.",
    noActivity: "Сегодня нет активности — дни отдыха тоже идут в стрик.",
    logRest: "Отметить отдых",
    dismiss: "Скрыть",
    activeSession: "Активная сессия",
    finishWorkout: "Завершить тренировку",
    warmup: "Разминка завершена",
    trainingLoad: "Тренировочная нагрузка",
  },
};

const DEFAULT_PLANS = [
  {
    id: "push-a",
    name: "Push Day A",
    panel: "push",
    accent: "#C4826A",
    warmup: { enabled: true, duration: 300 },
    notes: "Chest and shoulder focus",
    exercises: [
      { id: "bench", name: "Bench Press", sets: 4, reps: 8, rest: 90 },
      { id: "incline", name: "Incline DB Press", sets: 3, reps: 8, rest: 75 },
      { id: "ohp", name: "Overhead Press", sets: 4, reps: 6, rest: 90 },
      { id: "lateral", name: "Lateral Raises", sets: 3, reps: 15, rest: 60 },
    ],
  },
  {
    id: "pull-b",
    name: "Pull Day B",
    panel: "pull",
    accent: "#6E64B0",
    warmup: { enabled: true, duration: 300 },
    notes: "Back hypertrophy",
    exercises: [
      { id: "dead", name: "Deadlift", sets: 3, reps: 5, rest: 120 },
      { id: "row", name: "Barbell Row", sets: 4, reps: 8, rest: 90 },
      { id: "pulldown", name: "Lat Pulldown", sets: 3, reps: 10, rest: 75 },
    ],
  },
  {
    id: "legs",
    name: "Leg Day",
    panel: "legs",
    accent: "#4E7D4E",
    warmup: { enabled: true, duration: 360 },
    notes: "Compounds first",
    exercises: [
      { id: "squat", name: "Squat", sets: 4, reps: 6, rest: 120 },
      { id: "rdl", name: "RDL", sets: 4, reps: 8, rest: 90 },
      { id: "legcurl", name: "Leg Curl", sets: 3, reps: 12, rest: 60 },
    ],
  },
];

const PANEL_GRADIENT = {
  push: "linear-gradient(120deg, rgba(196,130,106,0.16), rgba(196,130,106,0.02))",
  pull: "linear-gradient(120deg, rgba(110,100,176,0.16), rgba(110,100,176,0.02))",
  legs: "linear-gradient(120deg, rgba(78,125,78,0.16), rgba(78,125,78,0.02))",
  upper: "linear-gradient(120deg, rgba(43,85,204,0.16), rgba(43,85,204,0.02))",
};

const memStore = {};
const storage = {
  async getItem(key) {
    if (window.storage?.getItem) return window.storage.getItem(key);
    return memStore[key] ?? null;
  },
  async setItem(key, value) {
    if (window.storage?.setItem) return window.storage.setItem(key, value);
    memStore[key] = value;
  },
};

function playBeeps() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  [0, 0.2, 0.4].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 1046;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.1);
  });
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatShort(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function LogoMark({ colors }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1" y="1" width="20" height="20" rx="4" stroke={colors.textMuted} />
      <path d="M11 4L18 11L11 18L4 11L11 4Z" stroke={colors.primary} strokeWidth="1.4" />
      <circle cx="11" cy="11" r="1.7" fill={colors.primary} />
    </svg>
  );
}

function BurgerBtn({ open, onClick, colors }) {
  const line = { width: 14, height: 1.6, background: colors.textSecondary, transition: "0.18s" };
  return (
    <button onClick={onClick} style={iconBtn(colors)}>
      <div style={{ ...line, transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
      <div style={{ ...line, opacity: open ? 0 : 1 }} />
      <div style={{ ...line, transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
    </button>
  );
}

function Toggle({ value, onChange, colors }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: 46, height: 24, borderRadius: 999, border: `1px solid ${colors.textMuted}`, background: value ? colors.primary : colors.surface, position: "relative" }}>
      <div style={{ position: "absolute", top: 2, left: value ? 24 : 2, width: 18, height: 18, borderRadius: 999, background: "#fff", transition: "0.15s" }} />
    </button>
  );
}

function Divider({ colors }) {
  return <div style={{ borderTop: `1px solid ${colors.textMuted}33`, margin: "14px 0" }} />;
}

function SLabel({ colors, children }) {
  return <div style={{ fontSize: 11, letterSpacing: 2.4, textTransform: "uppercase", color: colors.textSecondary }}>{children}</div>;
}

function DRow({ colors, title, subtitle, right, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: onClick ? "pointer" : "default" }}>
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right || <span style={{ color: colors.textSecondary }}>›</span>}
    </div>
  );
}

function KinaraApp() {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("log");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [sessions, setSessions] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [restLogged, setRestLogged] = useState(false);
  const [todayLogged, setTodayLogged] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPR, setShowPR] = useState(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const t = TR[lang];
  const C = theme === "dark" ? DARK : LIGHT;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');
      *{box-sizing:border-box}
      body{margin:0;background:${C.bg};color:${C.textPrimary};font-family:'DM Sans',system-ui,sans-serif}
      input,button,textarea,select{font:inherit}
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [theme]);

  useEffect(() => {
    (async () => {
      const raw = await storage.getItem("kinara_state_v2");
      if (!raw) return;
      const s = JSON.parse(raw);
      setTheme(s.theme || "dark");
      setLang(s.lang || "en");
      setPlans(s.plans || DEFAULT_PLANS);
      setSessions(s.sessions || []);
      setRestLogged(!!s.restLogged);
      setTodayLogged(!!s.todayLogged);
    })();
  }, []);

  useEffect(() => {
    storage.setItem(
      "kinara_state_v2",
      JSON.stringify({ theme, lang, plans, sessions, restLogged, todayLogged })
    );
  }, [theme, lang, plans, sessions, restLogged, todayLogged]);

  useEffect(() => {
    if (!activeWorkout) return;
    const id = setInterval(() => {
      setActiveWorkout((w) => {
        if (!w) return null;
        const nx = { ...w, elapsed: w.elapsed + 1 };
        if (nx.warmup.enabled && !nx.warmup.done && nx.warmup.remaining > 0) {
          nx.warmup = { ...nx.warmup, remaining: nx.warmup.remaining - 1 };
        }
        if (nx.restTimer) {
          const rem = nx.restTimer.remaining - 1;
          nx.restTimer = rem <= 0 ? null : { ...nx.restTimer, remaining: rem };
          if (rem <= 0) playBeeps();
        }
        return nx;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [activeWorkout]);

  const stats = useMemo(() => {
    const totalVol = sessions.reduce((a, s) => a + s.totalVolume, 0);
    const maxes = {};
    sessions.forEach((s) => s.exercises.forEach((e) => {
      maxes[e.name] = Math.max(maxes[e.name] || 0, ...e.sets.map((ss) => Number(ss.weight || 0) || 0));
    }));
    return { totalVol, maxes };
  }, [sessions]);

  function startWorkout(planId) {
    const p = plans.find((x) => x.id === planId);
    if (!p) return;
    setTab("log");
    setActiveWorkout({
      planId: p.id,
      planName: p.name,
      elapsed: 0,
      warmup: { enabled: p.warmup.enabled, done: !p.warmup.enabled, remaining: p.warmup.duration, duration: p.warmup.duration },
      exercises: p.exercises.map((ex) => ({
        ...ex,
        sets: Array.from({ length: ex.sets }, () => ({ reps: ex.reps, weight: "", done: false })),
      })),
      currentExIdx: 0,
      restTimer: null,
      note: "",
      paused: false,
    });
  }

  function toggleSet(exIndex, setIndex) {
    setActiveWorkout((w) => {
      if (!w) return null;
      const exercises = w.exercises.map((ex, i) => {
        if (i !== exIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((ss, j) => (j === setIndex ? { ...ss, done: !ss.done } : ss)),
        };
      });
      const rest = exercises[exIndex].rest;
      if (navigator.vibrate) navigator.vibrate(20);
      return { ...w, exercises, currentExIdx: exIndex, restTimer: { remaining: rest, total: rest, exIdx: exIndex } };
    });
  }

  function finishWorkout() {
    if (!activeWorkout) return;
    const newSession = {
      id: uid(),
      date: new Date().toISOString(),
      planName: activeWorkout.planName,
      duration: activeWorkout.elapsed,
      note: activeWorkout.note,
      exercises: activeWorkout.exercises,
      totalVolume: activeWorkout.exercises.reduce((a, ex) => a + ex.sets.reduce((s, st) => s + ((st.done ? 1 : 0) * (Number(st.reps) || 0) * (Number(st.weight) || 0)), 0), 0),
    };
    const prs = [];
    newSession.exercises.forEach((ex) => {
      const m = Math.max(...ex.sets.map((st) => Number(st.weight || 0) || 0), 0);
      if (m > (stats.maxes[ex.name] || 0)) prs.push({ exercise: ex.name, weight: m });
    });
    setSessions((p) => [newSession, ...p]);
    setActiveWorkout(null);
    setTodayLogged(true);
    if (prs.length) setShowPR(prs);
  }

  function markRest() {
    setRestLogged(true);
    setTodayLogged(true);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ plans, sessions, theme, lang, restLogged, todayLogged }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kinara-backup.json";
    a.click();
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(String(reader.result || "{}"));
      if (Array.isArray(data.plans)) setPlans(data.plans);
      if (Array.isArray(data.sessions)) setSessions(data.sessions);
      if (data.theme) setTheme(data.theme);
      if (data.lang) setLang(data.lang);
      if (typeof data.restLogged === "boolean") setRestLogged(data.restLogged);
      if (typeof data.todayLogged === "boolean") setTodayLogged(data.todayLogged);
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary }}>
      <TopStrip C={C} />
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 46px)" }}>
        <Sidebar C={C} tab={tab} setTab={setTab} t={t} onSettings={() => setShowSettings(true)} />
        <main style={{ padding: "12px 18px 20px", position: "relative" }}>
          <Header C={C} t={t} activeWorkout={activeWorkout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onSettings={() => setShowSettings(true)} />

          {!todayLogged && !nudgeDismissed && (
            <div style={{ border: `1px solid ${C.primary}44`, borderRadius: 10, padding: "12px 16px", background: "linear-gradient(90deg, rgba(196,130,106,0.14), transparent)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ color: C.textSecondary }}>{t.noActivity}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={markRest} style={solidBtn(C)}>{t.logRest}</button>
                <button onClick={() => setNudgeDismissed(true)} style={ghostBtn(C)}>{t.dismiss}</button>
              </div>
            </div>
          )}

          {tab === "home" && <HomeTab C={C} sessions={sessions} plans={plans} startWorkout={startWorkout} />}
          {tab === "plans" && <PlansTab C={C} plans={plans} setPlans={setPlans} startWorkout={startWorkout} />}
          {tab === "log" && <LogTab C={C} t={t} plans={plans} activeWorkout={activeWorkout} setActiveWorkout={setActiveWorkout} startWorkout={startWorkout} toggleSet={toggleSet} finishWorkout={finishWorkout} />}
          {tab === "rest" && <RestTab C={C} restLogged={restLogged} markRest={markRest} />}
          {tab === "calendar" && <CalendarTab C={C} sessions={sessions} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />}
          {tab === "progress" && <ProgressTab C={C} sessions={sessions} t={t} />}

          {showSettings && (
            <SettingsDrawer
              C={C}
              onClose={() => setShowSettings(false)}
              theme={theme}
              setTheme={setTheme}
              lang={lang}
              setLang={setLang}
              exportData={exportData}
              importData={importData}
              plans={plans}
              markRest={markRest}
            />
          )}
        </main>
      </div>
      {showPR && <PRModal C={C} prs={showPR} onClose={() => setShowPR(null)} />}
    </div>
  );
}

function TopStrip({ C }) {
  return (
    <div style={{ height: 46, borderBottom: `1px solid ${C.textMuted}33`, background: "#2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#E8E8E8" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={topIcon}>◉</button>
          <button style={topIcon}>‹/›</button>
        </div>
        <span>Kinara v4 · JSX</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={topBtn}>Copy ▾</button>
        <button style={topIcon}>↻</button>
        <button style={topIcon}>✕</button>
      </div>
    </div>
  );
}

const topIcon = { border: "1px solid #4D4D4D", background: "#1E1E1E", color: "#D1D1D1", borderRadius: 8, padding: "5px 8px", cursor: "pointer" };
const topBtn = { ...topIcon, padding: "7px 12px" };

function Sidebar({ C, tab, setTab, t, onSettings }) {
  const nav = [
    ["home", t.home],
    ["plans", t.plans],
    ["log", t.log],
    ["rest", t.rest],
    ["calendar", t.calendar],
    ["progress", t.progress],
  ];
  return (
    <aside style={{ borderRight: `1px solid ${C.textMuted}33`, background: "#090A0B", padding: 14, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <LogoMark colors={C} />
        <div>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 36, letterSpacing: 1, lineHeight: 0.9 }}>KINARA</div>
          <div style={{ color: C.textSecondary, fontSize: 13 }}>Workout Planner</div>
        </div>
      </div>
      <SLabel colors={C}>Menu</SLabel>
      <div style={{ marginTop: 8 }}>
        {nav.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ width: "100%", marginBottom: 4, textAlign: "left", border: 0, cursor: "pointer", borderRadius: 10, padding: "10px 12px", background: tab === k ? "linear-gradient(90deg, rgba(196,130,106,.32), rgba(196,130,106,.06))" : "transparent", color: tab === k ? "#FFB99D" : C.textSecondary }}>
            {label}
          </button>
        ))}
      </div>
      <Divider colors={C} />
      <button onClick={onSettings} style={{ ...ghostBtn(C), width: "100%", textAlign: "left", margin: 0 }}>Settings</button>
      <div style={{ marginTop: "auto", padding: 12, borderRadius: 12, background: C.card, border: `1px solid ${C.textMuted}33`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700 }}>A</div>
        <div>
          <div style={{ fontWeight: 700 }}>Alex Rivera</div>
          <div style={{ fontSize: 12, color: C.textSecondary }}>Pro · 12 streak</div>
        </div>
      </div>
    </aside>
  );
}

function Header({ C, t, activeWorkout, menuOpen, setMenuOpen, onSettings }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.textMuted}22`, marginBottom: 14, paddingBottom: 10 }}>
      <div style={{ color: C.textSecondary, fontSize: 13 }}>Saturday, February 28</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 48, fontFamily: "Barlow Condensed", lineHeight: 0.9 }}>{t.morning}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ border: `1px solid ${C.primary}66`, borderRadius: 12, padding: "7px 12px", color: "#FF9F84", fontFamily: "JetBrains Mono" }}>◉ {formatShort(activeWorkout?.elapsed || 7)}</div>
          <button style={iconBtn(C)} onClick={onSettings}>🔔</button>
          <BurgerBtn open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} colors={C} />
        </div>
      </div>
    </div>
  );
}

function HomeTab({ C, sessions, plans, startWorkout }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 }}>
        <Metric C={C} label="Sessions" value={sessions.length} tone={C.primary} />
        <Metric C={C} label="Plans" value={plans.length} tone={C.purple} />
        <Metric C={C} label="Volume" value={Math.round(sessions.reduce((a, s) => a + s.totalVolume, 0))} tone={C.success} />
        <Metric C={C} label="PRs" value={sessions.length ? 7 : 0} tone={C.gold} />
      </div>
      <Card C={C}>
        <SLabel colors={C}>Quick Start</SLabel>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {plans.map((p) => <button key={p.id} onClick={() => startWorkout(p.id)} style={solidBtn(C)}>{p.name}</button>)}
        </div>
      </Card>
    </div>
  );
}

function Metric({ C, label, value, tone }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.textMuted}33`, borderRadius: 16, padding: 14 }}>
      <div style={{ color: C.textSecondary, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 46, fontFamily: "Barlow Condensed", lineHeight: 0.9, color: tone }}>{value}</div>
    </div>
  );
}

function PlansTab({ C, plans, setPlans, startWorkout }) {
  const [selected, setSelected] = useState(null);
  const plan = plans.find((p) => p.id === selected);

  if (!plan) {
    return (
      <div>
        <button onClick={() => setPlans((all) => [...all, { id: uid(), name: `New Plan ${all.length + 1}`, panel: "upper", accent: C.primary, warmup: { enabled: true, duration: 300 }, notes: "", exercises: [{ id: uid(), name: "Exercise", sets: 3, reps: 10, rest: 60 }] }])} style={solidBtn(C)}>New Plan</button>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {plans.map((p) => (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{ background: PANEL_GRADIENT[p.panel] || C.card, border: `1px solid ${p.accent}55`, borderRadius: 16, padding: 16, cursor: "pointer" }}>
              <div style={{ fontFamily: "Barlow Condensed", fontSize: 36, lineHeight: 0.95 }}>{p.name}</div>
              <div style={{ color: C.textSecondary }}>{p.exercises.length} exercises</div>
              <div style={{ color: C.textSecondary, marginTop: 8 }}>{p.notes || "No notes"}</div>
              <button onClick={(e) => { e.stopPropagation(); startWorkout(p.id); }} style={{ ...solidBtn(C), marginTop: 10 }}>Start</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card C={C}>
      <button onClick={() => setSelected(null)} style={ghostBtn(C)}>← Back</button>
      <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
        <input value={plan.name} onChange={(e) => setPlans((all) => all.map((p) => p.id === plan.id ? { ...p, name: e.target.value } : p))} style={inputStyle(C)} />
        <textarea value={plan.notes} onChange={(e) => setPlans((all) => all.map((p) => p.id === plan.id ? { ...p, notes: e.target.value } : p))} style={{ ...inputStyle(C), minHeight: 70 }} />
      </div>
      <div style={{ marginTop: 10 }}>
        {plan.exercises.map((ex, i) => (
          <div key={ex.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px auto", gap: 6, marginBottom: 6 }}>
            <input value={ex.name} onChange={(e) => patchEx(setPlans, plan.id, ex.id, { name: e.target.value })} style={inputStyle(C)} />
            <input type="number" value={ex.sets} onChange={(e) => patchEx(setPlans, plan.id, ex.id, { sets: Number(e.target.value) || 1 })} style={inputStyle(C)} />
            <input type="number" value={ex.reps} onChange={(e) => patchEx(setPlans, plan.id, ex.id, { reps: Number(e.target.value) || 1 })} style={inputStyle(C)} />
            <input type="number" value={ex.rest} onChange={(e) => patchEx(setPlans, plan.id, ex.id, { rest: Number(e.target.value) || 0 })} style={inputStyle(C)} />
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => moveEx(setPlans, plan.id, i, -1)} style={ghostBtn(C)}>↑</button>
              <button onClick={() => moveEx(setPlans, plan.id, i, 1)} style={ghostBtn(C)}>↓</button>
              <button onClick={() => removeEx(setPlans, plan.id, ex.id)} style={ghostBtn(C)}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setPlans((all) => all.map((p) => p.id === plan.id ? { ...p, exercises: [...p.exercises, { id: uid(), name: "Exercise", sets: 3, reps: 10, rest: 60 }] } : p))} style={solidBtn(C)}>Add Exercise</button>
    </Card>
  );
}

function LogTab({ C, t, plans, activeWorkout, setActiveWorkout, startWorkout, toggleSet, finishWorkout }) {
  if (!activeWorkout) {
    return (
      <Card C={C}>
        <SLabel colors={C}>Choose plan</SLabel>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>{plans.map((p) => <button key={p.id} onClick={() => startWorkout(p.id)} style={solidBtn(C)}>{p.name}</button>)}</div>
      </Card>
    );
  }

  const totalSets = activeWorkout.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = activeWorkout.exercises.reduce((a, e) => a + e.sets.filter((x) => x.done).length, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.45fr 0.85fr", gap: 14 }}>
      <div>
        <SLabel colors={C}>{t.activeSession}</SLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 64, lineHeight: 0.9 }}>{activeWorkout.planName}</div>
          <select value={activeWorkout.planId} onChange={(e) => startWorkout(e.target.value)} style={{ ...inputStyle(C), width: 140 }}>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <Card C={C}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b>{t.warmup}</b><span style={{ color: C.success }}>{activeWorkout.warmup.done || activeWorkout.warmup.remaining === 0 ? "✓" : formatShort(activeWorkout.warmup.remaining)}</span></div>
          <Progress value={activeWorkout.warmup.done ? 100 : ((activeWorkout.warmup.duration - activeWorkout.warmup.remaining) / activeWorkout.warmup.duration) * 100} C={C} />
          {!activeWorkout.warmup.done && <button onClick={() => setActiveWorkout((w) => ({ ...w, warmup: { ...w.warmup, done: true } }))} style={{ ...ghostBtn(C), marginTop: 8 }}>Mark done</button>}
        </Card>

        <Card C={C}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b>Overall Progress</b><span style={{ color: C.textSecondary }}>{doneSets}/{totalSets} sets</span></div>
          <Progress value={(doneSets / Math.max(totalSets, 1)) * 100} C={C} />
        </Card>

        {activeWorkout.exercises.map((ex, i) => {
          const done = ex.sets.every((s) => s.done);
          const active = i === activeWorkout.currentExIdx;
          return (
            <div key={ex.id} style={{ background: active ? "rgba(196,130,106,0.12)" : C.card, border: `1px solid ${done ? C.success : active ? C.primary : C.textMuted}66`, borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 32, fontFamily: "Barlow Condensed", lineHeight: 0.9 }}>{ex.name} {active && <span style={{ fontSize: 13, border: `1px solid ${C.primary}`, borderRadius: 999, padding: "2px 8px", color: "#FFB69D" }}>ACTIVE</span>} {done && <span style={{ fontSize: 13, border: `1px solid ${C.success}`, borderRadius: 999, padding: "2px 8px", color: "#7FD287" }}>DONE</span>}</div>
                <span style={{ color: C.textSecondary }}>{ex.sets.length} sets</span>
              </div>
              {ex.sets.map((s, j) => (
                <div key={j} style={{ display: "grid", gridTemplateColumns: "28px 54px 40px 56px 20px 1fr", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: C.textSecondary, fontSize: 12 }}>S{j + 1}</span>
                  <input value={s.reps} onChange={(e) => patchSet(setActiveWorkout, i, j, { reps: e.target.value })} style={{ ...inputStyle(C), textAlign: "center", padding: "7px 4px" }} />
                  <span style={{ color: C.textMuted, fontSize: 12 }}>reps</span>
                  <input value={s.weight} onChange={(e) => patchSet(setActiveWorkout, i, j, { weight: e.target.value })} placeholder="kg" style={{ ...inputStyle(C), textAlign: "center", padding: "7px 4px" }} />
                  <span style={{ color: C.textMuted, fontSize: 12 }}>kg</span>
                  <input type="checkbox" checked={s.done} onChange={() => toggleSet(i, j)} />
                </div>
              ))}
              {activeWorkout.restTimer && activeWorkout.restTimer.exIdx === i && (
                <div style={{ marginTop: 8, background: "#050607", border: `1px solid ${C.gold}77`, borderRadius: 10, padding: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>⏱ Rest Timer</span><b>{formatShort(activeWorkout.restTimer.remaining)}</b></div>
                  <Progress value={(activeWorkout.restTimer.remaining / activeWorkout.restTimer.total) * 100} C={C} reverse />
                </div>
              )}
            </div>
          );
        })}

        <textarea value={activeWorkout.note} onChange={(e) => setActiveWorkout((w) => ({ ...w, note: e.target.value }))} placeholder="Workout notes" style={{ ...inputStyle(C), width: "100%", minHeight: 70 }} />
        <button onClick={finishWorkout} style={{ ...solidBtn(C), width: "100%", marginTop: 10, fontWeight: 700 }}>{t.finishWorkout}</button>
      </div>

      <div>
        <Card C={C}>
          <SLabel colors={C}>Session Time</SLabel>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 74, lineHeight: 1, margin: "8px 0 12px" }}>{formatTime(activeWorkout.elapsed)}</div>
          <button onClick={() => setActiveWorkout((w) => ({ ...w, paused: !w.paused }))} style={{ ...solidBtn(C), width: "100%" }}>{activeWorkout.paused ? "Resume" : "Pause"}</button>
        </Card>

        <Card C={C}>
          <SLabel colors={C}>Exercise Time</SLabel>
          {activeWorkout.exercises.map((e, i) => <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.textMuted}22`, color: i === activeWorkout.currentExIdx ? "#A9EEA6" : C.textSecondary }}><span>{e.name}</span><span>{i === activeWorkout.currentExIdx ? formatTime(activeWorkout.elapsed) : "--:--"}</span></div>)}
        </Card>

        <Card C={C}>
          <i style={{ color: C.textSecondary }}>“Push yourself because no one else is going to do it for you.”</i>
        </Card>
      </div>
    </div>
  );
}

function RestTab({ C, restLogged, markRest }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Card C={C}>
        <SLabel colors={C}>Recovery</SLabel>
        <div style={{ fontFamily: "Barlow Condensed", fontSize: 48 }}>{restLogged ? "Rest Logged" : "No Rest Logged"}</div>
        <button onClick={markRest} style={solidBtn(C)}>Log Rest Day</button>
      </Card>
      <Card C={C}>
        <SLabel colors={C}>Facts</SLabel>
        <ul style={{ color: C.textSecondary }}>
          <li>7-9h sleep speeds muscle repair.</li>
          <li>Hydration improves recovery quality.</li>
          <li>Low-intensity cardio reduces soreness.</li>
        </ul>
      </Card>
    </div>
  );
}

function CalendarTab({ C, sessions, selectedMonth, setSelectedMonth, selectedDay, setSelectedDay }) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const first = new Date(year, month, 1).getDay();
  const byDay = {};
  sessions.forEach((s) => {
    const d = new Date(s.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      byDay[d.getDate()] = byDay[d.getDate()] || [];
      byDay[d.getDate()].push(s);
    }
  });
  return (
    <Card C={C}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setSelectedMonth(new Date(year, month - 1, 1))} style={ghostBtn(C)}>◀</button>
        <div style={{ fontFamily: "Barlow Condensed", fontSize: 42 }}>{selectedMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <button onClick={() => setSelectedMonth(new Date(year, month + 1, 1))} style={ghostBtn(C)}>▶</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {Array.from({ length: first }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
          <button key={d} onClick={() => setSelectedDay(d)} style={{ border: `1px solid ${byDay[d] ? C.primary : C.textMuted}44`, background: selectedDay === d ? "rgba(196,130,106,.2)" : C.surface, color: C.textPrimary, borderRadius: 8, padding: "8px 0" }}>{d}</button>
        ))}
      </div>
      <Divider colors={C} />
      <SLabel colors={C}>Session Details</SLabel>
      {selectedDay && byDay[selectedDay]?.length ? byDay[selectedDay].map((s) => <div key={s.id} style={{ padding: "8px 0" }}>{s.planName} · {formatTime(s.duration)} · {Math.round(s.totalVolume)}kg vol</div>) : <div style={{ color: C.textSecondary, marginTop: 8 }}>No sessions selected day</div>}
    </Card>
  );
}

function ProgressTab({ C, sessions, t }) {
  const [mode, setMode] = useState("load");
  const loadData = sessions.slice(0, 8).reverse().map((s, i) => ({
    x: i,
    atl: Math.min(90, (s.totalVolume / 24) + 28),
    ctl: Math.min(85, (s.totalVolume / 30) + 24),
    tsb: 58 - Math.min(35, (s.totalVolume / 38)),
  }));
  while (loadData.length < 8) {
    const i = loadData.length;
    loadData.push({ x: i, atl: 35 + i * 6, ctl: 30 + i * 5, tsb: 54 - i * 3 });
  }

  return (
    <div>
      <SLabel colors={C}>Your</SLabel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "Barlow Condensed", fontSize: 70, lineHeight: 0.9 }}>Progress & Analytics</div>
        <div style={{ display: "flex", background: C.card, border: `1px solid ${C.textMuted}33`, borderRadius: 14, padding: 4 }}>
          {["overview", "strength", "load"].map((m) => <button key={m} onClick={() => setMode(m)} style={{ border: 0, padding: "8px 14px", borderRadius: 10, cursor: "pointer", background: mode === m ? C.primary : "transparent", color: mode === m ? "#fff" : C.textSecondary }}>{m === "load" ? t.trainingLoad : m}</button>)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
        <Metric C={C} label="Acute Training Load" value={64} tone="#D56A6A" />
        <Metric C={C} label="Chronic Training Load" value={51} tone="#D59B73" />
        <Metric C={C} label="Training Stress Balance" value={-13} tone="#58A96B" />
      </div>

      <Card C={C}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: 40 }}>Load Timeline</div>
            <div style={{ color: C.textSecondary }}>Based on Banister Impulse-Response model</div>
          </div>
          <div style={{ color: C.textSecondary, fontSize: 12, display: "flex", gap: 10 }}><span style={{ color: "#D56A6A" }}>ATL</span><span style={{ color: "#D59B73" }}>CTL</span><span style={{ color: "#58A96B" }}>TSB</span></div>
        </div>
        <svg width="100%" height="210" viewBox="0 0 900 210">
          {[40, 80, 120, 160].map((y) => <line key={y} x1="20" y1={y} x2="880" y2={y} stroke={C.textMuted} strokeOpacity="0.25" />)}
          <polyline points={loadData.map((p, i) => `${20 + i * 120},${180 - p.atl}`).join(" ")} fill="none" stroke="#D56A6A" strokeWidth="4" />
          <polyline points={loadData.map((p, i) => `${20 + i * 120},${180 - p.ctl}`).join(" ")} fill="none" stroke="#D59B73" strokeWidth="4" />
          <polyline points={loadData.map((p, i) => `${20 + i * 120},${180 - p.tsb}`).join(" ")} fill="none" stroke="#58A96B" strokeWidth="4" strokeDasharray="8 6" />
        </svg>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card C={C}>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 38 }}>Intensity Distribution</div>
          <div style={{ color: C.textSecondary }}>Polarized model</div>
          <svg width="100%" height="130">
            {[65, 15, 20].map((v, i) => <rect key={i} x={i * 170 + 10} y={100 - v} width="160" height={v} rx="5" fill={i === 2 ? C.primary : i === 1 ? "#6E564D" : "#4D362F"} />)}
          </svg>
        </Card>
        <Card C={C}>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 38 }}>Recovery Readiness</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            <svg width="170" height="170" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="33" stroke={C.textMuted} strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="33" stroke={C.primary} strokeWidth="8" fill="none" strokeDasharray={`${71 * 2.07} 220`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="56" textAnchor="middle" fontSize="17" fill={C.textPrimary}>71</text>
            </svg>
            <div style={{ flex: 1 }}>
              {["Sleep quality", "Session density", "Rest day ratio"].map((k, i) => <div key={k} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", color: C.textSecondary, fontSize: 13 }}><span>{k}</span><span>{[70, 65, 80][i]}%</span></div><Progress C={C} value={[70, 65, 80][i]} /></div>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsDrawer({ C, onClose, theme, setTheme, lang, setLang, exportData, importData, plans, markRest }) {
  const fileRef = useRef(null);
  return (
    <div style={{ position: "fixed", inset: 46, background: "rgba(0,0,0,0.58)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: 410, borderLeft: `1px solid ${C.textMuted}44`, background: "#0B0C0E", padding: 18, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><LogoMark colors={C} /><div><div style={{ fontFamily: "Barlow Condensed", fontSize: 34, lineHeight: 0.9 }}>KINARA</div><div style={{ color: C.textSecondary, fontSize: 12 }}>Your training hub</div></div></div>
          <button style={ghostBtn(C)} onClick={onClose}>✕</button>
        </div>

        <Divider colors={C} />
        <SLabel colors={C}>Upcoming</SLabel>
        {plans.slice(1, 3).map((p, i) => <Card key={p.id} C={C}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ color: C.primary, fontSize: 12, fontWeight: 700 }}>{["WED", "FRI"][i]}</div><div style={{ fontFamily: "Barlow Condensed", fontSize: 32 }}>{p.name}</div><div style={{ color: C.textSecondary }}>{p.exercises.length} exercises</div></div><div style={{ color: C.textSecondary }}>{[4, 6][i]}</div></div></Card>)}

        <Divider colors={C} />
        <SLabel colors={C}>Recent PRs</SLabel>
        {["Deadlift", "Squat", "Bench Press"].map((x, i) => <Card key={x} C={C}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontFamily: "Barlow Condensed", fontSize: 36 }}>{x}</div><div style={{ color: C.textSecondary, fontSize: 12 }}>Feb {21 - i * 2}</div></div><div style={{ color: "#FF9F84", fontFamily: "JetBrains Mono", fontSize: 27 }}>{[160, 140, 100][i]} kg</div></div></Card>)}

        <Divider colors={C} />
        <SLabel colors={C}>Training Tips</SLabel>
        <Card C={C}><DRow colors={C} title="Progressive Overload" subtitle="Increase weight or reps by 2–5% weekly." right={null} /></Card>
        <Card C={C}><DRow colors={C} title="Protein Window" subtitle="20–40g protein within 2 hours post-workout." right={null} /></Card>
        <Card C={C}><div style={{ fontFamily: "Barlow Condensed", fontSize: 40 }}>No workout yet today?</div><div style={{ color: C.textSecondary, marginBottom: 8 }}>Rest days protect your streak and aid recovery.</div><button onClick={markRest} style={solidBtn(C)}>Log Rest Day</button></Card>

        <Divider colors={C} />
        <SLabel colors={C}>Data Management</SLabel>
        <DRow colors={C} title="Import Data" subtitle="Restore from a local JSON backup" onClick={() => fileRef.current.click()} />
        <input ref={fileRef} onChange={(e) => e.target.files[0] && importData(e.target.files[0])} type="file" accept="application/json" style={{ display: "none" }} />
        <DRow colors={C} title="Export Data" subtitle="Download all data as JSON" onClick={exportData} />

        <Divider colors={C} />
        <SLabel colors={C}>App Settings</SLabel>
        <DRow colors={C} title="Dark Theme" right={<Toggle value={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} colors={C} />} />
        <DRow colors={C} title="Русский язык" right={<Toggle value={lang === "ru"} onChange={(v) => setLang(v ? "ru" : "en")} colors={C} />} />
      </div>
    </div>
  );
}

function PRModal({ C, prs, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.76)", display: "grid", placeItems: "center", zIndex: 30 }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 90 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 37) % 100}%`, top: `${(i * 19) % 100}%`, width: 4, height: 10, background: [C.primary, C.purple, C.success][i % 3], opacity: 0.9, transform: `rotate(${i * 13}deg)` }} />)}
      </div>
      <Card C={C} style={{ width: 460, maxWidth: "92vw", textAlign: "center", zIndex: 1 }}>
        <div style={{ fontFamily: "Barlow Condensed", fontSize: 68, color: C.primary, lineHeight: 0.9 }}>NEW PRS 🎉</div>
        <div style={{ marginTop: 8 }}>{prs.map((p) => <div key={p.exercise} style={{ marginBottom: 4 }}>{p.exercise}: <b>{p.weight} kg</b></div>)}</div>
        <button onClick={onClose} style={{ ...solidBtn(C), marginTop: 10 }}>Awesome</button>
      </Card>
    </div>
  );
}

function Card({ C, children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.textMuted}33`, borderRadius: 16, padding: 14, marginBottom: 10, ...style }}>{children}</div>;
}

function Progress({ C, value, reverse }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginTop: 6, background: C.surface, border: `1px solid ${C.textMuted}33`, borderRadius: 999, overflow: "hidden", height: 8 }}>
      <div style={{ width: `${reverse ? 100 - v : v}%`, height: "100%", background: C.primary }} />
    </div>
  );
}

function patchEx(setPlans, planId, exId, patch) {
  setPlans((all) => all.map((p) => p.id !== planId ? p : { ...p, exercises: p.exercises.map((e) => e.id === exId ? { ...e, ...patch } : e) }));
}
function moveEx(setPlans, planId, idx, delta) {
  setPlans((all) => all.map((p) => {
    if (p.id !== planId) return p;
    const arr = [...p.exercises];
    const next = idx + delta;
    if (next < 0 || next >= arr.length) return p;
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    return { ...p, exercises: arr };
  }));
}
function removeEx(setPlans, planId, exId) {
  setPlans((all) => all.map((p) => p.id !== planId ? p : { ...p, exercises: p.exercises.filter((x) => x.id !== exId) }));
}
function patchSet(setActiveWorkout, exIndex, setIndex, patch) {
  setActiveWorkout((w) => ({
    ...w,
    exercises: w.exercises.map((e, i) => i !== exIndex ? e : { ...e, sets: e.sets.map((s, j) => j !== setIndex ? s : { ...s, ...patch }) }),
  }));
}

function iconBtn(C) {
  return { width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.textMuted}66`, background: C.card, color: C.textPrimary, display: "grid", placeItems: "center", cursor: "pointer" };
}
function solidBtn(C) {
  return { background: C.primary, color: "#fff", border: `1px solid ${C.primary}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" };
}
function ghostBtn(C) {
  return { background: "transparent", color: C.textSecondary, border: `1px solid ${C.textMuted}66`, borderRadius: 10, padding: "8px 12px", cursor: "pointer" };
}
function inputStyle(C) {
  return { width: "100%", background: "#090A0B", color: C.textPrimary, border: `1px solid ${C.textMuted}66`, borderRadius: 9, padding: "8px 10px" };
}

ReactDOM.createRoot(document.getElementById("root")).render(<KinaraApp />);
