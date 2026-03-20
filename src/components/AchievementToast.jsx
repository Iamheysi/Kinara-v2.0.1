import { useState, useEffect } from 'react';
import { KIcon } from '../brandedIcons.jsx';

export function AchievementToast({ achievement, onClose, c, lang }) {
  const [visible, setVisible] = useState(false);
  const isRu = lang === 'ru';
  const IconComp = KIcon[achievement?.icon];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!achievement) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 900,
      background: c.card, border: `1px solid ${c.gold}44`,
      borderRadius: 16, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${c.border}`,
      maxWidth: 360,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(40px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 22, flexShrink: 0,
        background: `radial-gradient(circle, ${c.gold}22 0%, ${c.gold}08 70%)`,
        border: `2px solid ${c.gold}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {IconComp && <IconComp color={c.gold} size={22} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 10, color: c.gold, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2,
          fontFamily: "'Barlow Condensed',sans-serif",
        }}>
          {isRu ? 'Достижение разблокировано' : 'Achievement Unlocked'}
        </p>
        <p style={{
          fontSize: 14, fontWeight: 700, color: c.textPrimary,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {achievement.label}
        </p>
        <p style={{ fontSize: 11, color: c.textSecondary, marginTop: 1 }}>
          {achievement.desc}
        </p>
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} style={{
        background: 'none', border: 'none', color: c.textMuted,
        cursor: 'pointer', padding: 4, flexShrink: 0, fontSize: 16, lineHeight: 1,
      }}>×</button>
    </div>
  );
}
