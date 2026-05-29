const sheetStyles = {
  scrim: (open) => ({
    position: 'absolute', inset: 0, zIndex: 30,
    background: open ? 'rgba(0,0,0,0.40)' : 'transparent',
    pointerEvents: open ? 'auto' : 'none',
    transition: 'background 240ms ease',
  }),
  sheet: (open) => ({
    position: 'absolute', left: 0, right: 0, bottom: 0,
    background: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: '8px 0 24px',
    boxShadow: '0 -8px 24px rgba(0,0,0,0.10)',
    transform: open ? 'translateY(0)' : 'translateY(110%)',
    transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)',
    maxHeight: '88%',
    display: 'flex', flexDirection: 'column',
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0))',
  }),
  handle: {
    width: 36, height: 5, borderRadius: 3,
    background: 'var(--hairline-strong)',
    margin: '6px auto 14px',
    flexShrink: 0,
  },
  head: {
    display: 'flex', alignItems: 'center',
    padding: '0 20px 14px',
    borderBottom: '1px solid var(--hairline)',
    flexShrink: 0,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', flex: 1 },
  close: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'var(--bg-elevated)', border: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--fg2)', cursor: 'pointer',
  },
  body: {
    padding: '18px 20px 0',
    overflowY: 'auto',
  },
};

function Sheet({ open, onClose, title, children }) {
  return (
    <>
      <div style={sheetStyles.scrim(open)} onClick={onClose}/>
      <div style={sheetStyles.sheet(open)}>
        <div style={sheetStyles.handle}/>
        <div style={sheetStyles.head}>
          <div style={sheetStyles.title}>{title}</div>
          <button style={sheetStyles.close} onClick={onClose}><IcClose size={14}/></button>
        </div>
        <div style={sheetStyles.body}>{children}</div>
      </div>
    </>
  );
}

Object.assign(window, { Sheet });
