const bonusStyles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  card: {
    background: '#fff', borderRadius: 18, padding: '20px 22px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  label: { fontSize: 12, color: 'var(--fg3)', fontWeight: 600, letterSpacing: '0.01em' },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg1)',
    fontVariantNumeric: 'tabular-nums',
  },
  sub: { fontSize: 12, color: 'var(--fg2)' },

  progressTrack: {
    height: 6, background: 'var(--cell-empty-bg)', borderRadius: 3,
    overflow: 'hidden', marginTop: 8,
  },
  progressFill: (pct) => ({
    height: '100%', width: `${pct}%`,
    background: 'var(--success)', borderRadius: 3,
  }),
  friends: {
    display: 'flex', gap: 4, marginTop: 8,
  },
  dot: (filled) => ({
    flex: 1, height: 10, borderRadius: 5,
    background: filled ? 'var(--success)' : 'var(--cell-empty-bg)',
    boxShadow: filled ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
  }),
};

function BonusStats() {
  return (
    <div style={bonusStyles.grid}>
      <div style={bonusStyles.card}>
        <div style={bonusStyles.label}>Заработано бонусов · всего</div>
        <div style={bonusStyles.value}>284,00 <span style={{ color: 'var(--fg3)', fontSize: 16, fontWeight: 500 }}>USDT</span></div>
        <div style={bonusStyles.sub}>+ 60 USDT за последнюю неделю</div>
      </div>
      <div style={bonusStyles.card}>
        <div style={bonusStyles.label}>Бонусных ячеек</div>
        <div style={bonusStyles.value}>3 / 5</div>
        <div style={bonusStyles.sub}>На Level 2 (текущий активный пакет)</div>
        <div style={bonusStyles.progressTrack}><div style={bonusStyles.progressFill(60)}/></div>
      </div>
      <div style={bonusStyles.card}>
        <div style={bonusStyles.label}>Правило 5 друзей</div>
        <div style={bonusStyles.value}>3 / 5</div>
        <div style={bonusStyles.sub}>Пригласите ещё 2, чтобы закрыть цикл</div>
        <div style={bonusStyles.friends}>
          <div style={bonusStyles.dot(true)}/>
          <div style={bonusStyles.dot(true)}/>
          <div style={bonusStyles.dot(true)}/>
          <div style={bonusStyles.dot(false)}/>
          <div style={bonusStyles.dot(false)}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BonusStats });
