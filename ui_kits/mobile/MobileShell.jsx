const shellStyles = {
  statusBar: {
    height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px',
    fontSize: 15, fontWeight: 600, color: 'var(--fg1)',
    fontFamily: 'var(--font-text)',
    background: 'transparent',
    flexShrink: 0,
  },
  rightIcons: {
    display: 'flex', alignItems: 'center', gap: 6,
  },

  header: {
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(251,251,253,0.82)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid var(--hairline)',
    padding: '12px 20px',
    display: 'flex', alignItems: 'center', gap: 10,
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
    color: 'var(--fg1)',
    flex: 1,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 999,
    background: 'var(--bg-elevated)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--fg1)',
    border: 0, cursor: 'pointer',
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%)',
    color: '#fff', fontWeight: 700, fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  body: {
    flex: 1, minHeight: 0,
    overflowY: 'auto', overflowX: 'hidden',
    paddingBottom: 90,
  },
};

function StatusBar() {
  return (
    <div style={shellStyles.statusBar}>
      <span>9:41</span>
      <div style={shellStyles.rightIcons}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill="currentColor"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="currentColor"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5" fill="currentColor"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 3a8 8 0 0 0-5.7 2.4l1.4 1.4A6 6 0 0 1 7.5 5a6 6 0 0 1 4.3 1.8l1.4-1.4A8 8 0 0 0 7.5 3Z" fill="currentColor"/>
          <path d="M7.5 7a4 4 0 0 0-2.8 1.2l1.4 1.4a2 2 0 0 1 2.8 0l1.4-1.4A4 4 0 0 0 7.5 7Z" fill="currentColor"/>
        </svg>
        {/* battery */}
        <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="18" height="7" rx="1.5" fill="currentColor"/>
          <rect x="23" y="3.5" width="1.5" height="4" rx="0.7" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function MobileShell({ title, children, leading, trailing, hideHeader }) {
  return (
    <div className="phone">
      <StatusBar/>
      {!hideHeader && (
        <div style={shellStyles.header}>
          {leading}
          <h1 style={shellStyles.headerTitle}>{title}</h1>
          {trailing || (
            <>
              <button style={shellStyles.headerBtn}><IcBell size={18}/></button>
              <div style={shellStyles.avatar}>А</div>
            </>
          )}
        </div>
      )}
      <div style={shellStyles.body}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { MobileShell, StatusBar });
