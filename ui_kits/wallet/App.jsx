const walletAppStyles = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  content: {
    padding: '24px 32px 48px', maxWidth: 1200, width: '100%', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: 18,
  },

  hero: {
    background: '#fff', borderRadius: 24, padding: '28px 32px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 32,
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -120, right: -80, width: 360, height: 360,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.08), transparent)',
    pointerEvents: 'none',
  },
  block: { position: 'relative', zIndex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--fg2)', marginBottom: 6 },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05,
    color: 'var(--fg1)', fontVariantNumeric: 'tabular-nums',
  },
  unit: { color: 'var(--fg3)', fontSize: 20, fontWeight: 500, marginLeft: 6 },

  divider: { width: 1, alignSelf: 'stretch', background: 'var(--hairline)', margin: '0 4px' },

  smallStat: {},
  smallVal: {
    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em',
    color: 'var(--fg1)', fontVariantNumeric: 'tabular-nums',
  },
  smallLbl: { fontSize: 12, color: 'var(--fg3)', marginTop: 2 },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
};

function WalletApp() {
  return (
    <div style={walletAppStyles.shell}>
      <Sidebar active="wallet"/>
      <div style={walletAppStyles.main}>
        <Topbar title="Кошелёк"/>
        <div style={walletAppStyles.content}>
          <div style={walletAppStyles.hero}>
            <div style={walletAppStyles.glow}/>
            <div style={walletAppStyles.block}>
              <div style={walletAppStyles.label}>Внутренний баланс</div>
              <div style={walletAppStyles.amount}>
                1&nbsp;248,00<span style={walletAppStyles.unit}>USDT</span>
              </div>
            </div>
            <div style={walletAppStyles.divider}/>
            <div style={{ ...walletAppStyles.smallStat, ...walletAppStyles.block }}>
              <div style={walletAppStyles.smallVal}>+ 1&nbsp;680,00</div>
              <div style={walletAppStyles.smallLbl}>Пополнено · всего</div>
            </div>
            <div style={{ ...walletAppStyles.smallStat, ...walletAppStyles.block }}>
              <div style={walletAppStyles.smallVal}>− 432,00</div>
              <div style={walletAppStyles.smallLbl}>Выведено · всего</div>
            </div>
            <div style={{ ...walletAppStyles.smallStat, ...walletAppStyles.block }}>
              <div style={walletAppStyles.smallVal}>1</div>
              <div style={walletAppStyles.smallLbl}>Заявка в холде</div>
            </div>
          </div>

          <div style={walletAppStyles.twoCol}>
            <DepositPanel/>
            <WithdrawPanel balance={1248}/>
          </div>

          <TxTable/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WalletApp });
