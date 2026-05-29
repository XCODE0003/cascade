const profMStyles = {
  page: { padding: '8px 16px 24px' },

  user: {
    background: '#fff', borderRadius: 18, padding: '20px 20px 18px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%)',
    color: '#fff', fontWeight: 700, fontSize: 22,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  userBody: { flex: 1, minWidth: 0 },
  userName: { fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 },
  userId: { fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', marginTop: 2 },
  status: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 9px', borderRadius: 999, marginTop: 6,
    background: 'var(--success-bg)', color: '#1a6e34',
    fontSize: 11, fontWeight: 600,
  },

  group: { marginTop: 24 },
  groupLbl: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: 'var(--fg3)', padding: '0 14px 8px',
  },
  list: {
    background: '#fff', borderRadius: 14,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 16px',
    borderTop: '1px solid var(--hairline-soft)',
  },
  rowFirst: { borderTop: 0 },
  icoBg: (color) => ({
    width: 28, height: 28, borderRadius: 7,
    background: color,
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }),
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, color: 'var(--fg1)', fontWeight: 500 },
  rowMeta: { fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' },
  chev: { color: 'var(--fg3)' },

  toggle: (on) => ({
    width: 51, height: 31, borderRadius: 999,
    background: on ? 'var(--success)' : 'var(--neutral-bg)',
    position: 'relative', cursor: 'pointer', flexShrink: 0,
  }),
  knob: (on) => ({
    position: 'absolute', top: 2, left: 2,
    width: 27, height: 27, borderRadius: '50%', background: '#fff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
    transform: on ? 'translateX(20px)' : 'translateX(0)',
    transition: 'transform 200ms ease',
  }),

  signOut: {
    width: '100%', marginTop: 24,
    height: 48, borderRadius: 14, border: 0,
    background: '#fff', color: 'var(--danger)',
    fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    cursor: 'pointer',
  },
};

function ProfileScreen() {
  const [push, setPush] = React.useState(true);
  const [biometry, setBiometry] = React.useState(true);
  const [autoReinvest, setAutoReinvest] = React.useState(false);

  return (
    <MobileShell title="Профиль">
      <div style={profMStyles.page}>

        <div style={profMStyles.user}>
          <div style={profMStyles.avatar}>А</div>
          <div style={profMStyles.userBody}>
            <div style={profMStyles.userName}>Аноним</div>
            <div style={profMStyles.userId}>ID 481 923 · cascade.app/r/481923</div>
            <span style={profMStyles.status}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>
              Активен · 3 уровня
            </span>
          </div>
        </div>

        <div style={profMStyles.group}>
          <div style={profMStyles.groupLbl}>Уведомления и безопасность</div>
          <div style={profMStyles.list}>
            <div style={{ ...profMStyles.row, ...profMStyles.rowFirst }}>
              <div style={profMStyles.icoBg('var(--accent)')}><IcBell size={14}/></div>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Push-уведомления</div>
              </div>
              <div style={profMStyles.toggle(push)} onClick={() => setPush(v => !v)}><div style={profMStyles.knob(push)}/></div>
            </div>
            <div style={profMStyles.row}>
              <div style={profMStyles.icoBg('var(--success)')}><IcLock size={14}/></div>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Face ID для входа</div>
              </div>
              <div style={profMStyles.toggle(biometry)} onClick={() => setBiometry(v => !v)}><div style={profMStyles.knob(biometry)}/></div>
            </div>
            <div style={profMStyles.row}>
              <div style={profMStyles.icoBg('var(--neutral)')}><IcSettings size={14}/></div>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Сменить пароль</div>
              </div>
              <IcChevron size={16} style={profMStyles.chev}/>
            </div>
          </div>
        </div>

        <div style={profMStyles.group}>
          <div style={profMStyles.groupLbl}>Поведение очередей</div>
          <div style={profMStyles.list}>
            <div style={{ ...profMStyles.row, ...profMStyles.rowFirst }}>
              <div style={profMStyles.icoBg('var(--gold)')}><IcRefresh size={14}/></div>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Авто-вход после цикла</div>
                <div style={profMStyles.rowMeta}>Глобальная настройка</div>
              </div>
              <div style={profMStyles.toggle(autoReinvest)} onClick={() => setAutoReinvest(v => !v)}><div style={profMStyles.knob(autoReinvest)}/></div>
            </div>
            <div style={profMStyles.row}>
              <div style={profMStyles.icoBg('var(--level-3)')}><IcQueue size={14}/></div>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Адрес для выплат</div>
                <div style={profMStyles.rowMeta}>TKzx…7eq2yX</div>
              </div>
              <IcChevron size={16} style={profMStyles.chev}/>
            </div>
          </div>
        </div>

        <div style={profMStyles.group}>
          <div style={profMStyles.groupLbl}>О платформе</div>
          <div style={profMStyles.list}>
            <div style={{ ...profMStyles.row, ...profMStyles.rowFirst }}>
              <div style={profMStyles.rowBody}><div style={profMStyles.rowTitle}>Правила платформы</div></div>
              <IcChevron size={16} style={profMStyles.chev}/>
            </div>
            <div style={profMStyles.row}>
              <div style={profMStyles.rowBody}><div style={profMStyles.rowTitle}>Поддержка</div></div>
              <IcChevron size={16} style={profMStyles.chev}/>
            </div>
            <div style={profMStyles.row}>
              <div style={profMStyles.rowBody}>
                <div style={profMStyles.rowTitle}>Версия приложения</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>2.0.0</div>
            </div>
          </div>
        </div>

        <button style={profMStyles.signOut}>Выйти из аккаунта</button>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { ProfileScreen });
