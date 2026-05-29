const settingsStyles = {
  panel: {
    background: '#fff', borderRadius: 18,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    padding: '24px 28px',
  },
  group: { marginBottom: 28 },
  groupLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    color: 'var(--fg3)', textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '14px 0',
    borderTop: '1px solid var(--hairline-soft)',
  },
  rowFirst: { borderTop: 0 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: 600, color: 'var(--fg1)' },
  rowSub: { fontSize: 12, color: 'var(--fg3)', marginTop: 2, lineHeight: 1.45 },

  numField: {
    width: 96,
    height: 36, padding: '0 12px',
    borderRadius: 9,
    background: '#fff',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.10)',
    fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
    color: 'var(--fg1)', border: 0, outline: 'none',
    textAlign: 'right',
  },
  unit: { fontSize: 12, color: 'var(--fg3)', marginLeft: 6, minWidth: 40 },

  toggle: (on) => ({
    width: 51, height: 31,
    background: on ? 'var(--success)' : 'var(--neutral-bg)',
    borderRadius: 999, position: 'relative', cursor: 'pointer',
    transition: 'background 200ms ease',
  }),
  knob: (on) => ({
    position: 'absolute', top: 2, left: 2,
    width: 27, height: 27, borderRadius: '50%', background: '#fff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06)',
    transform: on ? 'translateX(20px)' : 'translateX(0)',
    transition: 'transform 200ms ease',
  }),

  footer: {
    marginTop: 28, paddingTop: 20,
    borderTop: '1px solid var(--hairline)',
    display: 'flex', gap: 10, justifyContent: 'flex-end',
  },
  btn: (variant) => ({
    height: 40, padding: '0 20px', borderRadius: 11,
    border: 0, cursor: 'pointer',
    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    background: variant === 'primary' ? 'var(--accent)' : 'var(--bg-elevated)',
    color: variant === 'primary' ? '#fff' : 'var(--fg1)',
  }),
};

function NumberRow({ title, sub, value, unit, onChange }) {
  return (
    <div style={settingsStyles.row}>
      <div style={settingsStyles.rowBody}>
        <div style={settingsStyles.rowTitle}>{title}</div>
        <div style={settingsStyles.rowSub}>{sub}</div>
      </div>
      <input style={settingsStyles.numField} value={value} onChange={e => onChange(e.target.value)}/>
      <span style={settingsStyles.unit}>{unit}</span>
    </div>
  );
}

function ToggleRow({ title, sub, on, onChange }) {
  return (
    <div style={settingsStyles.row}>
      <div style={settingsStyles.rowBody}>
        <div style={settingsStyles.rowTitle}>{title}</div>
        <div style={settingsStyles.rowSub}>{sub}</div>
      </div>
      <div style={settingsStyles.toggle(on)} onClick={onChange}>
        <div style={settingsStyles.knob(on)}/>
      </div>
    </div>
  );
}

function Settings() {
  const [absent, setAbsent] = React.useState('3');
  const [hold, setHold]     = React.useState('72');
  const [lockDays, setLockDays] = React.useState('7');
  const [minWithdraw, setMinWithdraw] = React.useState('30');
  const [autoReinvest, setAutoReinvest] = React.useState(true);
  const [ipCheck, setIpCheck] = React.useState(true);
  const [circCheck, setCircCheck] = React.useState(true);

  return (
    <div style={settingsStyles.panel}>
      <div style={settingsStyles.group}>
        <div style={settingsStyles.groupLabel}>Тайминги</div>
        <NumberRow
          title="Холд на вывод"
          sub="Заявка остаётся в статусе «В ожидании» этот срок до начала выплаты."
          value={hold} onChange={setHold} unit="часов"/>
        <NumberRow
          title="Двойной замок"
          sub="Минимальное количество дней с момента покупки уровня до возможности вывода (даже при 5/5)."
          value={lockDays} onChange={setLockDays} unit="дней"/>
        <NumberRow
          title="Авто-реинвест за прогулы"
          sub="Если пользователь не зашёл после выполнения «Двойного замка» — система запускает реинвест за него."
          value={absent} onChange={setAbsent} unit="дней"/>
      </div>

      <div style={settingsStyles.group}>
        <div style={settingsStyles.groupLabel}>Финансовые лимиты</div>
        <NumberRow
          title="Минимальная сумма вывода"
          sub="Кнопка «Вывод» в кабинете заблокирована, если итоговый баланс ниже этого порога."
          value={minWithdraw} onChange={setMinWithdraw} unit="USDT"/>
        <ToggleRow
          title="Авто-реинвест включён"
          sub="Принудительный реинвест за прогулы. Защищает кассу от «мёртвых» балансов."
          on={autoReinvest} onChange={() => setAutoReinvest(v => !v)}/>
      </div>

      <div style={settingsStyles.group}>
        <div style={settingsStyles.groupLabel}>Безопасность · анти-абуз</div>
        <ToggleRow
          title="Проверка IP / Fingerprint"
          sub="Блокировать регистрацию по реферальной ссылке при совпадении отпечатка браузера."
          on={ipCheck} onChange={() => setIpCheck(v => !v)}/>
        <ToggleRow
          title="Проверка циклических связей"
          sub="Не допускать ситуаций, где A пригласил B, а B — A. База отвергает такие записи."
          on={circCheck} onChange={() => setCircCheck(v => !v)}/>
      </div>

      <div style={settingsStyles.footer}>
        <button style={settingsStyles.btn('secondary')}>Сбросить</button>
        <button style={settingsStyles.btn('primary')}>Сохранить</button>
      </div>
    </div>
  );
}

Object.assign(window, { Settings });
