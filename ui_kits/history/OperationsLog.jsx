const opLogStyles = {
  panel: {
    background: '#fff', borderRadius: 18,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  toolbar: {
    padding: '16px 24px',
    display: 'flex', alignItems: 'center', gap: 10,
    borderBottom: '1px solid var(--hairline)',
  },
  search: {
    flex: 1, maxWidth: 320,
    height: 36, padding: '0 14px',
    borderRadius: 10,
    background: 'var(--bg-elevated)',
    border: 0, fontSize: 13, fontFamily: 'inherit', outline: 'none',
    color: 'var(--fg1)',
  },
  filterGroup: {
    marginLeft: 'auto', display: 'inline-flex', gap: 6,
  },
  filter: { display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 9, padding: 2, gap: 2 },
  filterBtn: (active) => ({
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    padding: '6px 12px', fontSize: 12, fontWeight: 600,
    color: 'var(--fg1)', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }),
  filterDot: (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color }),

  dayHeader: {
    padding: '14px 24px 8px',
    fontSize: 11, fontWeight: 700, color: 'var(--fg3)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    background: 'var(--bg)',
    borderTop: '1px solid var(--hairline)',
    borderBottom: '1px solid var(--hairline-soft)',
  },

  row: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '14px 24px',
    borderBottom: '1px solid var(--hairline-soft)',
  },
  ico: (color) => ({
    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
    background: `${color}26`,
    color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
  }),
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: 600, color: 'var(--fg1)' },
  sub: { fontSize: 12, color: 'var(--fg3)', marginTop: 2 },

  level: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
    color: 'var(--fg2)', padding: '3px 8px',
    background: 'var(--bg-elevated)', borderRadius: 999,
  },
  amount: (color) => ({
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontSize: 14, fontWeight: 600,
    color,
    minWidth: 130, textAlign: 'right',
  }),
  time: { fontSize: 11, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', minWidth: 50, textAlign: 'right' },
};

// Color tokens for each kind matched to brand semantic colors
const KINDS = {
  ref:     { dot: '#34C759', amount: '#34C759', icon: '+', label: 'Реферальный бонус' },     // green
  cell:    { dot: '#B98900', amount: '#B98900', icon: '●', label: 'Закрашена ячейка' },       // gold
  reinv:   { dot: '#FF3B30', amount: '#FF3B30', icon: '↻', label: 'Реинвест' },               // red
  autorei: { dot: '#FF3B30', amount: '#FF3B30', icon: '↻', label: 'Авто-реинвест за прогулы' },
  hold:    { dot: '#FF9F0A', amount: '#FF9F0A', icon: '⏳', label: 'Заявка на вывод' },        // yellow
  withdraw:{ dot: '#FF9F0A', amount: '#FF9F0A', icon: '↑', label: 'Выплата отправлена' },
  deposit: { dot: '#007AFF', amount: '#007AFF', icon: '↓', label: 'Депозит зачислен' },        // blue
  upgrade: { dot: '#5856D6', amount: '#5856D6', icon: '↑', label: 'Апгрейд с баланса' },
  bonus:   { dot: '#FFCC00', amount: '#34C759', icon: '★', label: 'Бонусная ячейка от реферала' },
};

