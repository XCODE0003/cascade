const landingStyles = {
  page: { background: 'var(--bg)', minHeight: '100vh' },

  /* ---------- HERO ---------- */
  hero: {
    position: 'relative',
    padding: '80px 32px 96px',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -200, left: '50%',
    transform: 'translateX(-50%)',
    width: 900, height: 600,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.10), transparent 70%)',
    pointerEvents: 'none',
  },
  heroInner: {
    maxWidth: 1080, margin: '0 auto', position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    gap: 24,
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '5px 12px 5px 8px',
    background: 'var(--bg-card)',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 0 0 1px var(--hairline)',
    borderRadius: 999,
    fontSize: 12, fontWeight: 600, color: 'var(--fg2)',
  },
  eyebrowDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 64, fontWeight: 700, letterSpacing: '-0.035em',
    lineHeight: 1.05, color: 'var(--fg1)',
    maxWidth: 880,
  },
  sub: {
    fontSize: 19, lineHeight: 1.5, color: 'var(--fg2)',
    maxWidth: 620,
  },
  ctaRow: { display: 'flex', gap: 10, marginTop: 8 },
  ctaPrimary: {
    height: 48, padding: '0 22px', borderRadius: 14,
    background: 'var(--fg1)', color: '#fff',
    fontSize: 15, fontWeight: 600, border: 0, cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    textDecoration: 'none',
  },
  ctaSecondary: {
    height: 48, padding: '0 22px', borderRadius: 14,
    background: 'transparent', color: 'var(--fg1)',
    fontSize: 15, fontWeight: 600, border: 0, cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    boxShadow: 'inset 0 0 0 1px var(--hairline-strong)',
    textDecoration: 'none',
  },

  /* ---------- HERO VISUAL ---------- */
  heroVisual: {
    marginTop: 48,
    width: '100%', maxWidth: 920,
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
    padding: '24px 28px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  visualHead: { display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--hairline)' },
  visualTitle: { fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 },
  visualMeta: { marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg3)' },
  visualGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },

  /* ---------- SECTION ---------- */
  section: { padding: '96px 32px', maxWidth: 1200, margin: '0 auto' },
  sectionEyebrow: {
    fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
    color: 'var(--accent)', textTransform: 'uppercase',
    marginBottom: 14,
  },
  sectionH2: {
    fontFamily: 'var(--font-display)',
    fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
    maxWidth: 720,
  },
  sectionSub: { fontSize: 17, color: 'var(--fg2)', maxWidth: 640, marginTop: 14, lineHeight: 1.55 },

  /* ---------- HOW IT WORKS ---------- */
  steps: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 },
  step: {
    background: '#fff', borderRadius: 20, padding: '28px 24px 26px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
    position: 'relative', overflow: 'hidden',
  },
  stepN: {
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
    color: 'var(--fg3)', letterSpacing: '0.06em',
  },
  stepTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 },
  stepBody: { fontSize: 14, color: 'var(--fg2)', lineHeight: 1.55 },
  stepVisual: { marginTop: 6, height: 64, display: 'flex', alignItems: 'center' },

  /* ---------- PILLARS ---------- */
  pillars: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 48 },
  pillar: {
    background: '#fff', borderRadius: 18, padding: '22px 20px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
  },
  pillarNum: {
    fontFamily: 'var(--font-display)',
    fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
  pillarLabel: { fontSize: 13, color: 'var(--fg2)', marginTop: 6, lineHeight: 1.45 },

  /* ---------- TIERS ---------- */
  tiers: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 48 },
  tierCard: (color) => ({
    background: '#fff', borderRadius: 20, padding: '24px 22px 22px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
    position: 'relative', overflow: 'hidden',
  }),
  tierBar: (color) => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color,
  }),
  tierName: { fontSize: 12, fontWeight: 700, color: 'var(--fg2)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  tierEntry: {
    fontFamily: 'var(--font-display)',
    fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
  tierEntryUnit: { color: 'var(--fg3)', fontSize: 15, fontWeight: 500, marginLeft: 4 },
  tierRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderTop: '1px solid var(--hairline-soft)' },
  tierLbl: { color: 'var(--fg3)' },
  tierVal: { color: 'var(--fg1)', fontFamily: 'var(--font-mono)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },

  /* ---------- SECURITY ---------- */
  secGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 },
  secCard: {
    background: '#fff', borderRadius: 18, padding: '24px 24px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  secIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'var(--accent-bg)', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  secTitle: { fontSize: 16, fontWeight: 600, color: 'var(--fg1)' },
  secBody: { fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55 },

  /* ---------- FINAL CTA ---------- */
  finalCta: {
    margin: '0 32px 96px', maxWidth: 1200,
    marginLeft: 'auto', marginRight: 'auto',
    background: '#1D1D1F', color: '#fff',
    borderRadius: 28,
    padding: '64px 48px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18,
    position: 'relative', overflow: 'hidden',
  },
  finalGlow: {
    position: 'absolute', top: -120, right: -100,
    width: 420, height: 420,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.30), transparent 70%)',
    pointerEvents: 'none',
  },
  finalH: {
    fontFamily: 'var(--font-display)',
    fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
    color: '#fff', maxWidth: 640,
  },
  finalSub: { fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 540, lineHeight: 1.55 },
  finalCtaBtn: {
    marginTop: 12,
    height: 48, padding: '0 28px', borderRadius: 14,
    background: '#fff', color: '#1D1D1F',
    fontSize: 15, fontWeight: 600,
    border: 0, cursor: 'pointer', fontFamily: 'inherit',
    textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  },
};

