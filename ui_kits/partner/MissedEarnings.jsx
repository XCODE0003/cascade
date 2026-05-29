const missedStyles = {
  wrap: {
    background: '#fff', borderRadius: 20, padding: '22px 24px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 14,
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -80, right: -60,
    width: 240, height: 240,
    background: 'radial-gradient(closest-side, rgba(255,159,10,0.10), transparent)',
    pointerEvents: 'none',
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', position: 'relative' },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  hint: { fontSize: 12, color: 'var(--fg3)' },

  big: {
    fontFamily: 'var(--font-display)',
    fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em',
    color: 'var(--warning)',
    fontVariantNumeric: 'tabular-nums',
    position: 'relative',
  },
  unit: { color: 'var(--fg3)', fontSize: 18, fontWeight: 500, marginLeft: 6 },

  rowList: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    background: 'var(--bg)', borderRadius: 10,
    fontSize: 13,
  },
  user: { color: 'var(--fg1)', fontWeight: 500, flex: 1 },
  meta: { color: 'var(--fg3)', fontSize: 12 },
  amt: { fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--warning)', fontVariantNumeric: 'tabular-nums' },
};

const MISSED = [
  { user: 'u_7702', meta: 'купил Level 4 · ваш макс Level 2', amount: 1200 },
  { user: 'u_2007', meta: 'купил Level 3 · ваш макс Level 2', amount: 420 },
  { user: 'u_1101', meta: 'купил Level 3 · ваш макс Level 2', amount: 420 },
];

function MissedEarnings() {
  const total = MISSED.reduce((s, r) => s + r.amount, 0);
  return (
    <div style={missedStyles.wrap}>
      <div style={missedStyles.glow}/>
      <div style={missedStyles.head}>
        <div>
          <div style={missedStyles.title}>Упущенная прибыль</div>
          <div style={missedStyles.hint}>Бонусы, ушедшие в очередь из-за «обрезки»</div>
        </div>
      </div>
      <div style={missedStyles.big}>
        {total.toLocaleString('ru-RU').replace(/,/g, ' ')}
        <span style={missedStyles.unit}>USDT</span>
      </div>
      <div style={missedStyles.rowList}>
        {MISSED.map(r => (
          <div key={r.user} style={missedStyles.row}>
            <span style={missedStyles.user}>{r.user}</span>
            <span style={missedStyles.meta}>{r.meta}</span>
            <span style={missedStyles.amt}>−{r.amount.toLocaleString('ru-RU').replace(/,/g,' ')} USDT</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MissedEarnings });
