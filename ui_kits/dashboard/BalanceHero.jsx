const heroStyles = {
  wrap: {
    background: '#fff',
    borderRadius: 24,
    padding: '28px 32px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'flex-end', gap: 24,
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -120, right: -80, width: 360, height: 360,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.08), transparent)',
    pointerEvents: 'none',
  },
  left: { flex: 1, position: 'relative', zIndex: 1 },
  label: {
    fontSize: 13, fontWeight: 600, color: 'var(--fg2)',
    letterSpacing: '-0.005em', marginBottom: 6,
  },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em',
    color: 'var(--fg1)',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.05,
  },
  amountUnit: { color: 'var(--fg3)', fontSize: 24, fontWeight: 500, marginLeft: 8 },
  changeRow: { display: 'flex', gap: 14, marginTop: 14, alignItems: 'center' },
  delta: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 13, fontWeight: 600, color: 'var(--success)',
    background: 'var(--success-bg)', padding: '3px 8px', borderRadius: 999,
  },
  caption: { fontSize: 13, color: 'var(--fg3)' },

  actions: { display: 'flex', gap: 10, position: 'relative', zIndex: 1 },
  btn: {
    height: 44, padding: '0 22px',
    borderRadius: 14,
    fontFamily: 'var(--font-text)',
    fontSize: 15, fontWeight: 600,
    border: 0, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    transition: 'transform var(--dur) var(--ease), background var(--dur) var(--ease)',
  },
  btnPrimary: { background: 'var(--accent)', color: '#fff' },
  btnSecondary: { background: 'var(--bg-elevated)', color: 'var(--fg1)' },
  btnDisabled: { background: 'var(--bg-elevated)', color: 'var(--fg3)', cursor: 'not-allowed' },
};

function BalanceHero({ balance, canWithdraw, onDeposit, onWithdraw }) {
  return (
    <div style={heroStyles.wrap}>
      <div style={heroStyles.glow}/>
      <div style={heroStyles.left}>
        <div style={heroStyles.label}>Внутренний баланс</div>
        <div style={heroStyles.amount}>
          {balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ').replace(/\s(\d{2})$/, ',$1')}
          <span style={heroStyles.amountUnit}>USDT</span>
        </div>
        <div style={heroStyles.changeRow}>
          <span style={heroStyles.delta}>
            <IcArrowUp size={12}/> +210,00 за неделю
          </span>
          <span style={heroStyles.caption}>5 ячеек закрашено · 1 заявка в холде</span>
        </div>
      </div>

      <div style={heroStyles.actions}>
        <button style={{...heroStyles.btn, ...heroStyles.btnSecondary}} onClick={onDeposit}>
          <IcPlus size={16}/> Пополнить
        </button>
        <button
          style={{...heroStyles.btn, ...(canWithdraw ? heroStyles.btnPrimary : heroStyles.btnDisabled)}}
          onClick={canWithdraw ? onWithdraw : null}
          disabled={!canWithdraw}>
          <IcArrowUp size={16}/> Вывод
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { BalanceHero });
