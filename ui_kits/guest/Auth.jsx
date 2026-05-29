const authStyles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'var(--bg)',
  },

  /* ---------- LEFT VISUAL PANEL ---------- */
  visual: {
    flex: 1,
    background: '#1D1D1F',
    padding: '40px 48px',
    display: 'flex', flexDirection: 'column',
    color: '#fff',
    position: 'relative', overflow: 'hidden',
  },
  visualGlow: {
    position: 'absolute', top: -160, right: -120, width: 520, height: 520,
    background: 'radial-gradient(closest-side, rgba(0,122,255,0.32), transparent 70%)',
    pointerEvents: 'none',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, position: 'relative' },
  brandName: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' },

  visualBody: {
    marginTop: 'auto', marginBottom: 'auto', maxWidth: 460,
    position: 'relative',
  },
  visualEyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 16,
  },
  visualH: {
    fontFamily: 'var(--font-display)',
    fontSize: 40, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1,
    color: '#fff',
  },
  visualSub: {
    fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 18, lineHeight: 1.55,
  },

  pointsList: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 },
  point: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  pointDot: {
    width: 22, height: 22, borderRadius: '50%',
    background: 'rgba(0,122,255,0.18)', color: '#5AC8FA',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2,
  },
  pointText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
  pointStrong: { color: '#fff', fontWeight: 600 },

  /* ---------- RIGHT FORM PANEL ---------- */
  form: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 48px',
  },
  card: {
    width: '100%', maxWidth: 400,
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  back: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: 'var(--fg2)', textDecoration: 'none',
    marginBottom: 28,
  },
  formH: {
    fontFamily: 'var(--font-display)',
    fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em',
    color: 'var(--fg1)',
  },
  formSub: { fontSize: 14, color: 'var(--fg2)', marginTop: 6, marginBottom: 24 },

  tabs: {
    display: 'flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3, marginBottom: 20,
  },
  tab: (active) => ({
    flex: 1, padding: '9px 0',
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
  }),

  fieldList: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)' },
  input: {
    height: 44, padding: '0 14px',
    borderRadius: 11,
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
    fontSize: 15, color: 'var(--fg1)', fontFamily: 'var(--font-text)',
    border: 0, outline: 'none',
    transition: 'box-shadow var(--dur) var(--ease)',
  },
  refInput: {
    height: 44, padding: '0 14px',
    borderRadius: 11,
    background: 'var(--bg-elevated)',
    fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg1)',
    border: 0, outline: 'none',
  },
  hint: { fontSize: 12, color: 'var(--fg3)', marginTop: 4 },

  agreement: {
    display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4,
    fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5,
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 5, marginTop: 2,
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', flexShrink: 0,
  },

  submit: {
    marginTop: 20,
    height: 48, borderRadius: 12,
    background: 'var(--accent)', color: '#fff',
    border: 0, cursor: 'pointer',
    fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
  },

  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '20px 0', color: 'var(--fg3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
  },
  dividerLine: { flex: 1, height: 1, background: 'var(--hairline)' },

  ssoBtn: {
    height: 44, borderRadius: 11,
    background: '#fff', color: 'var(--fg1)',
    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    border: 0, cursor: 'pointer',
    boxShadow: 'inset 0 0 0 1px var(--hairline-strong)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },

  forgot: { fontSize: 12, color: 'var(--accent)', textDecoration: 'none', alignSelf: 'flex-end' },
};

