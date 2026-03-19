import { Ic } from '../icons.jsx';

export function AchievementsModal({ open, onClose, achievements, c, lang }) {
  if (!open) return null;
  const isRu = lang === "ru";
  const earned = achievements.filter(a => a.earned);
  const locked = achievements.filter(a => !a.earned);
  const pct = achievements.length ? Math.round((earned.length / achievements.length) * 100) : 0;

  const sectionLabel = (text) => (
    <p style={{
      fontSize: 10, color: c.textMuted, letterSpacing: 2, fontWeight: 700,
      textTransform: "uppercase", marginBottom: 12, fontFamily: "'Barlow Condensed',sans-serif"
    }}>{text}</p>
  );

  const progressBar = (current, target, color, bgColor, height = 6) => {
    const ratio = target > 0 ? Math.min(current / target, 1) : 0;
    return (
      <div style={{
        width: "100%", height, borderRadius: height / 2, background: bgColor,
        overflow: "hidden", position: "relative"
      }}>
        <div style={{
          height: "100%", borderRadius: height / 2, background: color,
          width: `${ratio * 100}%`, transition: "width 0.6s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
    );
  };

  const card = (a) => {
    const isEarned = a.earned;
    const ratio = a.target > 0 ? Math.min(a.current / a.target, 1) : 0;
    return (
      <div key={a.id} style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        background: c.surface, border: `1px solid ${isEarned ? c.gold + "33" : c.border}`,
        borderRadius: 14, padding: "14px 16px", marginBottom: 10,
        opacity: isEarned ? 1 : 0.5, position: "relative",
        transition: "opacity 0.3s ease, transform 0.3s ease"
      }}>
        {/* Icon circle */}
        <div style={{
          width: 48, height: 48, borderRadius: 24, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, position: "relative",
          background: isEarned
            ? `radial-gradient(circle, ${c.gold}22 0%, ${c.gold}08 70%)`
            : c.bg,
          border: `2px solid ${isEarned ? c.gold + "66" : c.border}`,
          boxShadow: isEarned ? `0 0 16px ${c.gold}33` : "none"
        }}>
          {a.icon}
          {!isEarned && (
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.35)", fontSize: 16
            }}>🔒</div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <p style={{
              fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700,
              color: isEarned ? c.textPrimary : c.textSecondary, lineHeight: 1.2
            }}>{a.label}</p>
            {isEarned && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: 9,
                background: c.success, color: "#fff", flexShrink: 0
              }}>✓</span>
            )}
          </div>
          <p style={{
            fontSize: 11.5, color: c.textMuted, lineHeight: 1.4, marginBottom: 8,
            fontFamily: "'DM Sans',sans-serif"
          }}>{a.desc}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              {progressBar(
                a.current, a.target,
                isEarned ? c.success : c.primary,
                isEarned ? c.successDim : c.primaryDim
              )}
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
              color: isEarned ? c.success : c.textMuted, flexShrink: 0
            }}>
              {a.current}/{a.target}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 550, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      padding: 16, animation: "achFadeIn 0.25s ease"
    }}>
      <style>{`
        @keyframes achFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes achSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .ach-scroll::-webkit-scrollbar { width: 4px; }
        .ach-scroll::-webkit-scrollbar-track { background: transparent; }
        .ach-scroll::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 4px; }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: c.card, border: `1px solid ${c.borderMid}`,
        borderRadius: 22, width: 560, maxWidth: "100%", maxHeight: "90vh",
        boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}`,
        display: "flex", flexDirection: "column",
        animation: "achSlideUp 0.35s cubic-bezier(.2,.8,.3,1)"
      }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 0 24px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 900,
                color: c.textPrimary, letterSpacing: -0.5
              }}>
                {isRu ? "Достижения" : "Achievements"}
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700,
                background: c.gold + "22", color: c.gold,
                padding: "3px 10px", borderRadius: 20,
                border: `1px solid ${c.gold}33`
              }}>
                {earned.length}/{achievements.length}
              </span>
            </div>
            <button onClick={onClose} style={{
              background: "none", border: `1px solid ${c.border}`, color: c.textSecondary,
              borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", flexShrink: 0,
              transition: "border-color 0.2s"
            }}>
              {Ic.close}
            </button>
          </div>

          {/* Overall progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 6
            }}>
              <span style={{
                fontSize: 11, color: c.textMuted, fontFamily: "'DM Sans',sans-serif",
                fontWeight: 500
              }}>
                {isRu ? "Общий прогресс" : "Overall Progress"}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700,
                color: c.gold
              }}>
                {pct}%
              </span>
            </div>
            {progressBar(earned.length, achievements.length, c.gold, c.gold + "18", 8)}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="ach-scroll" style={{
          overflowY: "auto", padding: "0 24px 24px 24px", flex: 1
        }}>
          {/* Unlocked section */}
          {earned.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {sectionLabel(isRu ? `Разблокировано — ${earned.length}` : `Unlocked — ${earned.length}`)}
              {earned.map(a => card(a))}
            </div>
          )}

          {/* Locked section */}
          {locked.length > 0 && (
            <div>
              {sectionLabel(isRu ? `Заблокировано — ${locked.length}` : `Locked — ${locked.length}`)}
              {locked.map(a => card(a))}
            </div>
          )}

          {achievements.length === 0 && (
            <div style={{
              textAlign: "center", padding: "40px 0", color: c.textMuted,
              fontFamily: "'DM Sans',sans-serif", fontSize: 13
            }}>
              {isRu ? "Пока нет достижений." : "No achievements yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
