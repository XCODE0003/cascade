const histMStyles = {
  page: { padding: '8px 16px 24px' },

  summary: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  card: {
    background: '#fff', borderRadius: 14, padding: '14px 14px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
  },
  cardLbl: { fontSize: 11, color: 'var(--fg3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  cardVal: (color) => ({
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
    color: color || 'var(--fg1)',
    fontVariantNumeric: 'tabular-nums',
    marginTop: 4,
  }),

  segWrap: {
    marginTop: 16,
    overflowX: 'auto', overflowY: 'hidden',
    paddingBottom: 4,
  },
  segInner: {
    display: 'flex', gap: 6,
    background: 'var(--bg-elevated)', padding: 3, borderRadius: 11,
    width: 'max-content',
  },
  segBtn: (active) => ({
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    padding: '8px 14px', fontSize: 12, fontWeight: 600,
    color: 'var(--fg1)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  }),
  filterDot: (color) => ({ width: 7, height: 7, borderRadius: '50%', background: color }),

  dayHead: {
    marginTop: 18, marginBottom: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--fg3)',
  },
  row: {
    background: '#fff', borderRadius: 14, padding: '12px 14px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 6,
  },
  ico: (color) => ({
    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
    background: `${color}26`, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700,
  }),
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 13, fontWeight: 600, color: 'var(--fg1)' },
  sub: { fontSize: 11, color: 'var(--fg3)', marginTop: 1 },
  amt: (color) => ({
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontSize: 13, fontWeight: 600, color,
    textAlign: 'right', flexShrink: 0,
  }),
};

const HIST_KINDS = {
  ref:      { dot: '#34C759', amt: '#34C759', icon: '+', label: 'Реф. бонус' },
  cell:     { dot: '#B98900', amt: '#B98900', icon: '●', label: 'Закрашена ячейка' },
  reinv:    { dot: '#FF3B30', amt: '#FF3B30', icon: '↻', label: 'Реинвест' },
  hold:     { dot: '#FF9F0A', amt: '#FF9F0A', icon: '⏳', label: 'Заявка на вывод' },
  deposit:  { dot: '#007AFF', amt: '#007AFF', icon: '↓', label: 'Депозит' },
  bonus:    { dot: '#FFCC00', amt: '#34C759', icon: '★', label: 'Бонусная ячейка' },
};

const HIST_DATA = [
  { day: 'Сегодня', items: [
    { kind: 'ref',     time: '14:23', amount: '+60,00',    sub: 'от u_4821 · Level 2' },
    { kind: 'cell',    time: '13:55', amount: '+210,00',   sub: 'Level 3 · ячейка 3/5' },
    { kind: 'cell',    time: '12:01', amount: '+30,00',    sub: 'Level 2 · ячейка 2/5' },
    { kind: 'deposit', time: '08:30', amount: '+100,00',   sub: 'Level 2 · TRC-20' },
  ]},
  { day: 'Вчера', items: [
    { kind: 'hold',    time: '21:14', amount: '−1 050,00', sub: 'Level 3 · холд 72 ч' },
    { kind: 'reinv',   time: '15:20', amount: '−90,00',    sub: 'Каскад · Level 1' },
    { kind: 'bonus',   time: '11:08', amount: '+6,00',     sub: 'от u_9182 · Level 1' },
  ]},
];

const HFILTERS = [
  { key: 'all',   label: 'Все',       dot: null },
  { key: 'ref',   label: 'Бонусы',    dot: '#34C759' },
  { key: 'cell',  label: 'Ячейки',    dot: '#B98900' },
  { key: 'reinv', label: 'Реинвесты', dot: '#FF3B30' },
  { key: 'hold',  label: 'Вывод',     dot: '#FF9F0A' },
];

function HistoryScreen() {
  const [filter, setFilter] = React.useState('all');
  const match = (k) => filter === 'all' || k === filter || (filter === 'hold' && (k === 'hold' || k === 'deposit')) || (filter === 'ref' && (k === 'ref' || k === 'bonus'));

  return (
    <MobileShell title="История">
      <div style={histMStyles.page}>

        <div style={histMStyles.summary}>
          <div style={histMStyles.card}>
            <div style={histMStyles.cardLbl}>Доход · 30 дн</div>
            <div style={histMStyles.cardVal('var(--success)')}>+ 1 842 <span style={{ fontSize: 12, color: 'var(--fg3)', fontWeight: 500 }}>USDT</span></div>
          </div>
          <div style={histMStyles.card}>
            <div style={histMStyles.cardLbl}>Реинвесты · 30 дн</div>
            <div style={histMStyles.cardVal('var(--danger)')}>− 432 <span style={{ fontSize: 12, color: 'var(--fg3)', fontWeight: 500 }}>USDT</span></div>
          </div>
          <div style={histMStyles.card}>
            <div style={histMStyles.cardLbl}>Выведено</div>
            <div style={histMStyles.cardVal('var(--warning)')}>− 180 <span style={{ fontSize: 12, color: 'var(--fg3)', fontWeight: 500 }}>USDT</span></div>
          </div>
          <div style={histMStyles.card}>
            <div style={histMStyles.cardLbl}>Операций</div>
            <div style={histMStyles.cardVal()}>124</div>
          </div>
        </div>

        <div style={histMStyles.segWrap}>
          <div style={histMStyles.segInner}>
            {HFILTERS.map(f => (
              <button key={f.key} style={histMStyles.segBtn(filter === f.key)} onClick={() => setFilter(f.key)}>
                {f.dot && <span style={histMStyles.filterDot(f.dot)}/>}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {HIST_DATA.map(group => {
          const visible = group.items.filter(it => match(it.kind));
          if (!visible.length) return null;
          return (
            <React.Fragment key={group.day}>
              <div style={histMStyles.dayHead}>{group.day}</div>
              {visible.map((it, i) => {
                const k = HIST_KINDS[it.kind];
                return (
                  <div key={i} style={histMStyles.row}>
                    <div style={histMStyles.ico(k.dot)}>{k.icon}</div>
                    <div style={histMStyles.body}>
                      <div style={histMStyles.title}>{k.label}</div>
                      <div style={histMStyles.sub}>{it.sub} · {it.time}</div>
                    </div>
                    <div style={histMStyles.amt(k.amt)}>{it.amount}</div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

      </div>
    </MobileShell>
  );
}

Object.assign(window, { HistoryScreen });
