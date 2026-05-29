# Cascade · Mobile Web App UI Kit

A 375 px-wide responsive web app version of the Cascade dashboard. Built as a single SPA with a bottom tab bar (iOS-style) — switches between Dashboard, Wallet, Partners, History, Profile without page reloads.

## Files
- `index.html` — the app shell, scaled to fit any screen via `<meta viewport>`.
- `auth.html` — full-screen mobile sign-in / sign-up flow.
- `App.jsx` — top-level state, tab routing.
- `MobileShell.jsx` — chrome (status bar mock, header, tab bar).
- `BottomTabBar.jsx` — fixed-bottom 5-tab navigation.
- `DashboardScreen.jsx`, `WalletScreen.jsx`, `PartnerScreen.jsx`, `HistoryScreen.jsx`, `ProfileScreen.jsx` — screens.
- `Sheet.jsx` — bottom-sheet primitive used by deposit / withdraw flows.

## Layout rules
- 375 px design width. Min hit target 44 px (Apple HIG).
- Single-column everywhere. Queue cards stack vertically.
- Sticky top header (56 px) with backdrop blur, sticky bottom tab bar (60 px + safe-area).
- Modal flows are bottom sheets, not full-screen takeovers.

## Voice
Same Russian formal **Вы**. No emoji in production UI.
