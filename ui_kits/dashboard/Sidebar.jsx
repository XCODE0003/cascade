const sidebarStyles = {
  wrap: {
    width: 240,
    background: 'var(--bg)',
    borderRight: '1px solid var(--hairline)',
    padding: '20px 14px',
    display: 'flex', flexDirection: 'column', gap: 4,
    flexShrink: 0,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '4px 8px 18px',
  },
  brandName: {
    fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg1)',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
    color: 'var(--fg3)', textTransform: 'uppercase',
    padding: '14px 10px 6px',
  },
  item: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 10px', borderRadius: 10,
    fontSize: 14, fontWeight: 500,
    color: active ? 'var(--accent)' : 'var(--fg1)',
    background: active ? 'var(--accent-bg)' : 'transparent',
    cursor: 'pointer',
    transition: 'background var(--dur) var(--ease)',
  }),
  badge: {
    marginLeft: 'auto',
    fontSize: 11, fontWeight: 600,
    background: 'var(--bg-elevated)', color: 'var(--fg2)',
    padding: '2px 7px', borderRadius: 999,
  },
};

function Sidebar({ active, onNav }) {
  const items = [
    { key: 'dashboard', label: 'Кабинет', icon: <IcQueue/> },
    { key: 'wallet',    label: 'Кошелёк', icon: <IcWallet/>, badge: '1 248' },
    { key: 'partners',  label: 'Партнёры', icon: <IcUsers/> },
    { key: 'history',   label: 'История', icon: <IcHistory/> },
  ];
  return (
    <aside style={sidebarStyles.wrap}>
      <div style={sidebarStyles.brand}>
        <img src="../../assets/glyph.svg" width="22" height="22" alt=""/>
        <span style={sidebarStyles.brandName}>Cascade</span>
      </div>

      <div style={sidebarStyles.sectionTitle}>Личный</div>
      {items.map(i => (
        <div key={i.key} style={sidebarStyles.item(active === i.key)} onClick={() => onNav && onNav(i.key)}>
          {i.icon}
          <span>{i.label}</span>
          {i.badge && <span style={sidebarStyles.badge}>{i.badge}</span>}
        </div>
      ))}

      <div style={sidebarStyles.sectionTitle}>Настройки</div>
      <div style={sidebarStyles.item(false)}>
        <IcSettings/><span>Параметры</span>
      </div>

      <div style={{ marginTop: 'auto', padding: '8px 10px' }}>
        <div style={{ fontSize: 12, color: 'var(--fg3)' }}>ID 481&nbsp;923</div>
        <div style={{ fontSize: 13, color: 'var(--fg1)', fontWeight: 500, marginTop: 2 }}>Аноним · Активен</div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar });
