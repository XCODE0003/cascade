const refStyles = {
  wrap: {
    background: '#fff', borderRadius: 20, padding: '22px 24px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  head: { display: 'flex', alignItems: 'center', gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  status: (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 9px', borderRadius: 999,
    fontSize: 11, fontWeight: 600,
    background: active ? 'var(--success-bg)' : 'var(--neutral-bg)',
    color: active ? '#1a6e34' : 'var(--fg2)',
    marginLeft: 'auto',
  }),
  dot: (active) => ({ width: 6, height: 6, borderRadius: '50%', background: active ? 'var(--success)' : 'var(--neutral)' }),

  field: {
    display: 'flex', alignItems: 'center', gap: 10,
    height: 48, padding: '0 6px 0 16px',
    background: 'var(--bg-elevated)',
    borderRadius: 12,
  },
  link: {
    flex: 1, minWidth: 0,
    fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg1)',
    fontWeight: 500,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  copyBtn: {
    height: 36, padding: '0 14px',
    background: '#fff', border: 0, borderRadius: 9,
    fontSize: 13, fontWeight: 600, color: 'var(--fg1)',
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
  },

  notice: {
    display: 'flex', gap: 10, padding: '12px 14px',
    background: 'var(--warning-bg)', borderRadius: 12,
    color: '#8c5400', fontSize: 12, lineHeight: 1.45,
  },
};

function RefLinkCard({ active = true }) {
  const [copied, setCopied] = React.useState(false);
  const link = 'cascade.app/r/481923';

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div style={refStyles.wrap}>
      <div style={refStyles.head}>
        <div style={refStyles.title}>Реферальная ссылка</div>
        <div style={refStyles.status(active)}>
          <span style={refStyles.dot(active)}/>
          {active ? 'Активна' : 'Неактивна'}
        </div>
      </div>

      <div style={refStyles.field}>
        <div style={refStyles.link}>{link}</div>
        <button style={refStyles.copyBtn} onClick={copy}>
          {copied ? <><IcCheck size={14} stroke="var(--success)"/> Скопировано</> : <><IcCopy size={14}/> Копировать</>}
        </button>
      </div>

      {!active && (
        <div style={refStyles.notice}>
          <IcInfo size={14}/>
          <span>
            У вас нет активных пакетов. Линия временно недоступна — приглашённые не смогут зарегистрироваться по этой ссылке. Активируйте любой уровень, чтобы возобновить работу.
          </span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RefLinkCard });
