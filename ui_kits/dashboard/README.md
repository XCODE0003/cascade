# Cascade · Dashboard UI Kit

The user's primary screen. Surfaces the 4 isolated queues, the consolidated balance, deposit / withdraw / reinvest / upgrade actions, and a recent operations feed.

## Files
- `index.html` — interactive composition (sidebar, header, balance hero, 4 queue cards, history). All actions are mocked.
- `App.jsx` — top-level layout.
- `Sidebar.jsx`, `Topbar.jsx` — navigation chrome.
- `BalanceHero.jsx` — balance + deposit / withdraw.
- `QueueCard.jsx` — single queue widget with cell counter, double-lock timer, reinvest / upgrade.
- `HistoryFeed.jsx` — operations log with colour-coded rows.
- `DepositSheet.jsx` — modal for activating a level (external pay or "from balance").
- `Icons.jsx` — small inline SVG icon set.

## What's interactive
- Click a queue card to activate it (opens deposit sheet).
- Toggle **«Авто-вход»** on each card.
- Click **«Реинвест»** on a ready card to roll it back.
- Click **«Вывод»** in the hero when total balance ≥ 30 USDT — triggers a confirmation modal.

## Notes
- All numbers/labels are illustrative; pulled from the spec where named.
- Russian throughout. Voice = formal **Вы**.
- No real API calls. State is React `useState`.
