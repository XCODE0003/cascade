# Cascade · Admin Back-office UI Kit

Admin's view: confirm deposits, approve/reject withdrawals (with 72h hold), manually shuffle queues, set auto-reinvest threshold.

## Files
- `index.html` — admin shell, with tabbed back-office (Deposits · Withdrawals · Queues · Settings).
- `App.jsx` — layout + tab routing.
- `AdminSidebar.jsx` — narrow icon-rail navigation.
- `DepositsTable.jsx`, `WithdrawalsTable.jsx`, `QueueManager.jsx`, `Settings.jsx` — the four tabs.

## Visual
Same Apple-light tokens as Dashboard. Information density slightly higher (more table rows visible). Action buttons remain calm — destructive actions are red, confirmations are green, but most of the UI is greyscale.
