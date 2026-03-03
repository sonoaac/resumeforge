# ResumeForge - Professional Resume Builder

## Overview

ResumeForge is a web-based resume builder application that helps job seekers create professional resumes quickly. The application follows a freemium business model where users can create resumes for free with basic templates, but need to pay for premium features like watermark-free exports and premium templates.

The core product flow is:
1. User selects a template
2. User fills in resume sections via a guided wizard
3. User previews their resume in real-time
4. User exports to PDF (with watermark for free users) or upgrades for clean exports

Target revenue model: Free tier with watermarked PDF exports, one-time purchase ($14.99) for clean exports, and Pro subscription for full access including DOCX exports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, bundled with Vite
- Uses wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and API caching
- Framer Motion for animations
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens defined in CSS variables

**Key Frontend Patterns**:
- Pages are located in `client/src/pages/`
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- Shared utilities and configurations in `client/src/lib/`
- Path aliases configured: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture

**Framework**: Express.js with TypeScript
- Single entry point at `server/index.ts`
- Routes registered in `server/routes.ts`
- Database operations abstracted through `server/storage.ts`
- PDF generation handled in `server/pdf.ts` using PDFKit
- Static file serving configured in `server/static.ts`
- Vite dev server integration in `server/vite.ts` for development

**API Structure**:
- All API routes prefixed with `/api/`
- RESTful patterns for CRUD operations on resumes and templates
- Authentication routes handled separately via Replit Auth integration

### Data Layer

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Migrations output to `./migrations/`
- Database connection managed in `server/db.ts` using node-postgres Pool
- Authentication tables (users, sessions) defined in `shared/models/auth.ts`

**Resume Data Structure**: A single unified schema used across all templates containing:
- Profile (contact info, links)
- Summary
- Experience (array of positions)
- Education (array of entries)
- Skills (array with categories)
- Projects (array)
- Optional sections (certifications, awards, languages, references)

### Authentication

**Provider**: Replit Auth (OpenID Connect)
- Session management using express-session with connect-pg-simple for PostgreSQL storage
- Passport.js for authentication strategy
- Auth-related code isolated in `server/replit_integrations/auth/`
- User state managed via `useAuth` hook on frontend

### Template System

Templates control visual presentation only, not data structure. Each template defines:
- Font family and sizes
- Colors and accent colors
- Layout (single or two-column)
- Section ordering and styling

Templates are categorized as free (20) or premium (40), with only 12-18 premium templates released for beta.

## External Dependencies

### Payment Processing
- **PayPal SDK** (`@paypal/paypal-server-sdk`): Handles payments for premium features
- PayPal routes at `/paypal/order` and `/paypal/order/:orderID/capture`
- Client-side PayPal button component at `client/src/components/PayPalButton.tsx`
- Credentials via `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` environment variables

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage in PostgreSQL

### PDF Generation
- **PDFKit**: Server-side PDF generation for resume exports
- Watermark applied for free users, removed for paid users

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `PAYPAL_CLIENT_ID`: PayPal API client ID (optional, payments disabled if missing)
- `PAYPAL_CLIENT_SECRET`: PayPal API secret (optional)
- `ISSUER_URL`: OpenID Connect issuer (defaults to Replit)
- `REPL_ID`: Replit environment identifier

### Build and Development
- Development: `npm run dev` (runs tsx with NODE_ENV=development)
- Production build: `npm run build` (builds client with Vite, bundles server with esbuild)
- Database push: `npm run db:push` (applies schema changes via drizzle-kit)