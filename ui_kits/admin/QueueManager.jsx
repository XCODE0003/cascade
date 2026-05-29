const queueManagerStyles = {
  tabs: {
    display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3,
  },
  tab: (active, color) => ({
    border: 0, padding: '8px 16px',
    background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  }),
  tabDot: (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color }),

  row: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 24px',
    borderBottom: '1px solid var(--hairline-soft)',
  },
  pos: {
    width: 32, height: 32, borderRadius: 10,
    background: 'var(--bg-elevated)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
    color: 'var(--fg2)', flexShrink: 0,
  },
  posFirst: {
    background: 'var(--accent-bg)', color: 'var(--accent-press)',
  },
  user: { fontSize: 14, fontWeight: 600, color: 'var(--fg1)' },
  meta: { fontSize: 12, color: 'var(--fg3)', marginTop: 2 },

  cellsRow: { display: 'flex', gap: 3 },
  cell: (filled) => ({
    width: 18, height: 22, borderRadius: 4,
    background: filled ? 'var(--success)' : 'var(--cell-empty-bg)',
    boxShadow: filled ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
  }),

  timer: (status) => ({
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
    color: status === 'ready' ? 'var(--success)' :
           status === 'locked' ? 'var(--accent)' :
           status === 'grey' ? 'var(--fg3)' : 'var(--fg2)',
    fontVariantNumeric: 'tabular-nums',
    minWidth: 110, textAlign: 'right',
  }),

  actionBtn: {
    height: 30, width: 30,
    borderRadius: 8,
    background: 'var(--bg-elevated)',
    border: 0, cursor: 'pointer', color: 'var(--fg2)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  },
};

const QUEUE_DATA = {
  20: [
    { pos: 1, user: 'u_4821', filled: 4, status: 'locked', timer: '2 д 14:22:08', joined: '5 д назад' },
    { pos: 2, user: 'u_9182', filled: 3, status: 'locked', timer: '4 д 06:00:00', joined: '3 д назад' },
    { pos: 3, user: 'u_3019', filled: 2, status: 'locked', timer: '5 д 12:14:00', joined: '2 д назад' },
    { pos: 4, user: 'u_7702', filled: 1, status: 'locked', timer: '6 д 21:08:00', joined: 'вчера' },
    { pos: 5, user: 'u_8893', filled: 0, status: 'locked', timer: '6 д 23:48:11', joined: '12 мин назад' },
  ],
  100: [
    { pos: 1, user: 'u_5512', filled: 5, status: 'ready',  timer: 'Готов',           joined: '8 д назад' },
    { pos: 2, user: 'u_2210', filled: 4, status: 'locked', timer: '1 д 02:18:00',     joined: '6 д назад' },
    { pos: 3, user: 'u_1010', filled: 2, status: 'locked', timer: '3 д 15:08:00',     joined: '4 д назад' },
    { pos: 4, user: 'u_3144', filled: 0, status: 'grey',   timer: 'Серый статус',     joined: '—' },
  ],
  700: [
    { pos: 1, user: 'u_2007', filled: 3, status: 'locked', timer: '3 д 09:11:00',     joined: '4 д назад' },
    { pos: 2, user: 'u_1101', filled: 1, status: 'locked', timer: '6 д 03:14:55',     joined: 'вчера' },
  ],
  2000: [
    { pos: 1, user: 'u_7702', filled: 2, status: 'locked', timer: '6 д 03:14:55',     joined: '12 ч назад' },
  ],
};

const TIERS = [
  { id: 20,   color: 'var(--level-1)', label: 'Очередь 20' },
  { id: 100,  color: 'var(--level-2)', label: 'Очередь 100' },
  { id: 700,  color: 'var(--level-3)', label: 'Очередь 700' },
  { id: 2000, color: 'var(--level-4)', label: 'Очередь 2000' },
];

function QueueManager() {
  const [tier, setTier] = React.useState(20);
  const data = QUEUE_DATA[tier];

  return (
    <div style={tableStyles.panel}>
      <div style={tableStyles.head}>
        <div>
          <div style={tableStyles.title}>Очереди</div>
          <div style={tableStyles.sub}>Каждый уровень — изолированный «котёл». Ликвидность не пересекается между тарифами.</div>
        </div>
      </div>
      <div style={{ padding: '0 24px 14px', borderBottom: '1px solid var(--hairline)' }}>
        <div style={queueManagerStyles.tabs}>
          {TIERS.map(t => (
            <button key={t.id} style={queueManagerStyles.tab(tier === t.id, t.color)} onClick={() => setTier(t.id)}>
              <span style={queueManagerStyles.tabDot(t.color)}/>
              {t.label}
              <span style={{ marginLeft: 4, fontSize: 11, color: 'var(--fg3)', fontVariantNumeric: 'tabular-nums' }}>
                {QUEUE_DATA[t.id].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {data.map(r => (
        <div key={r.user} style={queueManagerStyles.row}>
          <div style={{...queueManagerStyles.pos, ...(r.pos === 1 ? queueManagerStyles.posFirst : {})}}>
            {r.pos}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={queueManagerStyles.user}>{r.user}</div>
            <div style={queueManagerStyles.meta}>В очереди с {r.joined}</div>
          </div>

          <div style={queueManagerStyles.cellsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={queueManagerStyles.cell(i < r.filled)}/>
            ))}
          </div>

          <div style={queueManagerStyles.timer(r.status)}>
            {r.status === 'ready' && '● Готов'}
            {r.status === 'locked' && r.timer}
            {r.status === 'grey' && '⊘ Серый'}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button style={queueManagerStyles.actionBtn} title="В начало"><IcArrowUp size={14}/></button>
            <button style={queueManagerStyles.actionBtn} title="В конец"><IcArrowDown size={14}/></button>
            <button style={queueManagerStyles.actionBtn} title="Удалить"><IcClose size={14}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { QueueManager });
