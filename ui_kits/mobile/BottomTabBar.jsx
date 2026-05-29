const tabBarStyles = {
  wrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'rgba(255,255,255,0.86)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderTop: '1px solid var(--hairline)',
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
    zIndex: 20,
  },
  inner: {
    display: 'flex', height: 60,
  },
  tab: (active) => ({
    flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 3,
    background: 'transparent', border: 0,
    color: active ? 'var(--accent)' : 'var(--fg3)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '0.01em' },
  homeIndicator: {
    width: 134, height: 5, borderRadius: 3,
    background: 'var(--fg1)',
    margin: '0 auto 8px',
  },
};

const TABS = [
  { key: 'dashboard', label: 'Кабинет',   Icon: IcQueue },
  { key: 'wallet',    label: 'Кошелёк',  Icon: IcWallet },
  { key: 'partner',   label: 'Партнёры',  Icon: IcUsers },
  { key: 'history',   label: 'История',  Icon: IcHistory },
  { key: 'profile',   label: 'Профиль',   Icon: IcSettings },
];

function BottomTabBar({ active, onSelect }) {
  return (
    <div style={tabBarStyles.wrap}>
      <div style={tabBarStyles.inner}>
        {TABS.map(t => {
          const Icon = t.Icon;
          return (
            <button key={t.key} style={tabBarStyles.tab(active === t.key)} onClick={() => onSelect(t.key)}>
              <Icon size={22} strokeWidth={active === t.key ? 2 : 1.6}/>
              <span style={tabBarStyles.label}>{t.label}</span>
            </button>
          );
        })}
      </div>
      <div style={tabBarStyles.homeIndicator}/>
    </div>
  );
}

Object.assign(window, { BottomTabBar });
