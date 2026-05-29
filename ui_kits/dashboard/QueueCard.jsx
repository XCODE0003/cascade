const queueColors = {
  1: 'var(--level-1)',
  2: 'var(--level-2)',
  3: 'var(--level-3)',
  4: 'var(--level-4)',
};

const queueStyles = {
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px 22px 22px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 16,
    transition: 'transform var(--dur) var(--ease)',
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelTag: (level) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    color: 'var(--fg2)', textTransform: 'uppercase',
  }),
  dot: (level) => ({
    width: 8, height: 8, borderRadius: '50%', background: queueColors[level],
  }),
  ratio: {
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontSize: 13, fontWeight: 600, color: 'var(--fg2)',
  },
  amount: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
    color: 'var(--fg1)',
    fontVariantNumeric: 'tabular-nums',
  },
  amountUnit: { color: 'var(--fg3)', fontSize: 15, fontWeight: 500, marginLeft: 6 },
  rowMeta: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 12, color: 'var(--fg3)',
  },

  cellsRow: { display: 'flex', gap: 5 },
  cell: (filled, bonus) => ({
    flex: 1, height: 32, borderRadius: 8,
    background: filled ? (bonus ? '#FFCC00' : 'var(--success)') : 'var(--cell-empty-bg)',
    boxShadow: filled ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
    transition: 'all var(--dur) var(--ease)',
  }),

  timer: (status) => ({
    fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
    fontSize: 13, fontWeight: 500,
    color: status === 'ready' ? 'var(--success)' :
           status === 'locked' ? 'var(--accent)' :
           status === 'inactive' ? 'var(--fg3)' : 'var(--fg2)',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }),

  actionRow: { display: 'flex', gap: 8, marginTop: 4 },
  btn: (variant) => ({
    flex: 1, height: 36,
    borderRadius: 10,
    fontFamily: 'var(--font-text)',
    fontSize: 13, fontWeight: 600,
    border: 0, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    background: variant === 'primary' ? 'var(--accent)' :
                variant === 'success' ? 'var(--success)' :
                'var(--bg-elevated)',
    color: variant === 'primary' || variant === 'success' ? '#fff' : 'var(--fg1)',
    transition: 'transform var(--dur) var(--ease), background var(--dur) var(--ease)',
  }),
  btnDisabled: {
    background: 'var(--bg-elevated)', color: 'var(--fg3)', cursor: 'not-allowed',
  },

  toggleRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0 0', borderTop: '1px solid var(--hairline-soft)',
    marginTop: 2, paddingTop: 12,
  },
  toggleLabel: { fontSize: 13, color: 'var(--fg2)', flex: 1 },
  toggle: (on) => ({
    width: 36, height: 22,
    background: on ? 'var(--success)' : 'var(--neutral-bg)',
    borderRadius: 999, position: 'relative',
    cursor: 'pointer',
    transition: 'background var(--dur) var(--ease)',
  }),
  toggleKnob: (on) => ({
    position: 'absolute', top: 2, left: 2,
    width: 18, height: 18, borderRadius: '50%', background: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    transform: on ? 'translateX(14px)' : 'translateX(0)',
    transition: 'transform var(--dur) var(--ease)',
  }),
};

function fmt(n) {
  return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}

function QueueCard({ level, entry, payout, filled, status, timer, autoReinvest, onActivate, onReinvest, onUpgrade, onToggleAuto }) {
  const ratio = `${filled} / 5`;
  const isReady = status === 'ready';
  const isInactive = status === 'inactive';
  const isLocked = status === 'locked';

  return (
    <div style={queueStyles.card}>
      <div style={queueStyles.head}>
        <div style={queueStyles.levelTag(level)}>
          <span style={queueStyles.dot(level)}/>Level {level}
        </div>
        <div style={queueStyles.ratio}>{isInactive ? 'не активен' : ratio}</div>
      </div>

      <div>
        <div style={queueStyles.amount}>
          {fmt(entry)}<span style={queueStyles.amountUnit}>USDT</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>
          Выплата за цикл: {fmt(payout)} USDT
        </div>
      </div>

      <div style={queueStyles.cellsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={queueStyles.cell(i < filled, false)}/>
        ))}
      </div>

      <div style={queueStyles.rowMeta}>
        <div style={queueStyles.timer(status)}>
          {isReady && <><IcCheck size={14}/> Готов к выводу</>}
          {isLocked && <><IcLock size={12}/> Замок: {timer}</>}
          {isInactive && <>Не активирован</>}
          {status === 'pending' && <>В ожидании: {timer}</>}
        </div>
      </div>

      <div style={queueStyles.actionRow}>
        {isInactive ? (
          <button style={queueStyles.btn('primary')} onClick={onActivate}>
            <IcPlus size={14}/> Активировать
          </button>
        ) : (
          <>
            <button
              style={isReady ? queueStyles.btn('success') : { ...queueStyles.btn('secondary'), ...(isLocked ? queueStyles.btnDisabled : {}) }}
              onClick={!isLocked ? onReinvest : null}
              disabled={isLocked}>
              <IcRefresh size={13}/> Реинвест
            </button>
            <button style={queueStyles.btn('secondary')} onClick={onUpgrade}>
              <IcArrowUp size={13}/> Апгрейд
            </button>
          </>
        )}
      </div>

      {!isInactive && (
        <div style={queueStyles.toggleRow}>
          <span style={queueStyles.toggleLabel}>Авто-вход после цикла</span>
          <div style={queueStyles.toggle(autoReinvest)} onClick={onToggleAuto}>
            <div style={queueStyles.toggleKnob(autoReinvest)}/>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { QueueCard });
