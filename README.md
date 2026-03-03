# ResumeForge

ResumeForge is a web-based resume builder that helps users create professional resumes quickly. The app uses a guided builder, real-time preview, and PDF export.

## Tech Stack
- React + TypeScript + Vite (client)
- Express + TypeScript (server)
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui

## Project Structure
- client/ — frontend (Vite)
- server/ — backend (Express)
- shared/ — shared schema and types
- script/ — build scripts

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a .env file (or set env vars):
   - DATABASE_URL
   - SESSION_SECRET
   - PAYPAL_CLIENT_ID (optional)
   - PAYPAL_CLIENT_SECRET (optional)
   - ISSUER_URL (optional)
   - REPL_ID (optional)
3. Push DB schema:
   ```bash
   npm run db:push
   ```

## Development
Start the app in dev mode:
```bash
npm run dev
```

## Notes
- The template list has been simplified to a single template (Classic One).
- Payments are optional; if PayPal keys are missing, payment features are disabled.