const RAW_LOG = [
  { day: 'Сегодня · 18 мая', items: [
    { kind: 'ref',     time: '14:23', amount: '+60,00',    level: 'Level 2', sub: 'от u_4821' },
    { kind: 'cell',    time: '13:55', amount: '+210,00',   level: 'Level 3', sub: 'Ячейка 3 из 5' },
    { kind: 'cell',    time: '12:01', amount: '+30,00',    level: 'Level 2', sub: 'Ячейка 2 из 5' },
    { kind: 'deposit', time: '08:30', amount: '+100,00',   level: 'Level 2', sub: '0x71b2…d4c0 · TRC-20' },
  ]},
  { day: 'Вчера · 17 мая', items: [
    { kind: 'hold',    time: '21:14', amount: '−1 050,00', level: 'Level 3', sub: 'Создана заявка · холд 72 ч' },
    { kind: 'cell',    time: '18:42', amount: '+30,00',    level: 'Level 2', sub: 'Ячейка 1 из 5' },
    { kind: 'reinv',   time: '15:20', amount: '−90,00',    level: 'Level 1', sub: 'Каскад в Очередь 100' },
    { kind: 'bonus',   time: '11:08', amount: '+6,00',     level: 'Level 1', sub: 'Бонусная ячейка от u_9182' },
    { kind: 'ref',     time: '11:08', amount: '+12,00',    level: 'Level 1', sub: 'от u_9182' },
  ]},
  { day: '16 мая', items: [
    { kind: 'autorei', time: '03:00', amount: '−27,00',    level: 'Level 1', sub: 'Прогул 3 дня — система запустила реинвест' },
    { kind: 'withdraw',time: '01:14', amount: '−30,00',    level: '—',        sub: 'Выплата отправлена · 0xa28c…91ee' },
  ]},
  { day: '15 мая', items: [
    { kind: 'upgrade', time: '22:18', amount: '−700,00',   level: 'Level 3', sub: 'Активирован с внутреннего баланса' },
    { kind: 'cell',    time: '18:30', amount: '+30,00',    level: 'Level 2', sub: 'Ячейка 5 из 5 · готов к выводу' },
    { kind: 'ref',     time: '18:30', amount: '+60,00',    level: 'Level 2', sub: 'от u_3019' },
  ]},
];

const FILTERS = [
  { key: 'all',    label: 'Все',          dot: 'var(--fg2)' },
  { key: 'ref',    label: 'Бонусы',       dot: '#34C759' },
  { key: 'cell',   label: 'Ячейки',       dot: '#B98900' },
  { key: 'reinv',  label: 'Реинвесты',    dot: '#FF3B30' },
  { key: 'hold',   label: 'Вывод',        dot: '#FF9F0A' },
];

function OperationsLog() {
  const [filter, setFilter] = React.useState('all');

  const matchFilter = (kind) => {
    if (filter === 'all') return true;
    if (filter === 'ref')   return kind === 'ref' || kind === 'bonus';
    if (filter === 'reinv') return kind === 'reinv' || kind === 'autorei' || kind === 'upgrade';
    if (filter === 'hold')  return kind === 'hold' || kind === 'withdraw' || kind === 'deposit';
    return kind === filter;
  };

  return (
    <div style={opLogStyles.panel}>
      <div style={opLogStyles.toolbar}>
        <input style={opLogStyles.search} placeholder="Поиск по ID, кошельку, сумме…"/>
        <div style={opLogStyles.filterGroup}>
          <div style={opLogStyles.filter}>
            {FILTERS.map(f => (
              <button key={f.key} style={opLogStyles.filterBtn(filter === f.key)} onClick={() => setFilter(f.key)}>
                {f.key !== 'all' && <span style={opLogStyles.filterDot(f.dot)}/>}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {RAW_LOG.map(group => {
        const visible = group.items.filter(it => matchFilter(it.kind));
        if (!visible.length) return null;
        return (
          <React.Fragment key={group.day}>
            <div style={opLogStyles.dayHeader}>{group.day}</div>
            {visible.map((it, i) => {
              const k = KINDS[it.kind];
              return (
                <div key={i} style={opLogStyles.row}>
                  <div style={opLogStyles.ico(k.dot)}>{k.icon}</div>
                  <div style={opLogStyles.body}>
                    <div style={opLogStyles.title}>{k.label}</div>
                    <div style={opLogStyles.sub}>{it.sub}</div>
                  </div>
                  <span style={opLogStyles.level}>{it.level}</span>
                  <div style={opLogStyles.amount(k.amount)}>{it.amount} USDT</div>
                  <div style={opLogStyles.time}>{it.time}</div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

Object.assign(window, { OperationsLog });
