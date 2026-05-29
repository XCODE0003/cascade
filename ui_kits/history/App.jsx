const historyAppStyles = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  content: {
    padding: '24px 32px 48px', maxWidth: 1200, width: '100%', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: 18,
  },

  summary: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  card: {
    background: '#fff', borderRadius: 18, padding: '18px 20px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  cardLabel: {
    fontSize: 11, fontWeight: 600, color: 'var(--fg3)',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  cardValue: (color) => ({
    fontFamily: 'var(--font-display)',
    fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
    color: color || 'var(--fg1)',
    fontVariantNumeric: 'tabular-nums',
  }),
  cardSub: { fontSize: 11, color: 'var(--fg2)' },

  sectionHead: { display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' },
  sectionSub: { fontSize: 13, color: 'var(--fg3)' },
};

function HistoryApp() {
  return (
    <div style={historyAppStyles.shell}>
      <Sidebar active="history"/>
      <div style={historyAppStyles.main}>
        <Topbar title="История операций"/>
        <div style={historyAppStyles.content}>

          <div style={historyAppStyles.summary}>
            <div style={historyAppStyles.card}>
              <div style={historyAppStyles.cardLabel}>Доход · 30 дн</div>
              <div style={historyAppStyles.cardValue('var(--success)')}>+ 1&nbsp;842 <span style={{ color: 'var(--fg3)', fontSize: 14, fontWeight: 500 }}>USDT</span></div>
              <div style={historyAppStyles.cardSub}>78 ячеек · 12 реф. бонусов</div>
            </div>
            <div style={historyAppStyles.card}>
              <div style={historyAppStyles.cardLabel}>Реинвесты · 30 дн</div>
              <div style={historyAppStyles.cardValue('var(--danger)')}>− 432 <span style={{ color: 'var(--fg3)', fontSize: 14, fontWeight: 500 }}>USDT</span></div>
              <div style={historyAppStyles.cardSub}>4 ручных · 1 авто</div>
            </div>
            <div style={historyAppStyles.card}>
              <div style={historyAppStyles.cardLabel}>Выведено · 30 дн</div>
              <div style={historyAppStyles.cardValue('var(--warning)')}>− 180 <span style={{ color: 'var(--fg3)', fontSize: 14, fontWeight: 500 }}>USDT</span></div>
              <div style={historyAppStyles.cardSub}>3 выплаты · 1 в холде</div>
            </div>
            <div style={historyAppStyles.card}>
              <div style={historyAppStyles.cardLabel}>Операций всего</div>
              <div style={historyAppStyles.cardValue()}>124</div>
              <div style={historyAppStyles.cardSub}>Средняя · 4,1 в день</div>
            </div>
          </div>

          <div style={historyAppStyles.sectionHead}>
            <div style={historyAppStyles.sectionTitle}>Лента операций</div>
            <div style={historyAppStyles.sectionSub}>Группировка по дням · с цветовой маркировкой</div>
          </div>

          <OperationsLog/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HistoryApp });
