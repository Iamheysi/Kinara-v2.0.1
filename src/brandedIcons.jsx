// Branded SVG icons for Kinara — replaces emojis throughout the app.
// Each icon returns an inline SVG matching the brand palette.
// Usage: <KIcon.strength color={c.primary} size={24} />

function sv(children, size = 24) {
  return (props) => {
    const s = props.size || size;
    const color = props.color || 'currentColor';
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} style={{ flexShrink: 0, ...props.style }}>
        {typeof children === 'function' ? children(color) : children}
      </svg>
    );
  };
}

// ── Goal icons ──────────────────────────────────────────────────────────────
export const KIcon = {
  // Strength — barbell
  strength: sv((c) => <>
    <rect x="2" y="9" width="3" height="6" rx="1" fill={c} opacity="0.85"/>
    <rect x="19" y="9" width="3" height="6" rx="1" fill={c} opacity="0.85"/>
    <rect x="5" y="7" width="2.5" height="10" rx="1" fill={c}/>
    <rect x="16.5" y="7" width="2.5" height="10" rx="1" fill={c}/>
    <rect x="7.5" y="11" width="9" height="2" rx="0.5" fill={c} opacity="0.6"/>
  </>),

  // Hypertrophy — flexed arm
  hypertrophy: sv((c) => <>
    <path d="M6 18C6 18 7 14 9 12C11 10 12 8 12 6" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M12 6C12 6 14 7 15 9C16 11 17 11 18 12" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="10" r="3.5" fill={c} opacity="0.2"/>
    <circle cx="14" cy="9" r="2" fill={c} opacity="0.35"/>
  </>),

  // Fat Loss — flame
  fatLoss: sv((c) => <>
    <path d="M12 2C12 2 8 8 8 13C8 16.3 9.8 19 12 20C14.2 19 16 16.3 16 13C16 8 12 2 12 2Z" fill={c} opacity="0.2"/>
    <path d="M12 4C12 4 9 9 9 13C9 15.8 10.3 18 12 19C13.7 18 15 15.8 15 13C15 9 12 4 12 4Z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M12 12C12 12 10.5 14 10.5 15.5C10.5 16.9 11.1 17.5 12 17.5C12.9 17.5 13.5 16.9 13.5 15.5C13.5 14 12 12 12 12Z" fill={c} opacity="0.5"/>
  </>),

  // Endurance — running figure
  endurance: sv((c) => <>
    <circle cx="14" cy="4" r="2" fill={c}/>
    <path d="M8 21L10 15L13 17L16 10L18 11" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M6 17L10 15" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
  </>),

  // General — star/diamond
  general: sv((c) => <>
    <path d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z" fill={c} opacity="0.15"/>
    <path d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
  </>),

  // ── Achievement icons ─────────────────────────────────────────────────────
  // Target / first blood
  target: sv((c) => <>
    <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.5" fill="none" opacity="0.3"/>
    <circle cx="12" cy="12" r="5.5" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="12" cy="12" r="2" fill={c}/>
  </>),

  // Calendar / streak
  calendar: sv((c) => <>
    <rect x="3" y="4" width="18" height="18" rx="3" stroke={c} strokeWidth="1.5" fill="none"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth="1.5"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill={c}/>
  </>),

  // Fire / streak
  fire: sv((c) => <>
    <path d="M12 2C12 2 8 8 8 13C8 16.3 9.8 19 12 20C14.2 19 16 16.3 16 13C16 8 12 2 12 2Z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill={c} fillOpacity="0.15"/>
  </>),

  // Lightning / energy
  lightning: sv((c) => <>
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill={c} opacity="0.15"/>
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
  </>),

  // Trophy
  trophy: sv((c) => <>
    <path d="M8 21H16M12 17V21M7 4H4V9C4 10.7 5.3 12 7 12M17 4H20V9C20 10.7 18.7 12 17 12M7 4H17V12C17 14.8 14.8 17 12 17C9.2 17 7 14.8 7 12V4Z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M7 4H17V12C17 14.8 14.8 17 12 17C9.2 17 7 14.8 7 12V4Z" fill={c} opacity="0.12"/>
  </>),

  // Crown
  crown: sv((c) => <>
    <path d="M2 17L4 7L8 12L12 4L16 12L20 7L22 17H2Z" fill={c} opacity="0.15"/>
    <path d="M2 17L4 7L8 12L12 4L16 12L20 7L22 17H2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <line x1="3" y1="20" x2="21" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </>),

  // Shield / protection
  shield: sv((c) => <>
    <path d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z" fill={c} opacity="0.12"/>
    <path d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <polyline points="9,12 11,14 15,10" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </>),

  // Dumbbell / lifter
  dumbbell: sv((c) => <>
    <rect x="3" y="9" width="3" height="6" rx="1" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.2"/>
    <rect x="18" y="9" width="3" height="6" rx="1" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.2"/>
    <line x1="6" y1="12" x2="18" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round"/>
  </>),

  // Star / legend
  star: sv((c) => <>
    <path d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z" fill={c} opacity="0.2"/>
    <path d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
  </>),

  // Medal
  medal: sv((c) => <>
    <circle cx="12" cy="14" r="6" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12"/>
    <line x1="8" y1="2" x2="10" y2="9" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="2" x2="14" y2="9" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="2.5" fill={c} opacity="0.3"/>
  </>),

  // Chain link / consistency
  chain: sv((c) => <>
    <path d="M10 13L8.5 14.5C7.1 15.9 7.1 18.1 8.5 19.5C9.9 20.9 12.1 20.9 13.5 19.5L15 18" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M14 11L15.5 9.5C16.9 8.1 16.9 5.9 15.5 4.5C14.1 3.1 11.9 3.1 10.5 4.5L9 6" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <line x1="9" y1="15" x2="15" y2="9" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
  </>),

  // Diamond
  diamond: sv((c) => <>
    <path d="M12 2L22 12L12 22L2 12Z" fill={c} opacity="0.12"/>
    <path d="M12 2L22 12L12 22L2 12Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <path d="M12 7L17 12L12 17L7 12Z" fill={c} opacity="0.2"/>
  </>),

  // Heart / health
  heart: sv((c) => <>
    <path d="M12 21C12 21 3 14 3 8.5C3 5.4 5.4 3 8.5 3C10.2 3 11.8 3.9 12 5C12.2 3.9 13.8 3 15.5 3C18.6 3 21 5.4 21 8.5C21 14 12 21 12 21Z" fill={c} opacity="0.15"/>
    <path d="M12 21C12 21 3 14 3 8.5C3 5.4 5.4 3 8.5 3C10.2 3 11.8 3.9 12 5C12.2 3.9 13.8 3 15.5 3C18.6 3 21 5.4 21 8.5C21 14 12 21 12 21Z" stroke={c} strokeWidth="1.5" fill="none"/>
  </>),

  // Moon / rest
  moon: sv((c) => <>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" fill={c} opacity="0.15"/>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" stroke={c} strokeWidth="1.5" fill="none"/>
  </>),

  // Lotus / wellness
  lotus: sv((c) => <>
    <path d="M12 20C12 20 8 16 8 12C8 8 12 4 12 4C12 4 16 8 16 12C16 16 12 20 12 20Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12"/>
    <path d="M4 14C4 14 8 12 12 12C16 12 20 14 20 14" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
  </>),

  // Paint palette / diverse
  palette: sv((c) => <>
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12.8 22 13.5 21.3 13.5 20.5C13.5 20.1 13.3 19.8 13.1 19.5C12.9 19.3 12.8 19 12.8 18.5C12.8 17.7 13.4 17 14.3 17H16C19.3 17 22 14.3 22 11C22 6 17.5 2 12 2Z" stroke={c} strokeWidth="1.5" fill="none"/>
    <circle cx="7.5" cy="11" r="1.5" fill={c} opacity="0.5"/>
    <circle cx="10" cy="7" r="1.5" fill={c} opacity="0.7"/>
    <circle cx="15" cy="7" r="1.5" fill={c} opacity="0.4"/>
    <circle cx="17.5" cy="11" r="1.5" fill={c} opacity="0.6"/>
  </>),

  // Microscope / specialist
  microscope: sv((c) => <>
    <circle cx="12" cy="7" r="4" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12"/>
    <line x1="12" y1="11" x2="12" y2="17" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="16" y2="17" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="16" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </>),

  // Chart / analytics
  chart: sv((c) => <>
    <line x1="4" y1="20" x2="4" y2="14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="9" y1="20" x2="9" y2="10" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14" y1="20" x2="14" y2="6" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="19" y1="20" x2="19" y2="4" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
  </>),

  // Bomb / volume
  bomb: sv((c) => <>
    <circle cx="12" cy="14" r="7" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12"/>
    <path d="M14 7L16 3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 4C16 3.5 17 4 17 5" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </>),

  // Pillar / centurion
  pillar: sv((c) => <>
    <rect x="6" y="6" width="12" height="14" rx="1" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.1"/>
    <line x1="5" y1="4" x2="19" y2="4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <line x1="5" y1="22" x2="19" y2="22" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="6" x2="9" y2="20" stroke={c} strokeWidth="1" opacity="0.3"/>
    <line x1="15" y1="6" x2="15" y2="20" stroke={c} strokeWidth="1" opacity="0.3"/>
  </>),

  // Sick / medical cross
  sick: sv((c) => <>
    <rect x="3" y="3" width="18" height="18" rx="4" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.1"/>
    <rect x="10" y="7" width="4" height="10" rx="1" fill={c} opacity="0.7"/>
    <rect x="7" y="10" width="10" height="4" rx="1" fill={c} opacity="0.7"/>
  </>),

  // Default avatar silhouette
  avatar: sv((c) => <>
    <circle cx="12" cy="8" r="4" fill={c} opacity="0.3"/>
    <path d="M4 20C4 16 7.6 13 12 13C16.4 13 20 16 20 20" fill={c} opacity="0.2"/>
    <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5" fill="none"/>
    <path d="M4 20C4 16 7.6 13 12 13C16.4 13 20 16 20 20" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </>),

  // Camera icon for upload
  camera: sv((c) => <>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={c} strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.1"/>
  </>),

  // Lion
  lion: sv((c) => <>
    <circle cx="12" cy="13" r="6" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12"/>
    <circle cx="12" cy="13" r="9" stroke={c} strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="3 2"/>
    <circle cx="10" cy="12" r="1" fill={c}/>
    <circle cx="14" cy="12" r="1" fill={c}/>
    <path d="M10 15C10 15 11 16 12 16C13 16 14 15 14 15" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </>),

  // Explosion / power
  explosion: sv((c) => <>
    <path d="M12 2L14 8L20 6L16 12L22 14L16 16L18 22L12 18L6 22L8 16L2 14L8 12L4 6L10 8Z" fill={c} opacity="0.15"/>
    <path d="M12 2L14 8L20 6L16 12L22 14L16 16L18 22L12 18L6 22L8 16L2 14L8 12L4 6L10 8Z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
  </>),

  // Celebrate / confetti
  celebrate: sv((c) => <>
    <path d="M4 21L8 10L14 16Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill={c} fillOpacity="0.15"/>
    <line x1="12" y1="4" x2="12" y2="2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="17" y1="6" x2="19" y2="4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="11" x2="22" y2="11" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="15" cy="3" r="1" fill={c} opacity="0.5"/>
    <circle cx="20" cy="8" r="1" fill={c} opacity="0.5"/>
  </>),
};
