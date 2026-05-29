const authMStyles = {
  scroller: {
    flex: 1, overflowY: 'auto',
    padding: '8px 24px 32px',
    display: 'flex', flexDirection: 'column',
  },

  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, marginTop: 4 },
  brandName: { fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' },

  hero: {
    fontFamily: 'var(--font-display)',
    fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em',
    lineHeight: 1.1, color: 'var(--fg1)',
  },
  heroSub: { fontSize: 14, color: 'var(--fg2)', marginTop: 8, marginBottom: 24, lineHeight: 1.5 },

  tabs: { display: 'flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 3, gap: 3, marginBottom: 20 },
  tab: (active) => ({
    flex: 1, padding: '10px 0',
    border: 0, background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
  }),

  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)', marginBottom: 6 },
  input: {
    width: '100%', height: 48, padding: '0 16px',
    borderRadius: 12,
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
    fontSize: 15, color: 'var(--fg1)', fontFamily: 'var(--font-text)',
    border: 0, outline: 'none',
  },
  refInput: {
    width: '100%', height: 48, padding: '0 16px',
    borderRadius: 12,
    background: 'var(--bg-elevated)',
    fontSize: 14, color: 'var(--fg1)', fontFamily: 'var(--font-mono)',
    border: 0, outline: 'none',
  },
  hint: { fontSize: 11, color: 'var(--fg3)', marginTop: 6, lineHeight: 1.5 },

  agree: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    margin: '8px 0 20px',
    fontSize: 12, color: 'var(--fg2)', lineHeight: 1.5,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, marginTop: 1,
    background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', flexShrink: 0,
  },

  submit: {
    width: '100%', height: 52, borderRadius: 14, border: 0,
    background: 'var(--accent)', color: '#fff',
    fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
    cursor: 'pointer',
  },

  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '20px 0', color: 'var(--fg3)',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
  },
  divLine: { flex: 1, height: 1, background: 'var(--hairline)' },

  sso: {
    width: '100%', height: 48, borderRadius: 12,
    background: '#fff', color: 'var(--fg1)',
    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    border: 0, cursor: 'pointer',
    boxShadow: 'inset 0 0 0 1px var(--hairline-strong)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },

  footer: {
    fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5, textAlign: 'center',
    marginTop: 24,
  },
};

function AuthMobile() {
  const [mode, setMode] = React.useState('register');
  const [agree, setAgree] = React.useState(true);

  return (
    <div className="phone">
      <StatusBar/>
      <div style={authMStyles.scroller}>
        <div style={authMStyles.brand}>
          <img src="../../assets/glyph.svg" width="22" height="22"/>
          <span style={authMStyles.brandName}>Cascade</span>
        </div>

        <div style={authMStyles.hero}>{mode === 'register' ? 'Создание\nаккаунта' : 'Войти в\nаккаунт'}</div>
        <div style={authMStyles.heroSub}>
          {mode === 'register'
            ? 'После регистрации откроется кабинет с четырьмя очередями.'
            : 'Email и пароль для входа в кабинет.'}
        </div>

        <div style={authMStyles.tabs}>
          <button style={authMStyles.tab(mode === 'register')} onClick={() => setMode('register')}>Регистрация</button>
          <button style={authMStyles.tab(mode === 'login')} onClick={() => setMode('login')}>Войти</button>
        </div>

        <div style={authMStyles.field}>
          <div style={authMStyles.label}>Email</div>
          <input style={authMStyles.input} type="email" placeholder="you@example.com"/>
        </div>

        <div style={authMStyles.field}>
          <div style={authMStyles.label}>Пароль</div>
          <input style={authMStyles.input} type="password" placeholder={mode === 'register' ? 'Минимум 8 символов' : 'Ваш пароль'}/>
        </div>

        {mode === 'register' && (
          <div style={authMStyles.field}>
            <div style={authMStyles.label}>Реферальный код · необязательно</div>
            <input style={authMStyles.refInput} defaultValue="u_4821" placeholder="ID пригласителя"/>
            <div style={authMStyles.hint}>Заполнено из ссылки. Реферер получит бонус 60% при соответствии его уровня.</div>
          </div>
        )}

        {mode === 'register' && (
          <div style={authMStyles.agree}>
            <div style={authMStyles.checkbox} onClick={() => setAgree(v => !v)}>
              {agree && <IcCheck size={13}/>}
            </div>
            <span>Я понимаю, что Cascade не является инвестиционным продуктом с фиксированным процентом, и согласен с правилами платформы.</span>
          </div>
        )}

        <button style={authMStyles.submit}>{mode === 'register' ? 'Создать аккаунт' : 'Войти'}</button>

        <div style={authMStyles.divider}>
          <span style={authMStyles.divLine}/><span>ИЛИ</span><span style={authMStyles.divLine}/>
        </div>

        <button style={authMStyles.sso}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 8.4c0-.83.13-1.65.27-2.46H12v4.65h5.6c-.24 1.27-.97 2.35-2.06 3.07v2.55h3.33C20.83 14.4 22 11.65 22 8.4Z"/><path fill="currentColor" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.81-1.76-5.6-4.12H3.05v2.58A10 10 0 0 0 12 22Z"/><path fill="currentColor" d="M6.4 13.91A6.01 6.01 0 0 1 6.4 10.1V7.5H3.05a10 10 0 0 0 0 9.01l3.35-2.6Z"/><path fill="currentColor" d="M12 4.42c1.47 0 2.79.51 3.83 1.5l2.86-2.85C16.97 1.5 14.7.5 12 .5A10 10 0 0 0 3.05 7.5L6.4 10.1c.78-2.36 3-4.12 5.6-4.12Z"/></svg>
          Продолжить с Google
        </button>

        <div style={authMStyles.footer}>
          Прозрачная очередь ликвидности. Платформа не может уйти в дефицит.
        </div>
      </div>

      <div style={{ width: 134, height: 5, borderRadius: 3, background: 'var(--fg1)', margin: '0 auto 8px', flexShrink: 0 }}/>
    </div>
  );
}

Object.assign(window, { AuthMobile });
