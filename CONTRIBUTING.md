# Contributing

1. Branch from `main`; keep commits small with meaningful messages.
2. Before opening a PR run: `npm run typecheck && npm run lint && npm test && npm run build`.
3. Rules that must not be broken:
   - **Never** add purchase controls to anything under `(public)`.
   - **Never** treat frontend checks as security. Every protected action needs a backend check.
   - **Never** present sample data as real. Keep the `Sample data` badge and `isSample` flag.
   - Do not invent contact details, partners, customer numbers, coverage or impact figures.
   - New features declare an honest status (`available`, `in-development`, `planned`, `agreement`).
4. New strings go in `src/i18n/en.json` and `rw.json`.
5. UI must work by keyboard, at 320px width, and with reduced motion. Target WCAG 2.2 AA.
