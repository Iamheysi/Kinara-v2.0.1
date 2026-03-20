import { useState, useRef } from 'react';

const GOALS = [
  { id: 'strength', icon: '\u{1F4AA}', en: 'Strength', ru: '\u0421\u0438\u043B\u0430', descEn: 'Build raw power', descRu: '\u041D\u0430\u0440\u0430\u0449\u0438\u0432\u0430\u0439 \u0441\u0438\u043B\u0443' },
  { id: 'hypertrophy', icon: '\u{1F3CB}\uFE0F', en: 'Hypertrophy', ru: '\u0413\u0438\u043F\u0435\u0440\u0442\u0440\u043E\u0444\u0438\u044F', descEn: 'Maximize muscle growth', descRu: '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u043E\u0441\u0442 \u043C\u044B\u0448\u0446' },
  { id: 'fatLoss', icon: '\u{1F525}', en: 'Fat Loss', ru: '\u0416\u0438\u0440\u043E\u0441\u0436\u0438\u0433\u0430\u043D\u0438\u0435', descEn: 'Lean & defined', descRu: '\u0420\u0435\u043B\u044C\u0435\u0444 \u0438 \u0441\u0443\u0445\u043E\u0441\u0442\u044C' },
  { id: 'endurance', icon: '\u{1F3C3}', en: 'Endurance', ru: '\u0412\u044B\u043D\u043E\u0441\u043B\u0438\u0432\u043E\u0441\u0442\u044C', descEn: 'Go the distance', descRu: '\u041F\u0440\u0435\u043E\u0434\u043E\u043B\u0435\u0432\u0430\u0439 \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u0438' },
  { id: 'general', icon: '\u2B50', en: 'General Fitness', ru: '\u041E\u0431\u0449\u0430\u044F \u0444\u043E\u0440\u043C\u0430', descEn: 'Stay active & healthy', descRu: '\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0438 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435' },
];

