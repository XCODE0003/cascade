const WITHDRAWALS = [
  { id: '#WD-1281', user: 'u_4821', amount: 1050.00, holdLeft: 6,   total: 72, status: 'hold',     created: 'сегодня 09:14' },
  { id: '#WD-1280', user: 'u_3019', amount: 30.00,   holdLeft: 18,  total: 72, status: 'hold',     created: 'сегодня 02:30' },
  { id: '#WD-1279', user: 'u_5512', amount: 150.00,  holdLeft: 0,   total: 72, status: 'pending',  created: 'вчера 11:22' },
  { id: '#WD-1278', user: 'u_7702', amount: 3000.00, holdLeft: 0,   total: 72, status: 'pending',  created: 'вчера 08:45' },
  { id: '#WD-1277', user: 'u_2210', amount: 30.00,   holdLeft: null, total: 72, status: 'approved', created: '2 дн назад' },
  { id: '#WD-1276', user: 'u_8893', amount: 150.00,  holdLeft: null, total: 72, status: 'rejected', created: '3 дн назад' },
];

function HoldBar({ left, total }) {
  if (left === null) return <span style={{ color: 'var(--fg3)', fontSize: 12 }}>—</span>;
  const progress = (total - left) / total;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--cell-empty-bg)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.round(progress * 100)}%`,
          height: '100%',
          background: left === 0 ? 'var(--success)' : 'var(--accent)',
          transition: 'width 200ms ease',
        }}/>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg2)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
        {left}ч
      </span>
    </div>
  );
}

function WithdrawalsTable() {
  const [filter, setFilter] = React.useState('active');
  const [rows, setRows] = React.useState(WITHDRAWALS);

  const filtered = rows.filter(r => {
    if (filter === 'active') return r.status === 'hold' || r.status === 'pending';
    return r.status === filter;
  });

  const approve = id => setRows(rs => rs.map(r => r.id === id ? { ...r, status: 'approved', holdLeft: null } : r));
  const reject  = id => setRows(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected', holdLeft: null } : r));

  return (
    <div style={tableStyles.panel}>
      <div style={tableStyles.head}>
        <div>
          <div style={tableStyles.title}>Заявки на вывод</div>
          <div style={tableStyles.sub}>Кнопка «Выплатить» активна только по истечении 72-часового холда</div>
        </div>
      </div>
      <div style={tableStyles.filterBar}>
        <div style={tableStyles.seg}>
          <button style={tableStyles.segBtn(filter==='active')}   onClick={() => setFilter('active')}>Активные</button>
          <button style={tableStyles.segBtn(filter==='approved')} onClick={() => setFilter('approved')}>Выплачены</button>
          <button style={tableStyles.segBtn(filter==='rejected')} onClick={() => setFilter('rejected')}>Отклонены</button>
        </div>
      </div>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>ID</th>
            <th style={tableStyles.th}>Пользователь</th>
            <th style={tableStyles.th}>Сумма</th>
            <th style={tableStyles.th}>Холд</th>
            <th style={tableStyles.th}>Создана</th>
            <th style={tableStyles.th}>Статус</th>
            <th style={{...tableStyles.th, textAlign: 'right'}}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => {
            const canPay = r.status === 'pending';
            return (
              <tr key={r.id}>
                <td style={{...tableStyles.td, ...tableStyles.mono, color: 'var(--fg2)'}}>{r.id}</td>
                <td style={tableStyles.td}>{r.user}</td>
                <td style={{...tableStyles.td, ...tableStyles.mono, fontWeight: 600}}>{r.amount.toLocaleString('ru-RU', {minimumFractionDigits: 2}).replace(/,/g,' ').replace(/\s(\d{2})$/, ',$1')} USDT</td>
                <td style={tableStyles.td}><HoldBar left={r.holdLeft} total={r.total}/></td>
                <td style={{...tableStyles.td, color: 'var(--fg3)'}}>{r.created}</td>
                <td style={tableStyles.td}>
                  <span style={tableStyles.pill(r.status === 'hold' ? 'hold' : r.status)}>
                    <span style={tableStyles.pillDot(r.status === 'hold' ? 'hold' : r.status)}/>
                    {r.status === 'hold' && 'Холд'}
                    {r.status === 'pending' && 'Готова к выплате'}
                    {r.status === 'approved' && 'Выплачена'}
                    {r.status === 'rejected' && 'Отклонена'}
                  </span>
                </td>
                <td style={tableStyles.td}>
                  <div style={tableStyles.btnRow}>
                    {(r.status === 'hold' || r.status === 'pending') && (
                      <>
                        <button
                          style={{...tableStyles.btn('approve'), opacity: canPay ? 1 : 0.4, cursor: canPay ? 'pointer' : 'not-allowed'}}
                          disabled={!canPay}
                          onClick={() => canPay && approve(r.id)}>
                          <IcCheck size={12}/> Выплатить
                        </button>
                        <button style={tableStyles.btn('reject')} onClick={() => reject(r.id)}>
                          <IcClose size={12}/>
                        </button>
                      </>
                    )}
                    {(r.status === 'approved' || r.status === 'rejected') && (
                      <button style={tableStyles.btn('secondary')}>Детали</button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { WithdrawalsTable });
