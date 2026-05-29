const sheetStyles = {
  scrim: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100,
    animation: 'fade 200ms ease',
  },
  sheet: {
    width: 440,
    background: '#fff',
    borderRadius: 20,
    padding: '24px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.20)',
    position: 'relative',
  },
  close: {
    position: 'absolute', top: 16, right: 16,
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--bg-elevated)',
    border: 0, cursor: 'pointer', color: 'var(--fg2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em',
    color: 'var(--fg1)', marginBottom: 4,
  },
  sub: { fontSize: 13, color: 'var(--fg2)', marginBottom: 20 },

  tabs: {
    display: 'flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3, marginBottom: 18,
  },
  tab: (active) => ({
    flex: 1, padding: '8px 0',
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
  }),

  level: (active, color) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px',
    background: active ? '#fff' : '#fff',
    border: `1.5px solid ${active ? color : 'transparent'}`,
    boxShadow: active ? `0 0 0 4px ${color}1A` : 'inset 0 0 0 1px var(--hairline)',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all var(--dur) var(--ease)',
  }),
  levelDot: (color) => ({ width: 10, height: 10, borderRadius: '50%', background: color }),
  levelName: { fontSize: 14, fontWeight: 600, color: 'var(--fg1)' },
  levelMeta: { fontSize: 12, color: 'var(--fg3)', marginTop: 1 },
  levelEntry: { marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--fg1)' },

  notice: {
    display: 'flex', gap: 10, padding: '12px 14px',
    background: 'var(--accent-bg)', borderRadius: 12,
    color: 'var(--accent-press)', fontSize: 12, lineHeight: 1.4,
    marginTop: 14,
  },

  footer: { display: 'flex', gap: 8, marginTop: 20 },
  btn: (variant) => ({
    flex: 1, height: 44, borderRadius: 12,
    fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
    border: 0, cursor: 'pointer',
    background: variant === 'primary' ? 'var(--accent)' : 'var(--bg-elevated)',
    color: variant === 'primary' ? '#fff' : 'var(--fg1)',
  }),
};

const LEVELS = [
  { level: 1, entry: 20,   payout: 30,    color: '#5AC8FA' },
  { level: 2, entry: 100,  payout: 150,   color: '#007AFF' },
  { level: 3, entry: 700,  payout: 1050,  color: '#5856D6' },
  { level: 4, entry: 2000, payout: 3000,  color: '#AF52DE' },
];

function DepositSheet({ open, onClose, defaultLevel = 2, balance = 1248 }) {
  const [tab, setTab] = React.useState('external');
  const [picked, setPicked] = React.useState(defaultLevel);
  if (!open) return null;

  const lvl = LEVELS.find(l => l.level === picked);
  const insufficient = tab === 'internal' && balance < lvl.entry;

  return (
    <div style={sheetStyles.scrim} onClick={onClose}>
      <div style={sheetStyles.sheet} onClick={e => e.stopPropagation()}>
        <button style={sheetStyles.close} onClick={onClose}><IcClose size={14}/></button>
        <div style={sheetStyles.title}>Активировать уровень</div>
        <div style={sheetStyles.sub}>Выберите тариф и способ оплаты</div>

        <div style={sheetStyles.tabs}>
          <button style={sheetStyles.tab(tab === 'external')} onClick={() => setTab('external')}>
            Внешний кошелёк
          </button>
          <button style={sheetStyles.tab(tab === 'internal')} onClick={() => setTab('internal')}>
            С баланса · {balance} USDT
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LEVELS.map(l => (
            <div key={l.level} style={sheetStyles.level(picked === l.level, l.color)} onClick={() => setPicked(l.level)}>
              <span style={sheetStyles.levelDot(l.color)}/>
              <div>
                <div style={sheetStyles.levelName}>Level {l.level}</div>
                <div style={sheetStyles.levelMeta}>Цикл 150% · выплата {l.payout} USDT</div>
              </div>
              <div style={sheetStyles.levelEntry}>{l.entry} USDT</div>
            </div>
          ))}
        </div>

        <div style={sheetStyles.notice}>
          <IcInfo size={14}/>
          <span>
            Комиссия сервиса <strong>10%</strong> удерживается при активации.
            В очередь поступает <strong>90%</strong> суммы по правилу каскада.
          </span>
        </div>

        <div style={sheetStyles.footer}>
          <button style={sheetStyles.btn('secondary')} onClick={onClose}>Отмена</button>
          <button
            style={{...sheetStyles.btn('primary'), ...(insufficient ? { opacity: 0.5, cursor: 'not-allowed' } : {})}}
            disabled={insufficient}
            onClick={onClose}>
            {insufficient ? 'Недостаточно средств' :
             tab === 'external' ? `Сгенерировать адрес · ${lvl.entry} USDT` : `Списать ${lvl.entry} USDT`}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DepositSheet });
