# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Express + Vite, NODE_ENV=development)
npm run build      # Build for production (Vite + esbuild)
npm run start      # Run production build
npm run check      # TypeScript type-check
npm run db:push    # Apply schema changes via drizzle-kit
```

No test runner is configured.

## Architecture

ResumeForge is a fullstack TypeScript app: a React/Vite SPA served by an Express backend, sharing types via the `shared/` directory.

### Request Flow

1. In dev, `server/index.ts` starts Express + Vite middleware together (single port)
2. All API routes are prefixed `/api/` and registered in `server/routes.ts`
3. Auth is handled via Replit Auth (OpenID Connect / Passport.js) in `server/replit_integrations/auth/`
4. PayPal payment routes live at `/paypal/*` (not `/api/`)

### Key Shared Boundary

`shared/schema.ts` is the single source of truth for:
- `ResumeData` — the unified resume data structure (Zod schema + TypeScript type) used by all templates, the builder form, and PDF generation
- All Drizzle ORM table definitions (`resumes`, `templates`, `payments`, `subscriptions`, `exports`)
- Auth models re-exported from `shared/models/auth.ts`

The `@shared/` path alias resolves to `shared/` from both client and server.

### Frontend

- Router: `wouter` (not React Router)
- Server state: TanStack Query via `client/src/lib/queryClient.ts`
- UI: shadcn/ui (Radix UI + Tailwind CSS)
- Pages in `client/src/pages/`, components in `client/src/components/`
- `@/` alias maps to `client/src/`

**Builder page** (`client/src/pages/builder.tsx`) is the core UI — a multi-step wizard with a live `ResumePreview` panel. Steps: template → profile → summary → experience → education → skills → projects → finalize → export.

**ResumePreview** (`client/src/components/resume/ResumePreview.tsx`) renders the visual resume using `TemplateInfo` (colors, font, layout) from `client/src/lib/templates.ts`. Templates control presentation only; data structure is always `ResumeData`.

### Backend

- `server/storage.ts` — `IStorage` interface + `DatabaseStorage` class; all DB operations go through here
- `server/pdf.ts` — PDFKit-based server-side PDF generation; watermark applied for free users
- `server/db.ts` — node-postgres `Pool` connection via `DATABASE_URL`

### Auth & Subscription Model

- Auth user ID comes from `req.user.claims.sub` (Replit OIDC)
- Subscription tiers: `free` (watermarked exports), `onetime` ($14.99, 5 clean PDF exports), `pro` ($9.99/mo, unlimited + DOCX)
- PayPal credentials are optional; payment features are disabled if `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` are absent

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Session encryption |
| `PAYPAL_CLIENT_ID` | No | PayPal payments |
| `PAYPAL_CLIENT_SECRET` | No | PayPal payments |
| `ISSUER_URL` | No | OIDC issuer (defaults to Replit) |
| `REPL_ID` | No | Replit environment ID |

### Document Types: Resume vs CV

The app supports two document types controlled by `resumeData.documentType: "resume" | "cv"`.

- **Resume routes**: `/builder`, `/builder/new`, `/builder/:id`
- **CV routes**: `/cv-builder`, `/cv-builder/new`, `/cv-builder/:id`

Both routes render the same `BuilderPage` component. The component detects mode via `useLocation().startsWith("/cv-builder")` and switches wizard steps, form labels, finalize checks, and export labeling accordingly.

CV-specific wizard steps (in order): template → profile → summary → research → teaching → publications → presentations → grants → education → skills → awards → languages → references → finalize → export.

CV-specific data fields in `resumeData` (all default to `[]`): `publications`, `research`, `teaching`, `presentations`, `grants`, `references`. These are stored in the same `resumes.resume_data` JSONB column — no separate table or migration needed.

`sampleCVData` provides pre-filled CV sample content (academic persona) exported from `shared/schema.ts`.

Both `ResumePreview` and `server/pdf.ts` gate CV-only sections behind `isCV = data.documentType === "cv"` checks.

### Template System

Currently only one template is active: `classic-one`. Template definitions live in `client/src/lib/templates.ts` (frontend metadata) and are seeded into the DB via `storage.seedTemplates()` on server startup. Adding a new template requires updating both the frontend `allTemplates` array and the seed data.