export function OnboardingWizard({ c, t, lang, plans, onComplete }) {
  const isRu = lang === 'ru';
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [goal, setGoal] = useState('general');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [anim, setAnim] = useState({ opacity: 1, transform: 'translateY(0)' });
  const photoRef = useRef(null);

  const goTo = (next) => {
    setAnim({ opacity: 0, transform: 'translateY(18px)' });
    setTimeout(() => {
      setStep(next);
      setAnim({ opacity: 0, transform: 'translateY(-18px)' });
      requestAnimationFrame(() => {
        setAnim({ opacity: 1, transform: 'translateY(0)' });
      });
    }, 220);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFinish = () => {
    onComplete({
      name: name.trim() || (isRu ? 'Мой профиль' : 'My Profile'),
      goal,
      selectedPlanId,
    });
  };

  const dot = (i) => ({
    width: i === step ? 24 : 8,
    height: 8,
    borderRadius: 4,
    background: i === step ? c.primary : c.border,
    transition: 'all 0.3s ease',
  });

  const btnPrimary = {
    background: c.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '15px 40px',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'DM Sans',sans-serif",
    cursor: 'pointer',
    letterSpacing: 0.3,
    transition: 'opacity 0.2s',
    width: '100%',
    maxWidth: 340,
  };

  const btnBack = {
    background: 'none',
    border: `1px solid ${c.border}`,
    color: c.textSecondary,
    borderRadius: 10,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans',sans-serif",
    cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 700,
      background: `linear-gradient(160deg, ${c.bg} 0%, ${c.card} 50%, ${c.bg} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, paddingTop: 32, paddingBottom: 12, flexShrink: 0 }}>
        {[0, 1, 2].map(i => <div key={i} style={dot(i)} />)}
      </div>

      {/* Step content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', width: '100%', maxWidth: 520, padding: '0 24px 40px',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        ...anim,
      }}>

        {/* ─── Step 1: Welcome + Name ─── */}
        {step === 0 && (<>
          {/* Photo */}
          <div
            onClick={() => photoRef.current?.click()}
            style={{
              width: 88, height: 88, borderRadius: '50%',
              background: photo ? `url(${photo}) center/cover` : c.primaryDim,
              border: `2px dashed ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', marginBottom: 24, flexShrink: 0,
              transition: 'border-color 0.2s',
            }}
          >
            {!photo && <span style={{ fontSize: 28, opacity: 0.5 }}>📷</span>}
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 38, fontWeight: 800, color: c.textPrimary,
            margin: 0, letterSpacing: -0.5, textAlign: 'center',
          }}>
            {isRu ? 'Добро пожаловать в Kinara' : 'Welcome to Kinara'}
          </h1>
          <p style={{
            color: c.textSecondary, fontSize: 16, marginTop: 8, marginBottom: 36,
            textAlign: 'center',
          }}>
            {isRu ? 'Ваш персональный фитнес-компаньон' : 'Your personal fitness companion'}
          </p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={isRu ? 'Ваше имя' : 'Your name'}
            style={{
              width: '100%', maxWidth: 320, padding: '14px 18px',
              borderRadius: 12, border: `1.5px solid ${c.border}`,
              background: c.inputBg, color: c.textPrimary,
              fontSize: 16, fontFamily: "'DM Sans',sans-serif",
              outline: 'none', textAlign: 'center',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = c.primary}
            onBlur={e => e.target.style.borderColor = c.border}
          />

          <div style={{ height: 36 }} />
          <button style={btnPrimary} onClick={() => goTo(1)}>
            {isRu ? 'Продолжить' : 'Continue'}
          </button>
        </>)}

        {/* ─── Step 2: Set Goal ─── */}
        {step === 1 && (<>
          <h1 style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 34, fontWeight: 800, color: c.textPrimary,
            margin: '0 0 8px', letterSpacing: -0.4, textAlign: 'center',
          }}>
            {isRu ? 'Какая ваша цель?' : "What's your goal?"}
          </h1>
          <p style={{ color: c.textSecondary, fontSize: 14, marginBottom: 28, textAlign: 'center' }}>
            {isRu ? 'Выберите основное направление тренировок' : 'Choose your primary training focus'}
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12, width: '100%', marginBottom: 32,
          }}>
            {GOALS.map(g => {
              const sel = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    background: sel ? c.primaryDim : c.card,
                    border: `1.5px solid ${sel ? c.primary : c.border}`,
                    borderRadius: 14, padding: '18px 14px',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: sel ? `0 0 0 1px ${c.primary}44` : 'none',
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{
                    fontWeight: 700, fontSize: 14, color: c.textPrimary,
                    marginBottom: 4,
                  }}>
                    {isRu ? g.ru : g.en}
                  </div>
                  <div style={{ fontSize: 12, color: c.textSecondary, lineHeight: 1.3 }}>
                    {isRu ? g.descRu : g.descEn}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 340 }}>
            <button style={btnBack} onClick={() => goTo(0)}>
              {isRu ? 'Назад' : 'Back'}
            </button>
            <button style={{ ...btnPrimary, flex: 1 }} onClick={() => goTo(2)}>
              {isRu ? 'Продолжить' : 'Continue'}
            </button>
          </div>
        </>)}

        {/* ─── Step 3: Pick Plan ─── */}
        {step === 2 && (<>
          <h1 style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 34, fontWeight: 800, color: c.textPrimary,
            margin: '0 0 8px', letterSpacing: -0.4, textAlign: 'center',
          }}>
            {isRu ? 'Выберите стартовый план' : 'Choose your starting plan'}
          </h1>
          <p style={{ color: c.textSecondary, fontSize: 14, marginBottom: 28, textAlign: 'center' }}>
            {isRu ? 'Или пропустите и создайте свой позже' : 'Or skip and create your own later'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginBottom: 32 }}>
            {(plans || []).slice(0, 3).map(plan => {
              const sel = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(sel ? null : plan.id)}
                  style={{
                    background: sel ? c.primaryDim : c.card,
                    border: `1.5px solid ${sel ? c.primary : c.border}`,
                    borderRadius: 14, padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: sel ? `0 0 0 1px ${c.primary}44` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: c.textPrimary, marginBottom: 4 }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: 13, color: c.textSecondary }}>
                        {plan.exercises.length} {isRu ? 'упражнений' : 'exercises'}
                        {plan.notes ? ` \u00B7 ${plan.notes}` : ''}
                      </div>
                    </div>
                    {sel && (
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: c.primary, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 340 }}>
            <button style={btnBack} onClick={() => goTo(1)}>
              {isRu ? 'Назад' : 'Back'}
            </button>
            <button style={{ ...btnPrimary, flex: 1 }} onClick={handleFinish}>
              {isRu ? 'Начать' : 'Get Started'}
            </button>
          </div>
          <button
            onClick={() => { setSelectedPlanId(null); handleFinish(); }}
            style={{
              background: 'none', border: 'none', color: c.textMuted,
              fontSize: 14, marginTop: 16, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {isRu ? 'Пропустить' : 'Skip for now'}
          </button>
        </>)}
      </div>
    </div>
  );
}
