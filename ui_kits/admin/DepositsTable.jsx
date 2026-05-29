const tableStyles = {
  panel: {
    background: '#fff', borderRadius: 18,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  head: { padding: '20px 24px 14px', display: 'flex', alignItems: 'center', gap: 14 },
  title: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg1)' },
  sub: { fontSize: 13, color: 'var(--fg3)' },

  filterBar: {
    padding: '0 24px 14px', display: 'flex', gap: 8, alignItems: 'center',
    borderBottom: '1px solid var(--hairline)',
  },
  seg: { display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 9, padding: 2, gap: 2 },
  segBtn: (active) => ({
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    padding: '6px 12px', fontSize: 12, fontWeight: 600,
    color: 'var(--fg1)', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
  }),

  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: 11, color: 'var(--fg3)', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.04em',
    padding: '12px 24px', textAlign: 'left',
    borderBottom: '1px solid var(--hairline)',
    background: 'var(--bg)',
  },
  td: {
    padding: '14px 24px', borderBottom: '1px solid var(--hairline-soft)',
    fontSize: 13, color: 'var(--fg1)', verticalAlign: 'middle',
  },
  mono: { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' },
  pill: (variant) => {
    const map = {
      pending:  ['var(--warning-bg)', '#8c5400'],
      approved: ['var(--success-bg)', '#1a6e34'],
      hold:     ['var(--accent-bg)',  'var(--accent-press)'],
      grey:     ['var(--neutral-bg)', 'var(--fg2)'],
      rejected: ['var(--danger-bg)',  '#b32420'],
    };
    const [bg, fg] = map[variant] || ['var(--bg-elevated)', 'var(--fg2)'];
    return {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color: fg,
    };
  },
  pillDot: (variant) => {
    const map = { pending: 'var(--warning)', approved: 'var(--success)', hold: 'var(--accent)', grey: 'var(--neutral)', rejected: 'var(--danger)' };
    return { width: 6, height: 6, borderRadius: '50%', background: map[variant] };
  },

  btnRow: { display: 'flex', gap: 6, justifyContent: 'flex-end' },
  btn: (variant) => ({
    height: 30, padding: '0 12px', borderRadius: 8,
    border: 0, cursor: 'pointer',
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: variant === 'approve' ? 'var(--success)' :
                variant === 'reject' ? 'var(--danger)' :
                'var(--bg-elevated)',
    color: variant === 'approve' || variant === 'reject' ? '#fff' : 'var(--fg1)',
  }),
};

const DEPOSITS = [
  { id: '#DEP-04881', user: 'u_4821', level: 2, amount: 100,  ref: 'u_3019',  age: '2 мин',  status: 'pending' },
  { id: '#DEP-04880', user: 'u_9182', level: 1, amount: 20,   ref: '—',        age: '5 мин',  status: 'pending' },
  { id: '#DEP-04879', user: 'u_5512', level: 3, amount: 700,  ref: 'u_2210',  age: '8 мин',  status: 'pending' },
  { id: '#DEP-04878', user: 'u_7702', level: 4, amount: 2000, ref: 'u_1101',  age: '14 мин', status: 'pending' },
  { id: '#DEP-04877', user: 'u_3144', level: 2, amount: 100,  ref: '—',        age: '22 мин', status: 'approved' },
  { id: '#DEP-04876', user: 'u_8893', level: 1, amount: 20,   ref: 'u_1010',  age: '34 мин', status: 'approved' },
  { id: '#DEP-04875', user: 'u_2007', level: 3, amount: 700,  ref: 'u_4821',  age: '52 мин', status: 'approved' },
];

function DepositsTable() {
  const [filter, setFilter] = React.useState('pending');
  const [rows, setRows] = React.useState(DEPOSITS);
  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter);

  const approve = id => setRows(rs => rs.map(r => r.id === id ? { ...r, status: 'approved' } : r));

  return (
    <div style={tableStyles.panel}>
      <div style={tableStyles.head}>
        <div>
          <div style={tableStyles.title}>Депозиты</div>
          <div style={tableStyles.sub}>Подтверждение запускает сплит 10 / 60 / 30 и обновляет очередь</div>
        </div>
      </div>
      <div style={tableStyles.filterBar}>
        <div style={tableStyles.seg}>
          <button style={tableStyles.segBtn(filter==='pending')} onClick={() => setFilter('pending')}>Ожидают</button>
          <button style={tableStyles.segBtn(filter==='approved')} onClick={() => setFilter('approved')}>Подтверждены</button>
          <button style={tableStyles.segBtn(filter==='all')} onClick={() => setFilter('all')}>Все</button>
        </div>
      </div>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>ID</th>
            <th style={tableStyles.th}>Пользователь</th>
            <th style={tableStyles.th}>Уровень</th>
            <th style={tableStyles.th}>Сумма</th>
            <th style={tableStyles.th}>Реферер</th>
            <th style={tableStyles.th}>Время</th>
            <th style={tableStyles.th}>Статус</th>
            <th style={{...tableStyles.th, textAlign: 'right'}}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td style={{...tableStyles.td, ...tableStyles.mono, color: 'var(--fg2)'}}>{r.id}</td>
              <td style={tableStyles.td}>{r.user}</td>
              <td style={tableStyles.td}>Level {r.level}</td>
              <td style={{...tableStyles.td, ...tableStyles.mono, fontWeight: 600}}>{r.amount.toLocaleString('ru-RU').replace(/,/g,' ')} USDT</td>
              <td style={{...tableStyles.td, color: 'var(--fg2)'}}>{r.ref}</td>
              <td style={{...tableStyles.td, color: 'var(--fg3)'}}>{r.age}</td>
              <td style={tableStyles.td}>
                <span style={tableStyles.pill(r.status)}>
                  <span style={tableStyles.pillDot(r.status)}/>
                  {r.status === 'pending' ? 'Ожидает' : 'Подтверждён'}
                </span>
              </td>
              <td style={tableStyles.td}>
                <div style={tableStyles.btnRow}>
                  {r.status === 'pending' ? (
                    <>
                      <button style={tableStyles.btn('approve')} onClick={() => approve(r.id)}><IcCheck size={12}/> Подтвердить</button>
                      <button style={tableStyles.btn('secondary')}>Детали</button>
                    </>
                  ) : (
                    <button style={tableStyles.btn('secondary')}>Детали</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { DepositsTable, tableStyles });
