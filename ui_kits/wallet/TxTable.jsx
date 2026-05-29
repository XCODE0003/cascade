const txTableStyles = {
  wrap: {
    background: '#fff', borderRadius: 18,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  head: {
    padding: '18px 24px 14px',
    display: 'flex', alignItems: 'baseline', gap: 12,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  sub: { fontSize: 12, color: 'var(--fg3)' },

  filter: { marginLeft: 'auto', display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 9, padding: 2, gap: 2 },
  filterBtn: (active) => ({
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    padding: '5px 11px', fontSize: 12, fontWeight: 600,
    color: 'var(--fg1)', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
  }),

  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: 11, color: 'var(--fg3)', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.04em',
    padding: '12px 24px', textAlign: 'left',
    borderTop: '1px solid var(--hairline)',
    borderBottom: '1px solid var(--hairline)',
    background: 'var(--bg)',
  },
  td: {
    padding: '14px 24px',
    borderBottom: '1px solid var(--hairline-soft)',
    fontSize: 13, color: 'var(--fg1)',
  },
  txHash: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)' },
  amount: (sign) => ({
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontWeight: 600,
    color: sign === 'pos' ? 'var(--success)' : 'var(--danger)',
  }),
  pill: (variant) => {
    const map = {
      done:     ['var(--success-bg)', '#1a6e34', 'var(--success)', 'Подтверждена'],
      hold:     ['var(--accent-bg)', 'var(--accent-press)', 'var(--accent)', 'Холд 72 ч'],
      pending:  ['var(--warning-bg)', '#8c5400', 'var(--warning)', 'В ожидании'],
      rejected: ['var(--danger-bg)', '#b32420', 'var(--danger)', 'Отклонена'],
    };
    return map[variant];
  },
};

const TXS = [
  { id: '#WD-1281', kind: 'withdraw', amount: 1050.00, status: 'hold',    date: 'сегодня 09:14', hash: '—' },
  { id: '#DEP-04881', kind: 'deposit', amount: 100.00,  status: 'pending', date: 'сегодня 08:30', hash: '0x8a3c…f192' },
  { id: '#DEP-04877', kind: 'deposit', amount: 100.00,  status: 'done',    date: 'вчера 22:18',   hash: '0x71b2…d4c0' },
  { id: '#WD-1278',  kind: 'withdraw', amount: 30.00,   status: 'done',    date: 'вчера 14:02',   hash: '0xa28c…91ee' },
  { id: '#DEP-04875', kind: 'deposit', amount: 700.00,  status: 'done',    date: '3 дн назад',   hash: '0x4f12…8c34' },
  { id: '#WD-1276',  kind: 'withdraw', amount: 150.00,  status: 'rejected',date: '3 дн назад',   hash: '—' },
  { id: '#DEP-04868', kind: 'deposit', amount: 20.00,   status: 'done',    date: '6 дн назад',   hash: '0xc902…a134' },
];

function TxTable() {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? TXS : TXS.filter(t => t.kind === filter);

  return (
    <div style={txTableStyles.wrap}>
      <div style={txTableStyles.head}>
        <div>
          <div style={txTableStyles.title}>Транзакции</div>
          <div style={txTableStyles.sub}>Депозиты и заявки на вывод</div>
        </div>
        <div style={txTableStyles.filter}>
          <button style={txTableStyles.filterBtn(filter==='all')}      onClick={() => setFilter('all')}>Все</button>
          <button style={txTableStyles.filterBtn(filter==='deposit')}  onClick={() => setFilter('deposit')}>Депозиты</button>
          <button style={txTableStyles.filterBtn(filter==='withdraw')} onClick={() => setFilter('withdraw')}>Выводы</button>
        </div>
      </div>

      <table style={txTableStyles.table}>
        <thead>
          <tr>
            <th style={txTableStyles.th}>ID</th>
            <th style={txTableStyles.th}>Тип</th>
            <th style={txTableStyles.th}>Сумма</th>
            <th style={txTableStyles.th}>Хэш</th>
            <th style={txTableStyles.th}>Дата</th>
            <th style={txTableStyles.th}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => {
            const [bg, fg, dot, lbl] = txTableStyles.pill(t.status);
            return (
              <tr key={t.id}>
                <td style={{...txTableStyles.td, fontFamily: 'var(--font-mono)', color: 'var(--fg2)'}}>{t.id}</td>
                <td style={txTableStyles.td}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: t.kind === 'deposit' ? 'var(--success-bg)' : 'var(--accent-bg)',
                      color: t.kind === 'deposit' ? 'var(--success)' : 'var(--accent)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {t.kind === 'deposit' ? <IcArrowDown size={12}/> : <IcArrowUp size={12}/>}
                    </span>
                    {t.kind === 'deposit' ? 'Пополнение' : 'Вывод'}
                  </span>
                </td>
                <td style={{ ...txTableStyles.td }}>
                  <span style={txTableStyles.amount(t.kind === 'deposit' ? 'pos' : 'neg')}>
                    {t.kind === 'deposit' ? '+' : '−'}{t.amount.toLocaleString('ru-RU', { minimumFractionDigits: 2 }).replace(/,/g,' ').replace(/\s(\d{2})$/, ',$1')} USDT
                  </span>
                </td>
                <td style={{...txTableStyles.td, ...txTableStyles.txHash}}>{t.hash}</td>
                <td style={{...txTableStyles.td, color: 'var(--fg3)'}}>{t.date}</td>
                <td style={txTableStyles.td}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '3px 9px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600,
                    background: bg, color: fg,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }}/>{lbl}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { TxTable });
