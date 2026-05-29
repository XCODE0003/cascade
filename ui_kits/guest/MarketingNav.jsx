const navStyles = {
  wrap: {
    position: 'sticky', top: 0, zIndex: 20,
    height: 64,
    background: 'rgba(251,251,253,0.72)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid var(--hairline)',
    display: 'flex', alignItems: 'center',
    padding: '0 32px',
  },
  inner: {
    maxWidth: 1200, width: '100%', margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: 32,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandName: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg1)' },
  links: { display: 'flex', gap: 24, marginLeft: 24 },
  link: { fontSize: 14, color: 'var(--fg2)', fontWeight: 500, cursor: 'pointer' },
  right: { marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' },
  signIn: {
    fontSize: 14, color: 'var(--fg1)', fontWeight: 500, cursor: 'pointer',
    padding: '8px 12px',
  },
  cta: {
    height: 36, padding: '0 16px',
    borderRadius: 999, background: 'var(--fg1)', color: '#fff',
    fontSize: 14, fontWeight: 600,
    border: 0, cursor: 'pointer', fontFamily: 'inherit',
  },
};

function MarketingNav() {
  return (
    <nav style={navStyles.wrap}>
      <div style={navStyles.inner}>
        <a href="index.html" style={{ ...navStyles.brand, textDecoration: 'none' }}>
          <img src="../../assets/glyph.svg" width="22" height="22" alt=""/>
          <span style={navStyles.brandName}>Cascade</span>
        </a>
        <div style={navStyles.links}>
          <span style={navStyles.link}>Как это работает</span>
          <span style={navStyles.link}>Тарифы</span>
          <span style={navStyles.link}>Безопасность</span>
          <span style={navStyles.link}>FAQ</span>
        </div>
        <div style={navStyles.right}>
          <a href="auth.html" style={{ ...navStyles.signIn, textDecoration: 'none' }}>Войти</a>
          <a href="auth.html" style={{ ...navStyles.cta, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Регистрация</a>
        </div>
      </div>
    </nav>
  );
}

Object.assign(window, { MarketingNav });
