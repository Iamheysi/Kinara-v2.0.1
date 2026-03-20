export function EmptyState({ icon, title, subtitle, action, actionLabel, c }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: c.primaryDim, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, fontSize: 32,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: 22, fontWeight: 700, color: c.textPrimary,
        margin: '0 0 8px',
      }}>
        {title}
      </h3>
      <p style={{
        color: c.textSecondary, fontSize: 14, maxWidth: 320,
        lineHeight: 1.5, marginBottom: action ? 24 : 0,
      }}>
        {subtitle}
      </p>
      {action && (
        <button onClick={action} style={{
          background: c.primary, color: '#fff', border: 'none',
          borderRadius: 10, padding: '12px 28px',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: `0 3px 12px ${c.primary}44`,
        }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
