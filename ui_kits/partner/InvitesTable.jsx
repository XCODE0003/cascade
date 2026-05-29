const invitesStyles = {
  wrap: {
    background: '#fff', borderRadius: 18,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  head: {
    padding: '18px 24px 14px',
    display: 'flex', alignItems: 'baseline', gap: 12,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
  sub: { fontSize: 12, color: 'var(--fg3)' },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: 11, color: 'var(--fg3)', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.04em',
    padding: '12px 24px', textAlign: 'left',
    borderTop: '1px solid var(--hairline)',
    borderBottom: '1px solid var(--hairline)',
    background: 'var(--bg)',
  },
  td: {
    padding: '14px 24px',
    borderBottom: '1px solid var(--hairline-soft)',
    fontSize: 13, color: 'var(--fg1)',
  },
  user: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: (hue) => ({
    width: 28, height: 28, borderRadius: '50%',
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 70%), hsl(${(hue + 30) % 360}, 70%, 55%))`,
    color: '#fff', fontWeight: 600, fontSize: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  pill: (variant) => {
    const map = {
      active:  ['var(--success-bg)', '#1a6e34', 'var(--success)'],
      grey:    ['var(--neutral-bg)', 'var(--fg2)', 'var(--neutral)'],
      empty:   ['var(--bg-elevated)', 'var(--fg3)', 'var(--fg3)'],
    };
    const [bg, fg, dot] = map[variant];
    return { bg, fg, dot };
  },
  pillNode: (v) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 9px', borderRadius: 999,
    fontSize: 11, fontWeight: 600,
    background: v.bg, color: v.fg,
  }),
};

const INVITES = [
  { user: 'u_4821', level: 'Level 2',  earned: '60,00',  joined: '5 дн назад', status: 'active' },
  { user: 'u_9182', level: 'Level 1',  earned: '12,00',  joined: '5 дн назад', status: 'active' },
  { user: 'u_3019', level: 'Level 2',  earned: '60,00',  joined: '8 дн назад', status: 'active' },
  { user: 'u_7702', level: 'Level 4',  earned: '0,00',   joined: '2 нед назад', status: 'grey' },
  { user: 'u_5512', level: 'не куплен', earned: '0,00',   joined: '3 нед назад', status: 'empty' },
];

const STATUS_LABEL = { active: 'Активен', grey: 'Неактивен в очереди', empty: 'Не активирован' };

function InvitesTable() {
  return (
    <div style={invitesStyles.wrap}>
      <div style={invitesStyles.head}>
        <div style={invitesStyles.title}>Приглашённые</div>
        <div style={invitesStyles.sub}>5 рефералов · 3 активных</div>
      </div>
      <table style={invitesStyles.table}>
        <thead>
          <tr>
            <th style={invitesStyles.th}>Пользователь</th>
            <th style={invitesStyles.th}>Уровень</th>
            <th style={invitesStyles.th}>Заработано вами</th>
            <th style={invitesStyles.th}>Присоединился</th>
            <th style={invitesStyles.th}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {INVITES.map((r, i) => {
            const v = invitesStyles.pill(r.status);
            const hue = (i * 67) % 360;
            return (
              <tr key={r.user}>
                <td style={invitesStyles.td}>
                  <div style={invitesStyles.user}>
                    <div style={invitesStyles.avatar(hue)}>{r.user.slice(2,4).toUpperCase()}</div>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{r.user}</span>
                  </div>
                </td>
                <td style={invitesStyles.td}>{r.level}</td>
                <td style={{...invitesStyles.td, fontFamily: 'var(--font-mono)', fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>+{r.earned} USDT</td>
                <td style={{...invitesStyles.td, color: 'var(--fg2)'}}>{r.joined}</td>
                <td style={invitesStyles.td}>
                  <span style={invitesStyles.pillNode(v)}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: v.dot }}/>
                    {STATUS_LABEL[r.status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { InvitesTable });
