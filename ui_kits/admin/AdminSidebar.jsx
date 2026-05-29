const adminSidebarStyles = {
  wrap: {
    width: 260, background: 'var(--bg)',
    borderRight: '1px solid var(--hairline)',
    padding: '20px 14px',
    display: 'flex', flexDirection: 'column',
    flexShrink: 0,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '4px 8px 18px',
  },
  brandName: { fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg1)' },
  scope: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'var(--danger-bg)', color: '#b32420',
    fontSize: 10, fontWeight: 700,
    padding: '2px 8px', borderRadius: 999, letterSpacing: '0.05em',
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
    color: 'var(--fg3)', textTransform: 'uppercase',
    padding: '14px 10px 6px',
  },
  item: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', borderRadius: 10,
    fontSize: 14, fontWeight: 500,
    color: active ? 'var(--accent)' : 'var(--fg1)',
    background: active ? 'var(--accent-bg)' : 'transparent',
    cursor: 'pointer',
  }),
  badge: (color) => ({
    marginLeft: 'auto',
    fontSize: 11, fontWeight: 700,
    background: color || 'var(--bg-elevated)',
    color: color === 'var(--warning)' ? '#fff' : 'var(--fg2)',
    padding: '2px 7px', borderRadius: 999,
  }),
  metric: {
    margin: '14px 10px',
    padding: 14, background: '#fff',
    borderRadius: 14, boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
  },
  metricLabel: { fontSize: 11, color: 'var(--fg3)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' },
  metricValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em',
    color: 'var(--fg1)', marginTop: 4,
    fontVariantNumeric: 'tabular-nums',
  },
  metricSub: { fontSize: 12, color: 'var(--success)', marginTop: 2, fontWeight: 600 },
};

function AdminSidebar({ tab, onTab }) {
  const items = [
    { key: 'deposits',    label: 'Депозиты',    icon: <IcArrowDown/>, badge: '7' },
    { key: 'withdrawals', label: 'Выплаты',     icon: <IcArrowUp/>,   badge: '3', badgeColor: 'var(--warning)' },
    { key: 'queues',      label: 'Очереди',     icon: <IcQueue/> },
    { key: 'settings',    label: 'Параметры',   icon: <IcSettings/> },
  ];
  return (
    <aside style={adminSidebarStyles.wrap}>
      <div style={adminSidebarStyles.brand}>
        <img src="../../assets/glyph.svg" width="22" height="22"/>
        <span style={adminSidebarStyles.brandName}>Cascade</span>
        <span style={adminSidebarStyles.scope}>Admin</span>
      </div>

      <div style={adminSidebarStyles.sectionTitle}>Back-office</div>
      {items.map(i => (
        <div key={i.key} style={adminSidebarStyles.item(tab === i.key)} onClick={() => onTab(i.key)}>
          {i.icon}<span>{i.label}</span>
          {i.badge && <span style={adminSidebarStyles.badge(i.badgeColor)}>{i.badge}</span>}
        </div>
      ))}

      <div style={adminSidebarStyles.metric}>
        <div style={adminSidebarStyles.metricLabel}>Комиссия сервиса · 24 ч</div>
        <div style={adminSidebarStyles.metricValue}>1 482,30</div>
        <div style={adminSidebarStyles.metricSub}>+12,4% к среднему</div>
      </div>
      <div style={adminSidebarStyles.metric}>
        <div style={adminSidebarStyles.metricLabel}>Активных в очередях</div>
        <div style={adminSidebarStyles.metricValue}>3 281</div>
        <div style={adminSidebarStyles.metricSub}>+48 за час</div>
      </div>
    </aside>
  );
}

Object.assign(window, { AdminSidebar });
