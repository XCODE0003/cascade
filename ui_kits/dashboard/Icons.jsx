/* Small inline SVG icons. 1.5px stroke, 20px box, lucide-leaning geometry. */
const Icon = ({ d, size = 20, fill = "none", stroke = "currentColor", strokeWidth = 1.5, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d}/> : children}
  </svg>
);

const IcQueue = (p) => (
  <Icon {...p}>
    <rect x="3"  y="14" width="4" height="6" rx="1"/>
    <rect x="9"  y="10" width="4" height="10" rx="1"/>
    <rect x="15" y="6"  width="4" height="14" rx="1"/>
  </Icon>
);
const IcWallet = (p) => (
  <Icon {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>
    <path d="M16 12h3"/>
  </Icon>
);
const IcUsers = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2"/>
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/>
    <circle cx="17" cy="7" r="2.5"/>
    <path d="M16 13c2.5 0 5 1.5 5 4"/>
  </Icon>
);
const IcHistory = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7"/>
    <path d="M3 4v5h5"/>
    <path d="M12 8v5l3 2"/>
  </Icon>
);
const IcSettings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.3 6a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z"/>
  </Icon>
);
const IcPlus = (p) => (<Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>);
const IcArrowUp = (p) => (<Icon {...p}><path d="M12 19V5M6 11l6-6 6 6"/></Icon>);
const IcArrowDown = (p) => (<Icon {...p}><path d="M12 5v14M6 13l6 6 6-6"/></Icon>);
const IcRefresh = (p) => (<Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></Icon>);
const IcChevron = (p) => (<Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>);
const IcCheck = (p) => (<Icon {...p}><path d="M5 12l5 5 9-11"/></Icon>);
const IcClose = (p) => (<Icon {...p}><path d="M6 6l12 12M18 6l-12 12"/></Icon>);
const IcCopy = (p) => (<Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><rect x="4" y="4" width="11" height="11" rx="2"/></Icon>);
const IcLock = (p) => (<Icon {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Icon>);
const IcInfo = (p) => (<Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></Icon>);
const IcBell = (p) => (<Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>);

Object.assign(window, {
  Icon, IcQueue, IcWallet, IcUsers, IcHistory, IcSettings,
  IcPlus, IcArrowUp, IcArrowDown, IcRefresh, IcChevron, IcCheck, IcClose, IcCopy, IcLock, IcInfo, IcBell
});
