# SimuMart — Plan

A polished, mobile-first fake marketplace. Everything persists in localStorage. EN/AR ready (start in EN). Dark/light. Custom currency glyph ⃁ replaces all $/SAR symbols.

## Visual direction

- **Type:** Figtree (UI) + Outfit (display headings). Loaded via `@fontsource`.
- **Light palette:** bg `#FBFAF7`, surface `#FFFFFF`, ink `#0E1116`, muted `#6B7280`, primary `#0E1116` (near-black, premium), accent `#F25C2A` (warm coral for CTAs/coins), success `#16A34A`, border `#ECE9E2`.
- **Dark palette:** bg `#0B0C0F`, surface `#15171C`, ink `#F5F5F4`, muted `#9AA0A6`, primary `#F5F5F4`, accent `#FF6A3D`, border `#23262D`.
- **Coin gold (gamification only):** `#E8B341` with subtle gradient.
- **Radii:** cards 18px, chips 999px, buttons 14px. Soft shadows, never glow.
- **Motion:** Framer Motion. Page transitions 220ms ease-out; card press scale 0.98; unlock animation = confetti burst + coin shower + scale-in modal (450ms spring).

## Pages

1. **Home** — sticky search bar, horizontal category chips (locked ones show 🔒), hero banner, Featured rail, Trending grid, daily-check-in card showing streak + claim button.
2. **Category** — filter chips, sort dropdown, responsive product grid. Locked categories redirect to Unlock page.
3. **Product** — swipeable image gallery, title/rating/price, qty selector, sticky bottom bar with "Add to cart" + "Buy now", description, fake reviews (seeded), related items rail.
4. **Cart** — line items with qty steppers, swipe-to-delete, subtotal, shipping (fake flat ⃁15, free over ⃁200), VAT 15%, total, Checkout CTA.
5. **Checkout** — multi-step (Address → Payment → Review): premium card-style form, fake card with live formatting (never submitted anywhere), order summary, "Place order" → success screen with order number, confetti, ETA, and earned coins.
6. **Profile / Wallet** — avatar, username (editable), coin balance with gradient card, streak flame + calendar dots, unlocked worlds grid, referral code with copy/share, "Redeem referral" input, settings (theme, language).
7. **Unlock page** — shown when tapping locked category: requirements (days streak OR coin cost), "Unlock with coins" button, animated preview.

## Gamification rules

- Sign up: **+100 coins**
- Daily check-in: **+20 coins** (once per local day)
- Streak bonus: +10 × streak day (cap +100)
- Referral redeemed: **+150** to both parties (one-time per code)
- **Perfume unlock:** 2-day streak OR 500 coins
- **Food unlock:** 3-day streak OR 1000 coins
- Order placed: **+50 coins**, +1 to lifetime orders

## Data sources

Primary: **DummyJSON** (`/products`, `/products/categories`).
- Map `fragrances` → Perfume world (locked).
- Map `groceries` → Food world (locked).
- All other categories → General store (open).
Secondary: **FakeStoreAPI** merged in for variety (normalized to common shape).
Fallback: bundled seed JSON if both fail. Skeletons during load, friendly error card with retry.

## i18n

- `react-i18next` with `en` and `ar` JSON dictionaries.
- Language toggle in Profile + first-run.
- `dir="rtl"` applied to `<html>` when Arabic; layout already mobile-first flex/grid so RTL works.
- Currency formatter outputs `⃁ 199.00` (LTR-isolated in RTL).

## Persistence (localStorage)

Single namespace `simumart:v1` with keys: `profile`, `wallet`, `streak`, `unlocks`, `cart`, `orders`, `referral`, `prefs` (theme, lang). Zustand store with `persist` middleware.

## Technical details

- **Stack:** existing TanStack Start + Tailwind v4 + shadcn. No backend (per user choice).
- **Routes (`src/routes/`):**
  - `index.tsx` (Home)
  - `category.$slug.tsx`
  - `product.$id.tsx`
  - `cart.tsx`
  - `checkout.tsx`
  - `checkout.success.tsx`
  - `profile.tsx`
  - `unlock.$slug.tsx`
  - `__root.tsx` updated with bottom tab bar (Home / Search / Cart / Profile), top app bar, theme + lang providers, disclaimer ribbon.
- **State:** `zustand` + `zustand/middleware/persist`.
- **Data fetching:** TanStack Query with `ensureQueryData` in loaders, `useSuspenseQuery` in components, fallback chain DummyJSON → FakeStoreAPI → seed.
- **Components (`src/components/`):** `AppShell`, `BottomNav`, `TopBar`, `ProductCard`, `PriceTag` (renders ⃁), `CategoryChip`, `RatingStars`, `QtyStepper`, `CoinBadge`, `StreakFlame`, `UnlockModal`, `DisclaimerBar`, `Skeletons`, `EmptyState`, `LangThemeToggle`.
- **Lib:** `currency.ts` (⃁ formatter), `i18n.ts`, `store.ts` (zustand), `api.ts` (multi-source fetcher + normalizer), `gamification.ts` (coin/streak/unlock logic with date math), `seed.ts` (fallback catalog + reviews).
- **Packages to add:** `@tanstack/react-query` (verify), `zustand`, `framer-motion`, `react-i18next` + `i18next`, `canvas-confetti`, `@fontsource/figtree`, `@fontsource/outfit`, `embla-carousel-react` (gallery + rails).
- **Tailwind tokens:** add all palette + coin gold + brand fonts to `src/styles.css` under `@theme inline` mapped to `:root` / `.dark` oklch values. Dark mode via `.dark` class on `<html>`.
- **Disclaimer:** thin ribbon under top bar on every page: "Simulation only — no real purchases." (translated).
- **Checkout safety:** card form is pure UI; no network request to any payment processor. Order is written to localStorage only.

## Out of scope for v1

Real auth, real payments, push notifications, server-side leaderboards, in-app messaging, image generation for product photos (uses API images).

## Acceptance check

- Home loads with real products, currency shows ⃁.
- Can add to cart, adjust qty, complete fake checkout, see success screen, +50 coins applied.
- Daily check-in awards coins once per day; streak increments next day.
- Perfume/Food categories show Unlock page until conditions met, with animation.
- Refresh preserves wallet, streak, cart, unlocks.
- Toggle dark mode and Arabic — layout flips RTL, copy translates.
- Offline / API failure shows skeletons then a retry card.
