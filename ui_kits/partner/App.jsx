const partnerAppStyles = {
  shell: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  content: {
    padding: '24px 32px 48px', maxWidth: 1200, width: '100%', margin: '0 auto',
    display: 'flex', flexDirection: 'column', gap: 18,
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
};

function PartnerApp() {
  return (
    <div style={partnerAppStyles.shell}>
      <Sidebar active="partners"/>
      <div style={partnerAppStyles.main}>
        <Topbar title="Партнёры"/>
        <div style={partnerAppStyles.content}>
          <div style={partnerAppStyles.twoCol}>
            <RefLinkCard active={true}/>
            <MissedEarnings/>
          </div>
          <BonusStats/>
          <InvitesTable/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PartnerApp });
