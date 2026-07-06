---
name: verify
description: How to build, launch, and drive Aksorn (Next.js web app) for runtime verification.
---

# Verifying Aksorn changes

## Launch

```bash
npm run dev -- --port 3457   # Turbopack dev server; ready in ~2s
```

Run it in the background. **Gotcha:** `npm run build` and the dev server
share `.next/` — running a production build while the dev server is up
corrupts its artifacts (ENOENT `_buildManifest.js.tmp.*` spam, pages stop
rendering). Build first, or kill and restart the dev server after.

**Gotcha (Windows):** stopping the npm task
leaves the node child holding the port — kill the listener explicitly:

```powershell
Get-NetTCPConnection -LocalPort 3457 -State Listen |
  Select-Object -Expand OwningProcess -Unique | % { Stop-Process -Id $_ -Force }
```

## Drive (browser surface)

No Playwright/puppeteer in the repo. Install `puppeteer-core` in the
scratchpad and point it at system Edge —
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`
(forward slashes; backslashes get mangled through bash `node -e`).
Chrome is not installed.

- Header logged-out: "Log in" + "Sign up" buttons. Logged-in:
  "Account" + "Sign out". Good assertions for auth state.
- Use a fresh `browser.createBrowserContext()` per auth scenario.

## Test accounts (Supabase)

`.env.local` has `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
Create a confirmed user via the admin REST API
(`POST {url}/auth/v1/admin/users` with `email_confirm: true`, headers
`apikey` + `Authorization: Bearer` = service key), and **delete it after**
(`DELETE /auth/v1/admin/users/{id}`). Use an obviously-fake
`@example.com` address.

## Flows worth driving

- Login: `/login` email/password → should land on `/reading`, header
  flips, session survives a hard reload.
- OAuth return: `/login?code=...` triggers a PKCE token exchange
  (watch for `POST {supabase}/auth/v1/token?grant_type=pkce`); a fake
  code 404s harmlessly. The PKCE verifier is only stored after clicking
  "Continue with Google" in the same context — click it first (intercept
  + abort the `/auth/v1/authorize` navigation to avoid leaving for Google).
- Lessons: `/reading` → click a lesson node → `/lesson/{id}`.

## Known noise (pre-existing, not findings)

- Base UI console error on every page: "expected a native <button>…"
  from shadcn Button `render={<Link/>}` usage; shows as dev-overlay
  "Issues" badge in screenshots.
- TS deprecation hints on `FormEvent` imports.
