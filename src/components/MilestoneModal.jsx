import { useEffect, useState } from 'react';
import { KIcon } from '../brandedIcons.jsx';

const MILESTONES = {
  1:  { icon: 'celebrate', en: 'First Workout!',       ru: 'Первая тренировка!' },
  5:  { icon: 'fire',      en: '5 Workouts Complete!',  ru: '5 тренировок!' },
  10: { icon: 'dumbbell',  en: '10 Workouts!',           ru: '10 тренировок!' },
  25: { icon: 'lightning', en: '25 Workouts — On Fire!', ru: '25 тренировок — огонь!' },
  50: { icon: 'trophy',    en: '50 Workouts — Legend!',  ru: '50 тренировок — легенда!' },
  100:{ icon: 'crown',     en: '100 Workouts — Elite!',  ru: '100 тренировок — элита!' },
};

export function MilestoneModal({ milestone, onClose, c, lang }) {
  const [visible, setVisible] = useState(false);
  const isRu = lang === 'ru';
  const m = MILESTONES[milestone?.count] || { icon: 'celebrate', en: 'Milestone!', ru: 'Достижение!' };

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div onClick={handleClose} style={{
      position: 'fixed', inset: 0, zIndex: 800,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: c.card, border: `1px solid ${c.border}`,
        borderRadius: 22, padding: '48px 40px 36px', textAlign: 'center',
        maxWidth: 360, width: '90vw',
        transform: visible ? 'scale(1)' : 'scale(0.85)',
        transition: 'transform 0.3s ease',
        boxShadow: `0 24px 80px rgba(0,0,0,0.3)`,
      }}>
        {/* Confetti dots */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 22, pointerEvents: 'none' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: -10,
              width: 6 + Math.random() * 4,
              height: 6 + Math.random() * 4,
              borderRadius: '50%',
              background: [c.primary, c.purple, c.gold, c.success][i % 4],
              animation: `confettiFall ${1.5 + Math.random()}s ease-out ${Math.random() * 0.5}s forwards`,
              opacity: 0.8,
            }} />
          ))}
        </div>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `radial-gradient(circle, ${c.primary}22 0%, ${c.primary}08 70%)`,
            border: `2px solid ${c.primary}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {(() => { const IconComp = KIcon[m.icon]; return IconComp ? <IconComp color={c.primary} size={40} /> : null; })()}
          </div>
        </div>
        <h2 style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 28, fontWeight: 800, color: c.textPrimary,
          margin: '0 0 8px',
        }}>
          {isRu ? m.ru : m.en}
        </h2>
        <p style={{ color: c.textSecondary, fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
          {isRu
            ? `Вы завершили ${milestone.count} тренировок. Продолжайте в том же духе!`
            : `You've completed ${milestone.count} workouts. Keep pushing!`}
        </p>
        <button onClick={handleClose} style={{
          background: c.primary, color: '#fff', border: 'none',
          borderRadius: 12, padding: '14px 36px',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif",
        }}>
          {isRu ? 'Отлично!' : 'Awesome!'}
        </button>
      </div>
    </div>
  );
}
