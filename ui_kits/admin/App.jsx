const adminAppStyles = {
  shell: { display: 'flex', minHeight: '100vh' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  topbar: {
    height: 64,
    background: 'rgba(251,251,253,0.72)',
    backdropFilter: 'saturate(180%) blur(20px)',
    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
    borderBottom: '1px solid var(--hairline)',
    padding: '0 32px',
    display: 'flex', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 10,
  },
  topTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' },
  searchBox: {
    marginLeft: 'auto',
    height: 34, width: 220, padding: '0 12px',
    borderRadius: 9, background: 'var(--bg-elevated)',
    border: 0, fontSize: 13, fontFamily: 'inherit', outline: 'none',
  },
  content: { padding: '24px 32px 48px', maxWidth: 1280, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 },
};

const TITLES = {
  deposits: 'Депозиты',
  withdrawals: 'Заявки на вывод',
  queues: 'Управление очередями',
  settings: 'Параметры системы',
};

function AdminApp() {
  const [tab, setTab] = React.useState('withdrawals');
  return (
    <div style={adminAppStyles.shell}>
      <AdminSidebar tab={tab} onTab={setTab}/>
      <div style={adminAppStyles.main}>
        <div style={adminAppStyles.topbar}>
          <div style={adminAppStyles.topTitle}>{TITLES[tab]}</div>
          <input style={adminAppStyles.searchBox} placeholder="Поиск по ID, кошельку, user_..."/>
        </div>
        <div style={adminAppStyles.content}>
          {tab === 'deposits'    && <DepositsTable/>}
          {tab === 'withdrawals' && <WithdrawalsTable/>}
          {tab === 'queues'      && <QueueManager/>}
          {tab === 'settings'    && <Settings/>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminApp });
