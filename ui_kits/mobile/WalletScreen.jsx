const walletMStyles = {
  page: { padding: '8px 16px 24px' },

  hero: {
    background: '#fff', borderRadius: 20,
    padding: '20px 20px 18px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -80, right: -50, width: 240, height: 240,
    background: 'radial-gradient(closest-side, rgba(52,199,89,0.10), transparent)',
    pointerEvents: 'none',
  },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)' },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em',
    fontVariantNumeric: 'tabular-nums',
  },
  unit: { color: 'var(--fg3)', fontSize: 17, fontWeight: 500, marginLeft: 6 },

  statRow: {
    display: 'flex', gap: 0,
    borderTop: '1px solid var(--hairline-soft)',
    paddingTop: 12, marginTop: 4,
  },
  stat: { flex: 1, position: 'relative' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  statLbl: { fontSize: 11, color: 'var(--fg3)', marginTop: 2 },

  segWrap: { marginTop: 18, display: 'flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3 },
  segBtn: (active) => ({
    flex: 1, padding: '9px 0',
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
  }),

  card: {
    marginTop: 14, background: '#fff', borderRadius: 18,
    padding: '18px 18px 16px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  cardH: { fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 },

  qrBox: {
    width: '100%', aspectRatio: '1 / 1', maxWidth: 180,
    margin: '4px auto 8px',
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px var(--hairline)',
    borderRadius: 16, padding: 12,
  },
  addressField: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--bg-elevated)',
    borderRadius: 10, padding: '8px 8px 8px 12px',
  },
  addressVal: {
    flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  copyBtn: {
    height: 30, padding: '0 12px', borderRadius: 8,
    background: '#fff', border: 0,
    fontSize: 12, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  },

  notice: {
    display: 'flex', gap: 8, padding: '10px 12px',
    fontSize: 12, lineHeight: 1.45, borderRadius: 10,
    background: 'var(--accent-bg)', color: 'var(--accent-press)',
  },
  noticeWarn: { background: 'var(--warning-bg)', color: '#8c5400' },

  inputLabel: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)', marginBottom: 6 },
  amountInput: {
    width: '100%', height: 56, padding: '0 16px',
    borderRadius: 12,
    background: 'var(--bg-elevated)',
    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
    color: 'var(--fg1)', border: 0, outline: 'none',
    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
    textAlign: 'right',
  },
  addressInput: {
    width: '100%', height: 44, padding: '0 14px',
    borderRadius: 11,
    background: 'var(--bg-elevated)',
    fontSize: 14, fontFamily: 'var(--font-mono)',
    color: 'var(--fg1)', border: 0, outline: 'none',
  },
  chips: { display: 'flex', gap: 6 },
  chip: {
    flex: 1, padding: '8px 0', borderRadius: 10,
    background: 'var(--bg-elevated)', border: 0,
    fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  submit: (en) => ({
    width: '100%', height: 48, borderRadius: 12, border: 0,
    background: en ? 'var(--accent)' : 'var(--bg-elevated)',
    color: en ? '#fff' : 'var(--fg3)',
    fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
    cursor: en ? 'pointer' : 'not-allowed',
  }),
};

function FakeQRMobile() {
  const cells = 21;
  const pattern = [];
  for (let r = 0; r < cells; r++) for (let c = 0; c < cells; c++) {
    const v = ((r * 7 + c * 13 + r * c) % 5) < 2;
    pattern.push({ r, c, on: v });
  }
  const F = (cx, cy) => (
    <g key={`f${cx},${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#1D1D1F"/>
      <rect x={cx+1} y={cy+1} width="5" height="5" fill="#fff"/>
      <rect x={cx+2} y={cy+2} width="3" height="3" fill="#1D1D1F"/>
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
      {pattern.filter(p => p.on && !(p.r < 7 && p.c < 7) && !(p.r < 7 && p.c >= 14) && !(p.r >= 14 && p.c < 7))
        .map(p => <rect key={`${p.r},${p.c}`} x={p.c} y={p.r} width="1" height="1" fill="#1D1D1F"/>)}
      {F(0,0)} {F(14,0)} {F(0,14)}
    </svg>
  );
}

function WalletScreen() {
  const [tab, setTab] = React.useState('deposit');
  const [amount, setAmount] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const balance = 1248;
  const n = parseFloat(amount) || 0;
  const valid = n >= 30 && n <= balance && address.length > 4;

  return (
    <MobileShell title="Кошелёк">
      <div style={walletMStyles.page}>
        <div style={walletMStyles.hero}>
          <div style={walletMStyles.glow}/>
          <div style={walletMStyles.label}>Внутренний баланс</div>
          <div style={walletMStyles.amount}>1 248,00<span style={walletMStyles.unit}>USDT</span></div>
          <div style={walletMStyles.statRow}>
            <div style={walletMStyles.stat}>
              <div style={{...walletMStyles.statVal, color: 'var(--success)'}}>+ 1 680</div>
              <div style={walletMStyles.statLbl}>Пополнено</div>
            </div>
            <div style={walletMStyles.stat}>
              <div style={{...walletMStyles.statVal, color: 'var(--warning)'}}>− 432</div>
              <div style={walletMStyles.statLbl}>Выведено</div>
            </div>
            <div style={walletMStyles.stat}>
              <div style={walletMStyles.statVal}>1</div>
              <div style={walletMStyles.statLbl}>В холде</div>
            </div>
          </div>
        </div>

        <div style={walletMStyles.segWrap}>
          <button style={walletMStyles.segBtn(tab === 'deposit')}  onClick={() => setTab('deposit')}>Пополнить</button>
          <button style={walletMStyles.segBtn(tab === 'withdraw')} onClick={() => setTab('withdraw')}>Вывод</button>
        </div>

        {tab === 'deposit' && (
          <div style={walletMStyles.card}>
            <div style={walletMStyles.cardH}>Адрес для пополнения · TRC-20</div>
            <div style={walletMStyles.qrBox}><FakeQRMobile/></div>
            <div style={walletMStyles.addressField}>
              <div style={walletMStyles.addressVal}>TKzxd8RcM4N5xT8wpDqLnVj4nAhM7eq2yX</div>
              <button style={walletMStyles.copyBtn} onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
                {copied ? <><IcCheck size={11} stroke="var(--success)"/></> : <IcCopy size={11}/>}
              </button>
            </div>
            <div style={walletMStyles.notice}>
              <IcInfo size={13}/>
              <span>Переводите только USDT в сети TRC-20. Депозит зачисляется после подтверждения администратором.</span>
            </div>
          </div>
        )}

        {tab === 'withdraw' && (
          <div style={walletMStyles.card}>
            <div>
              <div style={walletMStyles.inputLabel}>Сумма</div>
              <input
                style={walletMStyles.amountInput}
                placeholder="0,00"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}/>
              <div style={{ ...walletMStyles.chips, marginTop: 8 }}>
                <button style={walletMStyles.chip} onClick={() => setAmount('30')}>Мин. 30</button>
                <button style={walletMStyles.chip} onClick={() => setAmount(String(Math.floor(balance/2)))}>50%</button>
                <button style={walletMStyles.chip} onClick={() => setAmount(String(balance))}>Всё</button>
              </div>
            </div>
            <div>
              <div style={walletMStyles.inputLabel}>Адрес кошелька</div>
              <input
                style={walletMStyles.addressInput}
                placeholder="TRC-20 адрес"
                value={address}
                onChange={e => setAddress(e.target.value)}/>
            </div>
            <div style={{...walletMStyles.notice, ...walletMStyles.noticeWarn}}>
              <IcInfo size={13}/>
              <span>Заявка получит статус «В ожидании выплаты». Холд — 72 ч. Минимум — 30 USDT.</span>
            </div>
            <button style={walletMStyles.submit(valid)} disabled={!valid}>
              {n > 0 && n < 30 ? 'Минимум 30 USDT' :
               n > balance ? 'Недостаточно средств' :
               'Создать заявку'}
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

Object.assign(window, { WalletScreen });