function Auth() {
  const [mode, setMode] = React.useState('register');
  const [agreed, setAgreed] = React.useState(true);
  return (
    <div style={authStyles.page}>
      {/* LEFT */}
      <aside style={authStyles.visual}>
        <div style={authStyles.visualGlow}/>
        <a href="index.html" style={{ ...authStyles.brand, textDecoration: 'none', color: '#fff' }}>
          <img src="../../assets/glyph.svg" width="22" height="22"/>
          <span style={authStyles.brandName}>Cascade</span>
        </a>

        <div style={authStyles.visualBody}>
          <div style={authStyles.visualEyebrow}>Прозрачная очередь ликвидности</div>
          <div style={authStyles.visualH}>Регистрация — меньше минуты.</div>
          <div style={authStyles.visualSub}>
            Один аккаунт даёт доступ ко всем четырём очередям. Начать можно с минимального уровня — 20 USDT.
          </div>

          <ul style={{ ...authStyles.pointsList, listStyle: 'none', padding: 0, margin: '32px 0 0' }}>
            <li style={authStyles.point}>
              <span style={authStyles.pointDot}><IcCheck size={12}/></span>
              <span style={authStyles.pointText}>
                <span style={authStyles.pointStrong}>0%</span> комиссии при выводе средств
              </span>
            </li>
            <li style={authStyles.point}>
              <span style={authStyles.pointDot}><IcCheck size={12}/></span>
              <span style={authStyles.pointText}>
                <span style={authStyles.pointStrong}>4 изолированных</span> уровня — ликвидность не пересекается
              </span>
            </li>
            <li style={authStyles.point}>
              <span style={authStyles.pointDot}><IcCheck size={12}/></span>
              <span style={authStyles.pointText}>
                <span style={authStyles.pointStrong}>72-часовой холд</span> на выплаты с возможностью отката
              </span>
            </li>
            <li style={authStyles.point}>
              <span style={authStyles.pointDot}><IcCheck size={12}/></span>
              <span style={authStyles.pointText}>
                <span style={authStyles.pointStrong}>Прозрачность:</span> история операций в кабинете в реальном времени
              </span>
            </li>
          </ul>
        </div>

        <div style={{ position: 'relative', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 'auto' }}>
          © 2026 Cascade. Это не инвестиционный продукт с фиксированным процентом.
        </div>
      </aside>

      {/* RIGHT */}
      <main style={authStyles.form}>
        <div style={authStyles.card}>
          <a href="index.html" style={authStyles.back}>
            <IcChevron size={12} style={{ transform: 'rotate(180deg)' }}/> На главную
          </a>

          <h1 style={authStyles.formH}>{mode === 'register' ? 'Создание аккаунта' : 'Вход'}</h1>
          <p style={authStyles.formSub}>
            {mode === 'register'
              ? 'После регистрации вы попадёте в кабинет и сможете активировать любой уровень.'
              : 'Введите email и пароль для входа в кабинет.'}
          </p>

          <div style={authStyles.tabs}>
            <button style={authStyles.tab(mode === 'register')} onClick={() => setMode('register')}>Регистрация</button>
            <button style={authStyles.tab(mode === 'login')} onClick={() => setMode('login')}>Войти</button>
          </div>

          <div style={authStyles.fieldList}>
            <div style={authStyles.field}>
              <label style={authStyles.label}>Email</label>
              <input style={authStyles.input} type="email" placeholder="you@example.com"/>
            </div>

            <div style={authStyles.field}>
              <label style={authStyles.label}>Пароль</label>
              <input style={authStyles.input} type="password" placeholder="Минимум 8 символов"/>
              {mode === 'login' && <a style={authStyles.forgot}>Забыли пароль?</a>}
            </div>

            {mode === 'register' && (
              <div style={authStyles.field}>
                <label style={authStyles.label}>Реферальный код · необязательно</label>
                <input style={authStyles.refInput} placeholder="ID пригласителя" defaultValue="u_4821"/>
                <div style={authStyles.hint}>
                  Заполнено из ссылки. Реферер получит бонус 60% при соответствии его уровня.
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div style={authStyles.agreement}>
                <div style={authStyles.checkbox} onClick={() => setAgreed(v => !v)}>
                  {agreed && <IcCheck size={12}/>}
                </div>
                <span>
                  Я понимаю, что Cascade не является инвестиционным продуктом с фиксированным процентом, и согласен с <a style={{ color: 'var(--accent)' }}>правилами платформы</a>.
                </span>
              </div>
            )}
          </div>

          <button style={authStyles.submit}>
            {mode === 'register' ? 'Создать аккаунт' : 'Войти'}
          </button>

          <div style={authStyles.divider}>
            <span style={authStyles.dividerLine}/>
            <span>ИЛИ</span>
            <span style={authStyles.dividerLine}/>
          </div>

          <button style={authStyles.ssoBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 8.4c0-.83.13-1.65.27-2.46H12v4.65h5.6c-.24 1.27-.97 2.35-2.06 3.07v2.55h3.33C20.83 14.4 22 11.65 22 8.4Z"/><path fill="currentColor" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.81-1.76-5.6-4.12H3.05v2.58A10 10 0 0 0 12 22Z"/><path fill="currentColor" d="M6.4 13.91A6.01 6.01 0 0 1 6.4 10.1V7.5H3.05a10 10 0 0 0 0 9.01l3.35-2.6Z"/><path fill="currentColor" d="M12 4.42c1.47 0 2.79.51 3.83 1.5l2.86-2.85C16.97 1.5 14.7.5 12 .5A10 10 0 0 0 3.05 7.5L6.4 10.1c.78-2.36 3-4.12 5.6-4.12Z"/></svg>
            Продолжить с Google
          </button>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { Auth });
