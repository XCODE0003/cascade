const historyStyles = {
  wrap: {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  header: {
    padding: '18px 22px 14px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg1)',
  },
  filter: {
    display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 9, padding: 2, marginLeft: 'auto', gap: 2,
  },
  filterBtn: (active) => ({
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    padding: '5px 11px', fontSize: 12, fontWeight: 600,
    color: 'var(--fg1)', borderRadius: 7, cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  row: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 22px',
    borderTop: '1px solid var(--hairline-soft)',
  },
  ico: (kind) => {
    const map = {
      ref:     ['var(--success-bg)', 'var(--success)'],
      cell:    ['var(--gold-bg)',    'var(--gold)'],
      reinv:   ['var(--danger-bg)',  'var(--danger)'],
      hold:    ['var(--warning-bg)', 'var(--warning)'],
      deposit: ['var(--accent-bg)',  'var(--accent)'],
    };
    const [bg, fg] = map[kind] || ['var(--bg-elevated)', 'var(--fg2)'];
    return {
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    };
  },
  body: { flex: 1, minWidth: 0 },
  title2: { fontSize: 13, fontWeight: 600, color: 'var(--fg1)' },
  sub: { fontSize: 12, color: 'var(--fg3)', marginTop: 2 },
  amt: (sign) => ({
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontSize: 14, fontWeight: 600,
    color: sign === 'pos' ? 'var(--success)' :
           sign === 'neg' ? 'var(--danger)' :
           sign === 'gold' ? 'var(--gold)' :
           sign === 'warn' ? 'var(--warning)' : 'var(--fg1)',
  }),
  time: { fontSize: 11, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' },
};

const ROWS = [
  { kind: 'ref',     title: 'Реферальный бонус',     sub: 'от user_4821 · Level 2', amount: '+60,00', sign: 'pos',  time: '14:23' },
  { kind: 'cell',    title: 'Закрашена ячейка',      sub: 'Очередь 700 · ячейка 3 из 5', amount: '+210,00', sign: 'gold', time: '13:55' },
  { kind: 'cell',    title: 'Закрашена ячейка',      sub: 'Очередь 100 · ячейка 2 из 5', amount: '+30,00',  sign: 'gold', time: '12:01' },
  { kind: 'hold',    title: 'Заявка на вывод · холд', sub: 'Освободится через 36 ч 12 мин', amount: '−1 050,00', sign: 'warn', time: 'вчера' },
  { kind: 'reinv',   title: 'Реинвест',              sub: 'Каскад в Очередь 100', amount: '−90,00',  sign: 'neg', time: 'вчера' },
  { kind: 'deposit', title: 'Депозит подтверждён',    sub: 'Level 3 · 700 USDT', amount: '+0,00',   sign: 'neu', time: '2 дн' },
  { kind: 'ref',     title: 'Реферальный бонус',     sub: 'от user_9182 · Level 1', amount: '+12,00', sign: 'pos', time: '2 дн' },
];

const ICON_FOR = {
  ref:     '+',
  cell:    '●',
  reinv:   '↻',
  hold:    '⏳',
  deposit: '↓',
};

function HistoryFeed() {
  const [filter, setFilter] = React.useState('all');
  return (
    <div style={historyStyles.wrap}>
      <div style={historyStyles.header}>
        <div style={historyStyles.title}>История операций</div>
        <div style={historyStyles.filter}>
          {['all','Доходы','Расходы','Холд'].map((k, i) => {
            const key = ['all','income','out','hold'][i];
            const lbl = i === 0 ? 'Все' : k;
            return (
              <button key={key} style={historyStyles.filterBtn(filter === key)} onClick={() => setFilter(key)}>{lbl}</button>
            );
          })}
        </div>
      </div>
      {ROWS.map((r, i) => (
        <div key={i} style={historyStyles.row}>
          <div style={historyStyles.ico(r.kind)}>{ICON_FOR[r.kind]}</div>
          <div style={historyStyles.body}>
            <div style={historyStyles.title2}>{r.title}</div>
            <div style={historyStyles.sub}>{r.sub}</div>
          </div>
          <div style={historyStyles.amt(r.sign)}>{r.amount} USDT</div>
          <div style={historyStyles.time}>{r.time}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { HistoryFeed });
