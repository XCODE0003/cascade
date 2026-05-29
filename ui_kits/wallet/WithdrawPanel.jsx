const withdrawPanelStyles = {
  wrap: {
    background: '#fff', borderRadius: 20,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    padding: '24px 24px 22px',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  head: { display: 'flex', alignItems: 'baseline', gap: 10 },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  sub: { fontSize: 12, color: 'var(--fg3)' },

  balanceRow: {
    background: 'var(--bg-elevated)', borderRadius: 12,
    padding: '12px 14px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  balLbl: { fontSize: 12, color: 'var(--fg2)' },
  balVal: { fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--fg1)', fontVariantNumeric: 'tabular-nums' },

  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)' },
  input: {
    height: 44, padding: '0 14px',
    borderRadius: 11,
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
    fontSize: 15, color: 'var(--fg1)', fontFamily: 'var(--font-text)',
    border: 0, outline: 'none',
  },
  inputAmt: {
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontWeight: 600, fontSize: 18,
  },
  chips: { display: 'flex', gap: 6, marginTop: 6 },
  chip: {
    padding: '5px 11px', borderRadius: 999,
    background: 'var(--bg-elevated)', border: 0,
    fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
    cursor: 'pointer', fontFamily: 'inherit',
  },

  notice: {
    display: 'flex', gap: 10, padding: '10px 12px',
    background: 'var(--warning-bg)', color: '#8c5400',
    fontSize: 12, lineHeight: 1.45, borderRadius: 10,
  },

  submit: (enabled) => ({
    height: 44, borderRadius: 12, border: 0,
    background: enabled ? 'var(--accent)' : 'var(--bg-elevated)',
    color: enabled ? '#fff' : 'var(--fg3)',
    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    cursor: enabled ? 'pointer' : 'not-allowed',
    marginTop: 4,
  }),
};

function WithdrawPanel({ balance = 1248 }) {
  const [amount, setAmount] = React.useState('');
  const [address, setAddress] = React.useState('');
  const n = parseFloat(amount) || 0;
  const valid = n >= 30 && n <= balance && address.length > 4;

  return (
    <div style={withdrawPanelStyles.wrap}>
      <div style={withdrawPanelStyles.head}>
        <div style={withdrawPanelStyles.title}>Вывод средств</div>
        <div style={withdrawPanelStyles.sub}>Без комиссии · TRC-20</div>
      </div>

      <div style={withdrawPanelStyles.balanceRow}>
        <span style={withdrawPanelStyles.balLbl}>Доступно к выводу</span>
        <span style={withdrawPanelStyles.balVal}>{balance.toLocaleString('ru-RU')} USDT</span>
      </div>

      <div style={withdrawPanelStyles.field}>
        <label style={withdrawPanelStyles.label}>Сумма</label>
        <input
          style={{...withdrawPanelStyles.input, ...withdrawPanelStyles.inputAmt}}
          placeholder="0,00"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}/>
        <div style={withdrawPanelStyles.chips}>
          <button style={withdrawPanelStyles.chip} onClick={() => setAmount('30')}>Мин. 30</button>
          <button style={withdrawPanelStyles.chip} onClick={() => setAmount(String(Math.floor(balance / 2)))}>50%</button>
          <button style={withdrawPanelStyles.chip} onClick={() => setAmount(String(balance))}>Всё</button>
        </div>
      </div>

      <div style={withdrawPanelStyles.field}>
        <label style={withdrawPanelStyles.label}>Адрес кошелька</label>
        <input
          style={withdrawPanelStyles.input}
          placeholder="TRC-20 адрес"
          value={address}
          onChange={e => setAddress(e.target.value)}/>
      </div>

      <div style={withdrawPanelStyles.notice}>
        <IcInfo size={14}/>
        <span>
          Заявка получит статус «В ожидании выплаты», ваши записи в очередях перейдут в серый статус.
          Холд — 72 часа. Минимальная сумма — 30 USDT.
        </span>
      </div>

      <button style={withdrawPanelStyles.submit(valid)} disabled={!valid}>
        {n > 0 && n < 30 ? 'Минимум 30 USDT' :
         n > balance ? 'Недостаточно средств' :
         'Создать заявку'}
      </button>
    </div>
  );
}

Object.assign(window, { WithdrawPanel });
