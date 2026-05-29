const appStyles = {
  shell: {
    display: 'flex', minHeight: '100vh',
    background: 'var(--bg)',
  },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  content: {
    flex: 1, padding: '24px 32px 48px',
    display: 'flex', flexDirection: 'column', gap: 18,
    maxWidth: 1200, width: '100%', margin: '0 auto',
  },
  sectionHead: {
    display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg1)',
  },
  sectionSub: { fontSize: 13, color: 'var(--fg3)' },

  queueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  withdrawalSheet: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  card: {
    width: 420, background: '#fff', borderRadius: 20, padding: 24,
    boxShadow: '0 24px 64px rgba(0,0,0,0.20)', position: 'relative',
  },
};

const initialQueues = [
  { level: 1, entry: 20,   payout: 30,    filled: 5, status: 'ready',  timer: null,            auto: true  },
  { level: 2, entry: 100,  payout: 150,   filled: 3, status: 'locked', timer: '4 д 12:32:08',  auto: false },
  { level: 3, entry: 700,  payout: 1050,  filled: 0, status: 'inactive', timer: null,          auto: false },
  { level: 4, entry: 2000, payout: 3000,  filled: 2, status: 'locked', timer: '6 д 03:14:55',  auto: false },
];

function App() {
  const [queues, setQueues] = React.useState(initialQueues);
  const [balance, setBalance] = React.useState(1248);
  const [depositOpen, setDepositOpen] = React.useState(false);
  const [defaultLevel, setDefaultLevel] = React.useState(2);
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);

  const canWithdraw = balance >= 30;

  const updateQueue = (level, patch) => {
    setQueues(qs => qs.map(q => q.level === level ? { ...q, ...patch } : q));
  };

  return (
    <div style={appStyles.shell}>
      <Sidebar active="dashboard" />
      <div style={appStyles.main}>
        <Topbar title="Кабинет" />
        <div style={appStyles.content}>
          <BalanceHero
            balance={balance}
            canWithdraw={canWithdraw}
            onDeposit={() => { setDefaultLevel(2); setDepositOpen(true); }}
            onWithdraw={() => setWithdrawOpen(true)}
          />

          <div style={appStyles.sectionHead}>
            <div style={appStyles.sectionTitle}>Очереди</div>
            <div style={appStyles.sectionSub}>4 независимых уровня · ликвидность не пересекается</div>
          </div>

          <div style={appStyles.queueGrid}>
            {queues.map(q => (
              <QueueCard
                key={q.level}
                level={q.level}
                entry={q.entry}
                payout={q.payout}
                filled={q.filled}
                status={q.status}
                timer={q.timer}
                autoReinvest={q.auto}
                onActivate={() => { setDefaultLevel(q.level); setDepositOpen(true); }}
                onReinvest={() => {
                  if (q.status === 'ready') {
                    updateQueue(q.level, { filled: 0, status: 'locked', timer: '6 д 23:59:59' });
                  }
                }}
                onUpgrade={() => {
                  const next = Math.min(q.level + 1, 4);
                  setDefaultLevel(next);
                  setDepositOpen(true);
                }}
                onToggleAuto={() => updateQueue(q.level, { auto: !q.auto })}
              />
            ))}
          </div>

          <div style={appStyles.sectionHead}>
            <div style={appStyles.sectionTitle}>Активность</div>
            <div style={appStyles.sectionSub}>Последние 7 дней</div>
          </div>

          <HistoryFeed />
        </div>
      </div>

      <DepositSheet
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        defaultLevel={defaultLevel}
        balance={balance}
      />

      {withdrawOpen && (
        <div style={appStyles.withdrawalSheet} onClick={() => setWithdrawOpen(false)}>
          <div style={appStyles.card} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', marginBottom: 6 }}>Подтвердите вывод</div>
            <div style={{ fontSize: 13, color: 'var(--fg2)', marginBottom: 18 }}>
              На внешний кошелёк будет отправлено <strong style={{color:'var(--fg1)'}}>{balance} USDT</strong>.
              Заявка получит статус <strong style={{color:'var(--warning)'}}>«В ожидании выплаты»</strong> и будет
              обработана в течение 72&nbsp;часов.
            </div>
            <div style={{ display: 'flex', gap: 16, padding: '14px 16px', background: 'var(--warning-bg)', borderRadius: 12, marginBottom: 18 }}>
              <IcInfo size={16} stroke="var(--warning)"/>
              <div style={{ fontSize: 12, color: '#8c5400', lineHeight: 1.5 }}>
                В момент подачи заявки счётчик ячеек обнулится, ваши записи в очередях получат статус «Неактивен» до подтверждения выплаты.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setWithdrawOpen(false)} style={{ flex: 1, height: 44, borderRadius: 12, border: 0, background: 'var(--bg-elevated)', color: 'var(--fg1)', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Отмена</button>
              <button onClick={() => { setBalance(0); setWithdrawOpen(false); }} style={{ flex: 1, height: 44, borderRadius: 12, border: 0, background: 'var(--accent)', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { App });