/* ---------- Cell row visual used inside hero ---------- */
function MiniQueueCard({ level, entry, color, filled }) {
  return (
    <div style={{
      background: 'var(--bg)', borderRadius: 14, padding: '14px 14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--fg2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}/>Level {level}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
        {entry.toLocaleString('ru-RU').replace(/,/g,' ')}
        <span style={{ color: 'var(--fg3)', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>USDT</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 16, borderRadius: 4,
            background: i < filled ? 'var(--success)' : 'var(--cell-empty-bg)',
            boxShadow: i < filled ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
          }}/>
        ))}
      </div>
    </div>
  );
}

function StepCells({ filled, bonus }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
          width: 26, height: 32, borderRadius: 6,
          background: i < filled ? 'var(--success)' :
                      i === bonus ? 'var(--cell-bonus)' :
                      'var(--cell-empty-bg)',
          boxShadow: i < filled || i === bonus ? 'none' : 'inset 0 0 0 1px var(--cell-empty-ring)',
        }}/>
      ))}
    </div>
  );
}

function StepSplit() {
  return (
    <div style={{ display: 'flex', gap: 4, width: '100%' }}>
      <div style={{ flex: 10, height: 16, background: 'var(--neutral)',  borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>10%</div>
      <div style={{ flex: 60, height: 16, background: 'var(--success)',  borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>60%</div>
      <div style={{ flex: 30, height: 16, background: 'var(--gold)',     borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>30%</div>
    </div>
  );
}

function StepLock() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <IcLock size={20} stroke="var(--accent)"/>
      <div style={{ flex: 1 }}>
        <div style={{ height: 6, background: 'var(--cell-empty-bg)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'var(--accent)' }}/>
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>4 д 12:32:08 до разблокировки</div>
      </div>
    </div>
  );
}

const TIERS_LANDING = [
  { level: 1, entry: 20,   payout: 30,    perCell: 6,   color: '#5AC8FA' },
  { level: 2, entry: 100,  payout: 150,   perCell: 30,  color: '#007AFF' },
  { level: 3, entry: 700,  payout: 1050,  perCell: 210, color: '#5856D6' },
  { level: 4, entry: 2000, payout: 3000,  perCell: 600, color: '#AF52DE' },
];

function Landing() {
  return (
    <div style={landingStyles.page}>
      <MarketingNav/>

      {/* ---------- HERO ---------- */}
      <section style={landingStyles.hero}>
        <div style={landingStyles.heroGlow}/>
        <div style={landingStyles.heroInner}>
          <div style={landingStyles.eyebrow}>
            <span style={landingStyles.eyebrowDot}/>
            Платформа распределяет 100% входящих средств
          </div>
          <h1 style={landingStyles.h1}>
            Прозрачная очередь<br/>ликвидности.
          </h1>
          <p style={landingStyles.sub}>
            Cascade — это не инвестиционный проект с фиксированным процентом. Это математическая модель распределения средств между участниками по правилу «живой очереди».
          </p>
          <div style={landingStyles.ctaRow}>
            <a style={landingStyles.ctaPrimary} href="auth.html">
              Начать с Level 1 · 20 USDT <IcChevron size={14}/>
            </a>
            <a style={landingStyles.ctaSecondary} href="#how">
              Как это работает
            </a>
          </div>

          <div style={landingStyles.heroVisual}>
            <div style={landingStyles.visualHead}>
              <img src="../../assets/glyph.svg" width="20" height="20"/>
              <span style={landingStyles.visualTitle}>Активные очереди</span>
              <span style={landingStyles.visualMeta}>4 уровня · изолированные котлы</span>
            </div>
            <div style={landingStyles.visualGrid}>
              <MiniQueueCard level={1} entry={20}   color="#5AC8FA" filled={5}/>
              <MiniQueueCard level={2} entry={100}  color="#007AFF" filled={3}/>
              <MiniQueueCard level={3} entry={700}  color="#5856D6" filled={2}/>
              <MiniQueueCard level={4} entry={2000} color="#AF52DE" filled={1}/>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PILLARS ---------- */}
      <section style={landingStyles.section}>
        <div style={landingStyles.pillars}>
          <div style={landingStyles.pillar}>
            <div style={landingStyles.pillarNum}>10/60/30</div>
            <div style={landingStyles.pillarLabel}>Сплит каждого депозита: сервис · реферер · очередь</div>
          </div>
          <div style={landingStyles.pillar}>
            <div style={landingStyles.pillarNum}>5 <span style={{ color: 'var(--fg3)' }}>/</span> 5</div>
            <div style={landingStyles.pillarLabel}>Ячеек до закрытия цикла. Выплата — 150% от номинала</div>
          </div>
          <div style={landingStyles.pillar}>
            <div style={landingStyles.pillarNum}>7 <span style={{ color: 'var(--fg3)', fontSize: 18 }}>дней</span></div>
            <div style={landingStyles.pillarLabel}>Двойной замок. Минимальное время с момента покупки уровня</div>
          </div>
          <div style={landingStyles.pillar}>
            <div style={landingStyles.pillarNum}>0%</div>
            <div style={landingStyles.pillarLabel}>Комиссия при выводе. Получаете ровно сумму баланса</div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section style={landingStyles.section} id="how">
        <div style={landingStyles.sectionEyebrow}>Как это работает</div>
        <h2 style={landingStyles.sectionH2}>Три шага между депозитом и выплатой.</h2>
        <p style={landingStyles.sectionSub}>
          Cascade не двигает деньги вне очереди. Каждый USDT, поступивший на платформу, движется по правилам, видимым в реальном времени из кабинета.
        </p>

        <div style={landingStyles.steps}>
          <div style={landingStyles.step}>
            <div style={landingStyles.stepN}>01 · ДЕПОЗИТ</div>
            <div style={landingStyles.stepTitle}>Сплит входа</div>
            <div style={landingStyles.stepBody}>
              10% — сервису. 60% — рефереру при соответствии его уровня. 30% — первому в очереди по правилу каскада. При «обрезке» бонус 60% не пропадает, а уходит в очередь.
            </div>
            <div style={landingStyles.stepVisual}><StepSplit/></div>
          </div>

          <div style={landingStyles.step}>
            <div style={landingStyles.stepN}>02 · ОЧЕРЕДЬ</div>
            <div style={landingStyles.stepTitle}>Закрашивание ячеек</div>
            <div style={landingStyles.stepBody}>
              Каждая входящая ячейка заполняет ваш счётчик. Излишек автоматически переходит следующему в очереди — это и есть каскад. 5 ячеек = 150% от вклада.
            </div>
            <div style={landingStyles.stepVisual}><StepCells filled={3} bonus={3}/></div>
          </div>

          <div style={landingStyles.step}>
            <div style={landingStyles.stepN}>03 · ВЫВОД</div>
            <div style={landingStyles.stepTitle}>Двойной замок</div>
            <div style={landingStyles.stepBody}>
              Кнопка «Вывод» активируется при выполнении двух условий: 5/5 ячеек закрашены И прошло 7 полных суток с момента входа. Холд — 72 часа.
            </div>
            <div style={landingStyles.stepVisual}><StepLock/></div>
          </div>
        </div>
      </section>

      {/* ---------- TIERS ---------- */}
      <section style={landingStyles.section}>
        <div style={landingStyles.sectionEyebrow}>Тарифы</div>
        <h2 style={landingStyles.sectionH2}>Четыре изолированных уровня.</h2>
        <p style={landingStyles.sectionSub}>
          Ликвидность каждого уровня — отдельный котёл. Депозиты в очереди 700 закрывают ячейки только участникам очереди 700. Можно покупать все уровни одновременно.
        </p>

        <div style={landingStyles.tiers}>
          {TIERS_LANDING.map(t => (
            <div key={t.level} style={landingStyles.tierCard(t.color)}>
              <div style={landingStyles.tierBar(t.color)}/>
              <div style={landingStyles.tierName}>Level {t.level}</div>
              <div style={landingStyles.tierEntry}>
                {t.entry.toLocaleString('ru-RU').replace(/,/g,' ')}
                <span style={landingStyles.tierEntryUnit}>USDT</span>
              </div>
              <div>
                <div style={landingStyles.tierRow}>
                  <span style={landingStyles.tierLbl}>За ячейку (30%)</span>
                  <span style={landingStyles.tierVal}>{t.perCell} USDT</span>
                </div>
                <div style={landingStyles.tierRow}>
                  <span style={landingStyles.tierLbl}>Цикл (150%)</span>
                  <span style={landingStyles.tierVal}>{t.payout.toLocaleString('ru-RU').replace(/,/g,' ')} USDT</span>
                </div>
                <div style={landingStyles.tierRow}>
                  <span style={landingStyles.tierLbl}>Замок</span>
                  <span style={landingStyles.tierVal}>5/5 + 7 д</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SECURITY ---------- */}
      <section style={landingStyles.section}>
        <div style={landingStyles.sectionEyebrow}>Безопасность</div>
        <h2 style={landingStyles.sectionH2}>Платформа технически не может уйти в дефицит.</h2>
        <p style={landingStyles.sectionSub}>
          Распределяется только 100% входящих средств. Никаких фиксированных процентов, никаких внешних обязательств — только математика очереди.
        </p>

        <div style={landingStyles.secGrid}>
          <div style={landingStyles.secCard}>
            <div style={landingStyles.secIcon}><IcLock size={18}/></div>
            <div style={landingStyles.secTitle}>ACID-транзакции</div>
            <div style={landingStyles.secBody}>
              Каждая финансовая операция атомарна. <code className="t-code">SELECT FOR UPDATE</code> на счётчике ячеек исключает «состояние гонки» — одна ячейка не может быть зачислена двум людям одновременно.
            </div>
          </div>
          <div style={landingStyles.secCard}>
            <div style={landingStyles.secIcon}><IcUsers size={18}/></div>
            <div style={landingStyles.secTitle}>Анти-абуз</div>
            <div style={landingStyles.secBody}>
              Самоприглашения и циклические рефералы блокируются по IP и отпечатку браузера. При несоответствии уровней бонус не пропадает — он ускоряет очередь.
            </div>
          </div>
          <div style={landingStyles.secCard}>
            <div style={landingStyles.secIcon}><IcRefresh size={18}/></div>
            <div style={landingStyles.secTitle}>Авто-реинвест</div>
            <div style={landingStyles.secBody}>
              Если 5/5 закрыто и пользователь не возвращается 3 дня, средства принудительно идут в очередь активным участникам. Касса не зависает на «мёртвых» аккаунтах.
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section style={landingStyles.finalCta}>
        <div style={landingStyles.finalGlow}/>
        <h2 style={landingStyles.finalH}>Начните с минимального уровня.</h2>
        <p style={landingStyles.finalSub}>
          20 USDT, никаких подписок, никаких комиссий при выводе. Регистрация занимает меньше минуты.
        </p>
        <a style={landingStyles.finalCtaBtn} href="auth.html">
          Создать аккаунт <IcChevron size={14}/>
        </a>
      </section>

      <MarketingFooter/>
    </div>
  );
}

Object.assign(window, { Landing });
