const partnerMStyles = {
  page: { padding: '8px 16px 24px' },

  refCard: {
    background: '#fff', borderRadius: 18, padding: '18px 18px 16px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  refHead: { display: 'flex', alignItems: 'center', gap: 8 },
  refTitle: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 },
  refStatus: {
    marginLeft: 'auto',
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: 'var(--success-bg)', color: '#1a6e34',
    padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
  },
  dot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' },
  refField: {
    display: 'flex', alignItems: 'center', gap: 8,
    height: 44, padding: '0 6px 0 14px',
    background: 'var(--bg-elevated)', borderRadius: 11,
  },
  refLink: { flex: 1, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg1)' },
  shareBtn: {
    height: 32, padding: '0 12px', borderRadius: 8,
    background: '#fff', border: 0,
    fontSize: 12, fontWeight: 600, color: 'var(--fg1)',
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  },

  missed: {
    background: '#fff', borderRadius: 18, padding: '18px 18px 16px', marginTop: 12,
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    position: 'relative', overflow: 'hidden',
  },
  missedGlow: {
    position: 'absolute', top: -80, right: -50, width: 220, height: 220,
    background: 'radial-gradient(closest-side, rgba(255,159,10,0.12), transparent)',
    pointerEvents: 'none',
  },
  missedLbl: { fontSize: 12, fontWeight: 600, color: 'var(--fg2)' },
  missedVal: {
    fontFamily: 'var(--font-display)',
    fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--warning)',
    fontVariantNumeric: 'tabular-nums', marginTop: 6,
    position: 'relative',
  },
  missedSub: { fontSize: 12, color: 'var(--fg3)', marginTop: 6, position: 'relative' },

  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '14px 12px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
  },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  statLbl: { fontSize: 11, color: 'var(--fg3)', marginTop: 2, lineHeight: 1.3 },

  sectionRow: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    margin: '20px 0 10px',
  },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 },
  sectionSub: { fontSize: 12, color: 'var(--fg3)' },

  inviteCard: {
    background: '#fff', borderRadius: 14, padding: '12px 14px',
    boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 8,
  },
  avatar: (hue) => ({
    width: 36, height: 36, borderRadius: '50%',
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 70%), hsl(${(hue+30)%360}, 70%, 55%))`,
    color: '#fff', fontWeight: 700, fontSize: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }),
  inviteBody: { flex: 1, minWidth: 0 },
  inviteName: { fontSize: 14, fontWeight: 600 },
  inviteMeta: { fontSize: 11, color: 'var(--fg3)', marginTop: 2 },
  inviteEarn: { fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13, color: 'var(--success)', fontVariantNumeric: 'tabular-nums' },

  pill: (variant) => {
    const map = {
      active: ['var(--success-bg)', '#1a6e34', 'var(--success)'],
      grey:   ['var(--neutral-bg)', 'var(--fg2)', 'var(--neutral)'],
      empty:  ['var(--bg-elevated)', 'var(--fg3)', 'var(--fg3)'],
    };
    const [bg, fg, dot] = map[variant];
    return { bg, fg, dot };
  },
  pillBox: (v) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 7px', borderRadius: 999,
    fontSize: 10, fontWeight: 600,
    background: v.bg, color: v.fg,
    marginTop: 3,
  }),
};

const INVITES_M = [
  { user: 'u_4821', level: 'Level 2', earned: '60', status: 'active', joined: '5 дн' },
  { user: 'u_9182', level: 'Level 1', earned: '12', status: 'active', joined: '5 дн' },
  { user: 'u_3019', level: 'Level 2', earned: '60', status: 'active', joined: '8 дн' },
  { user: 'u_7702', level: 'Level 4', earned: '0',  status: 'grey',   joined: '2 нед' },
];

function PartnerScreen() {
  const [copied, setCopied] = React.useState(false);

  return (
    <MobileShell title="Партнёры">
      <div style={partnerMStyles.page}>

        <div style={partnerMStyles.refCard}>
          <div style={partnerMStyles.refHead}>
            <div style={partnerMStyles.refTitle}>Реферальная ссылка</div>
            <span style={partnerMStyles.refStatus}><span style={partnerMStyles.dot}/>Активна</span>
          </div>
          <div style={partnerMStyles.refField}>
            <span style={partnerMStyles.refLink}>cascade.app/r/481923</span>
            <button style={partnerMStyles.shareBtn} onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
              {copied ? <><IcCheck size={11} stroke="var(--success)"/>Скоп.</> : <><IcCopy size={11}/>Копи.</>}
            </button>
          </div>
        </div>

        <div style={partnerMStyles.missed}>
          <div style={partnerMStyles.missedGlow}/>
          <div style={partnerMStyles.missedLbl}>Упущенная прибыль</div>
          <div style={partnerMStyles.missedVal}>2 040<span style={{ fontSize: 16, color: 'var(--fg3)', fontWeight: 500, marginLeft: 5 }}>USDT</span></div>
          <div style={partnerMStyles.missedSub}>Бонусы, ушедшие в очередь из-за обрезки. Активируйте Level 3+, чтобы их получать.</div>
        </div>

        <div style={partnerMStyles.stats}>
          <div style={partnerMStyles.statCard}>
            <div style={partnerMStyles.statVal}>284</div>
            <div style={partnerMStyles.statLbl}>Заработано USDT</div>
          </div>
          <div style={partnerMStyles.statCard}>
            <div style={partnerMStyles.statVal}>3 / 5</div>
            <div style={partnerMStyles.statLbl}>Бонус. ячеек</div>
          </div>
          <div style={partnerMStyles.statCard}>
            <div style={partnerMStyles.statVal}>3 / 5</div>
            <div style={partnerMStyles.statLbl}>Правило 5 друзей</div>
          </div>
        </div>

        <div style={partnerMStyles.sectionRow}>
          <div style={partnerMStyles.sectionTitle}>Приглашённые</div>
          <div style={partnerMStyles.sectionSub}>4 чел.</div>
        </div>

        {INVITES_M.map((r, i) => {
          const v = partnerMStyles.pill(r.status);
          return (
            <div key={r.user} style={partnerMStyles.inviteCard}>
              <div style={partnerMStyles.avatar((i * 67) % 360)}>{r.user.slice(2,4).toUpperCase()}</div>
              <div style={partnerMStyles.inviteBody}>
                <div style={partnerMStyles.inviteName}>{r.user}</div>
                <div style={partnerMStyles.inviteMeta}>{r.level} · {r.joined} назад</div>
                <span style={partnerMStyles.pillBox(v)}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: v.dot }}/>
                  {r.status === 'active' ? 'Активен' : r.status === 'grey' ? 'Неактивен' : 'Не куплен'}
                </span>
              </div>
              <span style={partnerMStyles.inviteEarn}>+{r.earned} USDT</span>
            </div>
          );
        })}

      </div>
    </MobileShell>
  );
}

Object.assign(window, { PartnerScreen });
