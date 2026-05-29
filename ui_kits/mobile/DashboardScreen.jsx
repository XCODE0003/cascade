const dashStyles = {
  page: { padding: '8px 16px 24px' },

  hero: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px 20px 22px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 16,
    position: 'relative', overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: -80, right: -50,
    width: 240, height: 240,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.10), transparent)',
    pointerEvents: 'none',
  },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)', position: 'relative' },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05,
    color: 'var(--fg1)', fontVariantNumeric: 'tabular-nums',
    position: 'relative',
  },
  unit: { color: 'var(--fg3)', fontSize: 17, fontWeight: 500, marginLeft: 6 },
  delta: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 12, fontWeight: 600, color: 'var(--success)',
    background: 'var(--success-bg)', padding: '3px 9px', borderRadius: 999,
    position: 'relative', alignSelf: 'flex-start', marginTop: -4,
  },
  heroActions: { display: 'flex', gap: 8, position: 'relative' },
  heroBtn: (variant) => ({
    flex: 1, height: 44, borderRadius: 12,
    border: 0, fontFamily: 'inherit',
    fontSize: 14, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    background: variant === 'primary' ? 'var(--accent)' : 'var(--bg-elevated)',
    color: variant === 'primary' ? '#fff' : 'var(--fg1)',
    cursor: 'pointer',
  }),

  sectionRow: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    margin: '24px 0 12px',
  },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 },
  sectionSub: { fontSize: 12, color: 'var(--fg3)' },

  queueGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  qCard: {
    background: '#fff', borderRadius: 16,
    padding: '16px 16px 14px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  qHead: { display: 'flex', alignItems: 'center', gap: 10 },
  qLevelDot: (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color }),
  qLevel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg2)' },
  qAmount: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-display)',
    fontSize: 19, fontWeight: 700, letterSpacing: '-0.015em',
    fontVariantNumeric: 'tabular-nums',
  },
  qAmountUnit: { color: 'var(--fg3)', fontSize: 12, fontWeight: 500, marginLeft: 3 },

  qCells: { display: 'flex', gap: 4 },
  qCell: (filled) => ({
    flex: 1, height: 22, borderRadius: 6,
    background: filled ? 'var(--success)' : 'var(--cell-empty-bg)',
    boxShadow: filled ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
  }),

  qFoot: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 },
  qTimer: (status) => ({
    fontFamily: 'var(--font-mono)', fontWeight: 500,
    color: status === 'ready' ? 'var(--success)' :
           status === 'locked' ? 'var(--accent)' :
           'var(--fg3)',
    fontVariantNumeric: 'tabular-nums',
    flex: 1,
  }),
  qChevron: { color: 'var(--fg3)' },
};

const QUEUES_M = [
  { level: 1, color: '#5AC8FA', entry: 20,   filled: 5, status: 'ready',    timer: 'Готов к выводу' },
  { level: 2, color: '#007AFF', entry: 100,  filled: 3, status: 'locked',   timer: '4 д 12:32:08' },
  { level: 3, color: '#5856D6', entry: 700,  filled: 0, status: 'inactive', timer: 'Не активирован' },
  { level: 4, color: '#AF52DE', entry: 2000, filled: 2, status: 'locked',   timer: '6 д 03:14:55' },
];

function DashboardScreen({ onDeposit, onWithdraw, onQueueTap }) {
  return (
    <MobileShell title="Кабинет">
      <div style={dashStyles.page}>

        <div style={dashStyles.hero}>
          <div style={dashStyles.heroGlow}/>
          <div>
            <div style={dashStyles.label}>Внутренний баланс</div>
            <div style={dashStyles.amount}>1 248,00<span style={dashStyles.unit}>USDT</span></div>
          </div>
          <span style={dashStyles.delta}>
            <IcArrowUp size={11}/> +210,00 за неделю
          </span>
          <div style={dashStyles.heroActions}>
            <button style={dashStyles.heroBtn('secondary')} onClick={onDeposit}>
              <IcPlus size={14}/> Пополнить
            </button>
            <button style={dashStyles.heroBtn('primary')} onClick={onWithdraw}>
              <IcArrowUp size={14}/> Вывод
            </button>
          </div>
        </div>

        <div style={dashStyles.sectionRow}>
          <div style={dashStyles.sectionTitle}>Очереди</div>
          <div style={dashStyles.sectionSub}>4 уровня</div>
        </div>

        <div style={dashStyles.queueGrid}>
          {QUEUES_M.map(q => (
            <div key={q.level} style={dashStyles.qCard} onClick={() => onQueueTap && onQueueTap(q.level)}>
              <div style={dashStyles.qHead}>
                <span style={dashStyles.qLevelDot(q.color)}/>
                <span style={dashStyles.qLevel}>Level {q.level}</span>
                <span style={dashStyles.qAmount}>
                  {q.entry.toLocaleString('ru-RU').replace(/,/g,' ')}
                  <span style={dashStyles.qAmountUnit}>USDT</span>
                </span>
              </div>
              <div style={dashStyles.qCells}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={dashStyles.qCell(i < q.filled)}/>
                ))}
              </div>
              <div style={dashStyles.qFoot}>
                <span style={{ fontWeight: 600, color: 'var(--fg2)', fontFamily: 'var(--font-mono)' }}>
                  {q.status === 'inactive' ? '—' : `${q.filled}/5`}
                </span>
                <span style={dashStyles.qTimer(q.status)}>
                  {q.status === 'ready'   && <><IcCheck size={11}/> {q.timer}</>}
                  {q.status === 'locked'  && <><IcLock size={10}/> {q.timer}</>}
                  {q.status === 'inactive'&& q.timer}
                </span>
                <IcChevron size={14} style={dashStyles.qChevron}/>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MobileShell>
  );
}

Object.assign(window, { DashboardScreen });
