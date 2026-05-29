function MobileApp() {
  const [tab, setTab] = React.useState('dashboard');
  const [sheet, setSheet] = React.useState(null);
  const [pickedLevel, setPickedLevel] = React.useState(2);

  const renderScreen = () => {
    switch (tab) {
      case 'dashboard':
        return <DashboardScreen
          onDeposit={() => { setPickedLevel(2); setSheet('deposit'); }}
          onWithdraw={() => setSheet('withdraw')}
          onQueueTap={(lvl) => { setPickedLevel(lvl); setSheet('deposit'); }}/>;
      case 'wallet':   return <WalletScreen/>;
      case 'partner':  return <PartnerScreen/>;
      case 'history':  return <HistoryScreen/>;
      case 'profile':  return <ProfileScreen/>;
      default: return null;
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomTabBar active={tab} onSelect={setTab}/>

      <Sheet open={sheet === 'deposit'} onClose={() => setSheet(null)} title="Активировать уровень">
        <DepositSheetMobile defaultLevel={pickedLevel} onClose={() => setSheet(null)}/>
      </Sheet>

      <Sheet open={sheet === 'withdraw'} onClose={() => setSheet(null)} title="Подтвердите вывод">
        <WithdrawSheetMobile onClose={() => setSheet(null)}/>
      </Sheet>
    </>
  );
}

/* ---------- Bottom-sheet deposit picker ---------- */
const dsStyles = {
  tabs: { display: 'flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3, marginBottom: 16 },
  tab: (active) => ({
    flex: 1, padding: '9px 0',
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
  }),
  level: (active, color) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px', borderRadius: 14,
    background: '#fff',
    border: `1.5px solid ${active ? color : 'transparent'}`,
    boxShadow: active ? `0 0 0 4px ${color}1A` : 'inset 0 0 0 1px var(--hairline)',
    cursor: 'pointer',
    marginBottom: 8,
  }),
  notice: { display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--accent-bg)', color: 'var(--accent-press)', fontSize: 12, lineHeight: 1.4, borderRadius: 10, marginTop: 12 },
  submit: (en) => ({
    width: '100%', height: 48, borderRadius: 12, border: 0,
    background: en ? 'var(--accent)' : 'var(--bg-elevated)',
    color: en ? '#fff' : 'var(--fg3)',
    fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
    marginTop: 14, cursor: 'pointer',
  }),
};

const DEPOSIT_LEVELS = [
  { level: 1, entry: 20,   payout: 30,    color: '#5AC8FA' },
  { level: 2, entry: 100,  payout: 150,   color: '#007AFF' },
  { level: 3, entry: 700,  payout: 1050,  color: '#5856D6' },
  { level: 4, entry: 2000, payout: 3000,  color: '#AF52DE' },
];

function DepositSheetMobile({ defaultLevel, onClose }) {
  const [picked, setPicked] = React.useState(defaultLevel);
  const [src, setSrc]     = React.useState('external');
  const balance = 1248;
  const lvl = DEPOSIT_LEVELS.find(l => l.level === picked);
  const insufficient = src === 'internal' && balance < lvl.entry;
  return (
    <>
      <div style={dsStyles.tabs}>
        <button style={dsStyles.tab(src === 'external')} onClick={() => setSrc('external')}>Внешний кошелёк</button>
        <button style={dsStyles.tab(src === 'internal')} onClick={() => setSrc('internal')}>С баланса · {balance}</button>
      </div>
      {DEPOSIT_LEVELS.map(l => (
        <div key={l.level} style={dsStyles.level(picked === l.level, l.color)} onClick={() => setPicked(l.level)}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Level {l.level}</div>
            <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 1 }}>Цикл 150% · {l.payout.toLocaleString('ru-RU').replace(/,/g,' ')} USDT</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
            {l.entry.toLocaleString('ru-RU').replace(/,/g,' ')} USDT
          </div>
        </div>
      ))}
      <div style={dsStyles.notice}>
        <IcInfo size={13}/><span>Комиссия 10% удерживается при активации. 90% поступает в очередь по правилу каскада.</span>
      </div>
      <button style={dsStyles.submit(!insufficient)} disabled={insufficient} onClick={onClose}>
        {insufficient ? 'Недостаточно средств' :
         src === 'external' ? `Сгенерировать адрес · ${lvl.entry} USDT` :
         `Списать ${lvl.entry} USDT`}
      </button>
    </>
  );
}

function WithdrawSheetMobile({ onClose }) {
  return (
    <>
      <div style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.5 }}>
        На внешний кошелёк будет отправлено <strong style={{ color: 'var(--fg1)' }}>1 248,00 USDT</strong>. Заявка получит статус <strong style={{ color: 'var(--warning)' }}>«В ожидании выплаты»</strong> и будет обработана в течение 72 часов.
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'var(--warning-bg)', borderRadius: 12, marginTop: 14, color: '#8c5400', fontSize: 12, lineHeight: 1.45 }}>
        <IcInfo size={14}/>
        <span>В момент подачи заявки счётчик ячеек обнулится. Ваши записи в очередях получат серый статус до подтверждения выплаты.</span>
      </div>
      <button style={{ width: '100%', height: 48, marginTop: 18, borderRadius: 12, border: 0, background: 'var(--accent)', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 600 }} onClick={onClose}>
        Подтвердить
      </button>
      <button style={{ width: '100%', height: 44, marginTop: 8, borderRadius: 12, border: 0, background: 'transparent', color: 'var(--fg2)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500 }} onClick={onClose}>
        Отмена
      </button>
    </>
  );
}

Object.assign(window, { MobileApp });
