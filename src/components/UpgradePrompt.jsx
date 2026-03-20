export function UpgradePrompt({ c, lang, onClose }) {
  const isRu = lang === 'ru';
  const features = [
    { icon: '📊', en: 'Advanced Analytics', ru: 'Продвинутая аналитика' },
    { icon: '🏋️', en: 'Unlimited Plans', ru: 'Безлимитные планы' },
    { icon: '🎯', en: 'AI Plan Suggestions', ru: 'AI рекомендации планов' },
    { icon: '☁️', en: 'Priority Cloud Sync', ru: 'Приоритетная синхронизация' },
    { icon: '🎨', en: 'Custom Themes', ru: 'Свои темы оформления' },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 750,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: c.card, border: `1px solid ${c.border}`,
        borderRadius: 20, padding: '36px 28px 28px',
        maxWidth: 380, width: '90vw',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `linear-gradient(135deg, ${c.gold}22, ${c.gold}08)`,
            border: `1px solid ${c.gold}33`,
            borderRadius: 20, padding: '6px 16px', marginBottom: 14,
          }}>
            <span style={{ fontSize: 14 }}>👑</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.gold, letterSpacing: 1 }}>PRO</span>
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 26, fontWeight: 800, color: c.textPrimary,
            margin: '0 0 6px',
          }}>
            {isRu ? 'Kinara Pro' : 'Kinara Pro'}
          </h2>
          <p style={{ color: c.textSecondary, fontSize: 14 }}>
            {isRu ? 'Раскройте полный потенциал тренировок' : 'Unlock your full training potential'}
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', background: c.bg,
              border: `1px solid ${c.border}`, borderRadius: 11,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.textPrimary }}>
                {isRu ? f.ru : f.en}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          width: '100%', padding: '14px',
          background: `linear-gradient(135deg, ${c.gold}, #B8922A)`,
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif",
          marginBottom: 8,
        }}>
          {isRu ? 'Скоро' : 'Coming Soon'}
        </button>
        <button onClick={onClose} style={{
          width: '100%', padding: '10px',
          background: 'none', border: 'none',
          color: c.textMuted, fontSize: 13, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif",
        }}>
          {isRu ? 'Не сейчас' : 'Not now'}
        </button>
      </div>
    </div>
  );
}
