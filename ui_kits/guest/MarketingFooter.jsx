const footerStyles = {
  wrap: {
    borderTop: '1px solid var(--hairline)',
    padding: '40px 32px 32px',
    marginTop: 80,
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32,
  },
  brandBlock: {},
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  brandName: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg1)' },
  blurb: { fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55, maxWidth: 360 },

  col: {},
  colTitle: { fontSize: 11, fontWeight: 700, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 },
  colLink: { display: 'block', fontSize: 13, color: 'var(--fg1)', textDecoration: 'none', padding: '5px 0', cursor: 'pointer' },

  bottom: {
    maxWidth: 1200, margin: '32px auto 0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 20, borderTop: '1px solid var(--hairline-soft)',
    fontSize: 12, color: 'var(--fg3)',
  },
};

function MarketingFooter() {
  return (
    <footer style={footerStyles.wrap}>
      <div style={footerStyles.inner}>
        <div style={footerStyles.brandBlock}>
          <div style={footerStyles.brand}>
            <img src="../../assets/glyph.svg" width="22" height="22"/>
            <span style={footerStyles.brandName}>Cascade</span>
          </div>
          <div style={footerStyles.blurb}>
            Прозрачная очередь ликвидности. Платформа распределяет 100% входящих средств между участниками по правилу каскада и не может уйти в дефицит.
          </div>
        </div>
        <div style={footerStyles.col}>
          <div style={footerStyles.colTitle}>Продукт</div>
          <a style={footerStyles.colLink}>Как это работает</a>
          <a style={footerStyles.colLink}>Тарифы</a>
          <a style={footerStyles.colLink}>Двойной замок</a>
          <a style={footerStyles.colLink}>Каскад</a>
        </div>
        <div style={footerStyles.col}>
          <div style={footerStyles.colTitle}>Безопасность</div>
          <a style={footerStyles.colLink}>Анти-абуз</a>
          <a style={footerStyles.colLink}>ACID-транзакции</a>
          <a style={footerStyles.colLink}>Холд 72 ч</a>
        </div>
        <div style={footerStyles.col}>
          <div style={footerStyles.colTitle}>Помощь</div>
          <a style={footerStyles.colLink}>FAQ</a>
          <a style={footerStyles.colLink}>Поддержка</a>
          <a style={footerStyles.colLink}>Telegram-канал</a>
        </div>
      </div>
      <div style={footerStyles.bottom}>
        <span>© 2026 Cascade. Это не инвестиционный продукт с фиксированным процентом.</span>
        <span>v 2.0</span>
      </div>
    </footer>
  );
}

Object.assign(window, { MarketingFooter });
