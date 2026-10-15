# Miveloo design system

**Tokens** live in `tailwind.config.ts` and `src/app/globals.css`.

| Token | Value | Use |
|---|---|---|
| green | #138D3B | growth, success, supplier |
| teal | #00645F | primary actions, headings |
| gold | #F5A900 | highlight, calls to action |
| red | #E94532 | errors, danger (never colour alone) |
| cream | #FFF8E8 | page background |
| Display font | Fraunces Variable | headings (`font-display`) |
| Body font | Plus Jakarta Sans Variable | UI text |
| `text-fluid-hero` / `text-fluid-h2` | clamp() | responsive headings |

**One canonical component per job**

| Job | Component |
|---|---|
| Button / link-button | `ui/button` |
| Status (live, in development, planned, agreement) | `ui/badge` StatusBadge |
| Sample-data marker | `ui/badge` SampleBadge |
| Section / page headings | `layout/SectionHeading`, `layout/PageHeader` |
| Photo with illustration fallback | `media/Photo` + `media/Scenes` |
| Scroll reveal | `ui/reveal` |
| Forecast vs observed chart | `features/analytics/PriceForecastChart` |
| Evidence types legend | `features/analytics/EvidenceLegend` |
| Locked / not-yet-live capability | `feedback/LockedFeature` |
| Form field with error | `forms/FormField` |
| Confirm destructive action | `ui/confirm-dialog` |
| Founder-guided tour | `features/tour/*` |

Rules: status is never colour alone (symbol + label); touch targets are at least 44px; motion respects `prefers-reduced-motion`; charts have a text or table alternative.
