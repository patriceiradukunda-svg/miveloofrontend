# Route map and access matrix

Access is enforced by `src/lib/guard.ts` (server render) and must be re-enforced by the backend on every API call.

| Area | Paths | Who |
|---|---|---|
| Public | `/`, `/tour`, `/sell`, `/marketplace`, `/marketplace/[id]`, `/suppliers`, `/schools`, `/cooperatives`, `/exchange`, `/institutions`, `/ai-intelligence`, `/pricing`, `/trust`, `/roadmap`, `/about/*`, `/impact`, `/contact`, `/faq`, `/help`, `/insights`, legal pages | Anyone (no purchase controls) |
| Auth | `/login`, `/register/*`, `/forgot-password`, `/reset-password`, `/verify-account`, `/resend-verification`, `/accept-invitation`, `/complete-profile`, `/two-factor`, `/access-denied`, `/session-expired` | Anyone |
| Shared workspace | `/app/*` | Any signed-in user |
| School | `/school/*` | School role. Purchasing pages also need `verification = verified` |
| Supplier | `/supplier/*` | Individual supplier |
| Cooperative | `/group/*` | Cooperative / group |
| Institution | `/institution/*` | Institutional partner (agreement) |
| Admin | `/admin/*` | Miveloo staff only |

Permission keys: `src/config/permissions.ts`. Order transitions per role: `src/features/orders/types.ts`.
