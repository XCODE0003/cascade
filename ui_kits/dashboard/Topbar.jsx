const topbarStyles = {
  wrap: {
    height: 64,
    background: 'rgba(251,251,253,0.72)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid var(--hairline)',
    padding: '0 32px',
    display: 'flex', alignItems: 'center', gap: 16,
    position: 'sticky', top: 0, zIndex: 10,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg1)',
  },
  spacer: { flex: 1 },
  iconBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--fg2)',
    cursor: 'pointer',
    transition: 'background var(--dur) var(--ease)',
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%)',
    color: '#fff', fontWeight: 600, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};

function Topbar({ title }) {
  return (
    <header style={topbarStyles.wrap}>
      <div style={topbarStyles.title}>{title}</div>
      <div style={topbarStyles.spacer}/>
      <div style={topbarStyles.iconBtn}><IcBell/></div>
      <div style={topbarStyles.avatar}>А</div>
    </header>
  );
}

Object.assign(window, { Topbar });
