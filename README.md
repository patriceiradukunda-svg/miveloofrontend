# Miveloo frontend

Next.js (App Router) + TypeScript + Tailwind. School food marketplace and food-system intelligence platform for Rwanda.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm test
npm run build && npm run test:e2e   # Playwright (npx playwright install first)
```

With no `API_URL`, the app runs on clearly-labelled **sample data**. Demo logins are ON by default while no backend is connected (login page offers one-click demo workspaces for every role); set `DEMO_MODE=false` to turn them off. They are ignored whenever `API_URL` is set. With demo off and no backend, the public site still works and sign-in explains it is unavailable. **Demo mode uses an unsigned cookie and is not security.**

## What is built

| Area | State |
|---|---|
| Public site: home, sell, (the marketplace is private, see below) how it works, schools, institutions, AI, pricing, about, mission, team, impact, contact, FAQ, help, insights, legal drafts | Built (sample data, legal text is draft) |
| Auth: login, 4 registration flows, forgot/resend, verify, invitation, profile, 2FA, access-denied, session-expired | UI + validation built; needs backend endpoints |
| Role workspaces and admin shell, role navigation, server-side route guard, school verification gate | Built |
| School marketplace purchase-request UI, orders list/detail with lifecycle rules, supplier listings + validated form, AI assistant (honest fallback), billing/plan page | Built (sample data) |
| Meal planning, procurement, inventory, exchange, group operations, institutional intelligence, forecasting, payments, admin tooling | Placeholder pages that state their status. Not implemented. |

## The marketplace is private

Visitors and suppliers cannot see marketplace listings. Only verified schools can, at `/school/marketplace`. There is no public marketplace, product or supplier-listing page. Suppliers manage their own listings in `/supplier/products`.

## Security model

* `src/middleware.ts` only does an early redirect when no session cookie exists.
* `src/lib/guard.ts` re-checks role **on the server** for every workspace and admin render.
* `src/lib/session.ts` asks the backend (`GET {API_URL}/auth/session`) who the user is. The browser never decides its own role.
* Public product types (`PublicProduct`) contain only publishable fields.
* **Your backend must enforce identity, organisation membership, verification, role, and plan on every API call, including order, billing and data-export endpoints.** Nothing in this repo can do that for you.
* Payments: use a trusted provider with server-side processing and verified webhooks (`api/webhooks`). No card fields exist in this frontend.

## Backend contract (expected)

`POST /auth/login|register|forgot-password|resend-verification`, `GET /auth/session` → `{userId,name,role,verification}`, `GET /public/products|suppliers`, `POST /supplier/products`, `POST /ai/chat`, `POST /support/contact`.

## Content to supply

* **Logo**: `public/logo.png` is the transparent version of your Harvest Cycle logo. Replace with a real SVG (`logo.svg`) when you have one.
* **Imagery**: your Image Reference Pack contained a manifest of third-party image URLs, not image files. They were *not* hot-linked or copied, because their licences are unknown. Product tiles use emoji placeholders. Add licensed or original photos to `public/images/`.
* **Team**: first names and photos only; titles are placeholders in `src/config/team.ts`.
* **Kinyarwanda**: navigation, footer, auth, marketplace and hero strings are provided but need native-speaker review. Other strings fall back to English.
* **Legal pages**: drafts; require legal review.
* **Contact/social**: set env vars; nothing is shown until they exist.

## Guided experience, imagery and visuals

* **Guided tour** (`/tour`, floating "Take the tour" button): 9 short stops, keyboard and mobile friendly. Copy lives in `src/config/tour.ts`.
* **Photos**: run `npm run images` once (downloads from `scripts/image-manifest.csv`, resizes, writes a manifest). Pages use a real photo when present, otherwise an original illustration (`media/Scenes`). Credits are shown on each photo. **Confirm licences before production use.**
* **New pages**: `/tour`, `/cooperatives`, `/exchange`, `/trust`, `/roadmap`.
* **Interactive**: farm-to-school journey, category preview, demand estimator, observed-vs-forecast chart with uncertainty band (sample data), evidence legend, notification centre, location picker (device position is only a suggestion; user must confirm).
* Docs: `docs/DESIGN_SYSTEM.md`, `docs/ROUTES.md`. CI: `.github/workflows/ci.yml`.

## Not included yet (known gaps)

Image upload, real-time messaging, notification preferences UI, two-factor flow, support tickets, i18n of workspace module pages, dropdown/popover/tabs/tooltip primitives, visual-regression and accessibility CI (add axe + Lighthouse CI), analytics (add consent-aware tooling, track searches/sign-ups/drop-off).

## Marketplace gallery (school) and listings (supplier)

* `/school/marketplace`: gallery of large product cards, nearest first. Hover (or focus, or touch) reveals an eye (details), a cart (add to basket) and an image icon (more photos). Filters are icons and live in the URL, so any filtered view is a shareable link; `matchLink()` in `features/marketplace/filters.ts` builds the link a "matching food" notification should open. The **Request** button opens the existing request form at `/school/requests/new`.
* `/supplier/products`: the same experience for the supplier's own listings, by status (Published, Draft, Unpublished). **Add listing** opens the existing listing form.
* Place shown on a card depends on the viewer (`src/lib/places.ts`): same village = distance only; same cell = village; same sector = cell/village; same district = sector/cell/village; same province or another province = district/sector/cell/village. Distance is a straight line between confirmed coordinates.
* Backend contracts still to confirm: `GET /school/marketplace` -> `{ items: MarketItem[]; place: Place }` (the school's confirmed registered location, never device GPS) and `GET /supplier/listings` -> `{ items: SupplierListing[] }`. Types: `src/features/marketplace/types.ts`. Without a backend, labelled sample data with real Rwanda place names is used.
