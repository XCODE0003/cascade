const depositPanelStyles = {
  wrap: {
    background: '#fff', borderRadius: 20,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    padding: '24px 24px 22px',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  head: { display: 'flex', alignItems: 'baseline', gap: 10 },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  sub: { fontSize: 12, color: 'var(--fg3)' },

  qrRow: { display: 'flex', gap: 18, alignItems: 'center' },
  qr: {
    width: 124, height: 124, borderRadius: 16,
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px var(--hairline)',
    padding: 8,
    flexShrink: 0,
  },
  addressBox: {
    flex: 1, display: 'flex', flexDirection: 'column', gap: 10,
  },
  addressLbl: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)' },
  addressField: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--bg-elevated)',
    borderRadius: 10, padding: '8px 8px 8px 14px',
  },
  addressVal: {
    flex: 1, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg1)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  copyBtn: {
    height: 30, padding: '0 12px', borderRadius: 8,
    background: '#fff', border: 0,
    fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
  },

  notice: {
    display: 'flex', gap: 10, padding: '10px 12px',
    background: 'var(--accent-bg)', color: 'var(--accent-press)',
    fontSize: 12, lineHeight: 1.45, borderRadius: 10,
  },
};

/* Pure CSS / SVG mock QR — pattern is deterministic-looking, doesn't decode */
function FakeQR() {
  const cells = 21;
  // deterministic pseudo pattern
  const pattern = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const corner = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const v = ((r * 7 + c * 13 + r * c) % 5) < 2;
      pattern.push({ r, c, on: corner || v });
    }
  }
  const FINDER = (cx, cy) => (
    <g key={`f${cx},${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#1D1D1F"/>
      <rect x={cx+1} y={cy+1} width="5" height="5" fill="#fff"/>
      <rect x={cx+2} y={cy+2} width="3" height="3" fill="#1D1D1F"/>
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
      {pattern.filter(p => {
        const inFinder = (p.r < 7 && p.c < 7) || (p.r < 7 && p.c >= 14) || (p.r >= 14 && p.c < 7);
        return p.on && !inFinder;
      }).map(p => <rect key={`${p.r},${p.c}`} x={p.c} y={p.r} width="1" height="1" fill="#1D1D1F"/>)}
      {FINDER(0, 0)}
      {FINDER(14, 0)}
      {FINDER(0, 14)}
    </svg>
  );
}

function DepositPanel() {
  const [copied, setCopied] = React.useState(false);
  const address = 'TKzxd8RcM4N5xT8wpDqLnVj4nAhM7eq2yX';
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={depositPanelStyles.wrap}>
      <div style={depositPanelStyles.head}>
        <div style={depositPanelStyles.title}>Пополнить · USDT</div>
        <div style={depositPanelStyles.sub}>Сеть TRC-20</div>
      </div>
      <div style={depositPanelStyles.qrRow}>
        <div style={depositPanelStyles.qr}><FakeQR/></div>
        <div style={depositPanelStyles.addressBox}>
          <div style={depositPanelStyles.addressLbl}>Ваш адрес для пополнения</div>
          <div style={depositPanelStyles.addressField}>
            <div style={depositPanelStyles.addressVal}>{address}</div>
            <button style={depositPanelStyles.copyBtn} onClick={copy}>
              {copied ? <><IcCheck size={12} stroke="var(--success)"/> Готово</> : <><IcCopy size={12}/> Копировать</>}
            </button>
          </div>
          <div style={depositPanelStyles.notice}>
            <IcInfo size={14}/>
            <span>Переводите только USDT в сети TRC-20. Депозит зачисляется после подтверждения администратором.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DepositPanel });
