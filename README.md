# Flood Hardest Mapas List

Community-ranked hardest FE2CM and TRIA.os maps.

This repository contains a production-ready Next.js application for managing a competitive Roblox map list with stable map IDs, moderator workflows, score tracking, and empty-first launch behavior. The roster starts blank on purpose so staff can publish the first maps directly from the admin panel instead of shipping fake starter entries.

## Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS
- Auth.js / NextAuth credentials auth
- Prisma ORM
- PostgreSQL
- Zod validation
- Server Actions for submissions and moderation
- GitHub Actions + Vercel deployment workflow

## Product behavior

- Maps have stable public IDs such as `FE2-0001` and `TRIA-0001`
- Map detail pages load by map ID: `/maps/FE2-0001`
- Difficulty values are constrained to `6.00` through `9.99`
- Difficulty bands are:
- `6.xx` = `Crazy+`
- `7.xx` = `Extreme`
- `8.xx` = `Legendary`
- `9.xx` = `Cataclysmic`
- The initial production seed creates staff accounts and an empty roster
- Moderators and admins can add, edit, publish, legacy, and remove maps from `/admin/maps`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in the required values in `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fhml?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
ALLOWED_PROOF_DOMAINS="youtube.com,youtu.be,twitch.tv,streamable.com,medal.tv"
SEED_ADMIN_EMAIL="admin@fhml.local"
SEED_ADMIN_PASSWORD="change-me-before-production"
SEED_MODERATOR_EMAIL="moderator@fhml.local"
SEED_MODERATOR_PASSWORD="change-me-before-production"
```

4. Generate Prisma and apply the initial migration:

```bash
npm run prisma:generate
npm run prisma:deploy
```

For local development on a fresh database, `npm run prisma:push` also works.

5. Seed staff accounts and the empty launch announcement:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

## Seeded staff accounts

The seed script creates:

- one `ADMIN` account using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
- one `MODERATOR` account using `SEED_MODERATOR_EMAIL` / `SEED_MODERATOR_PASSWORD`

No maps, records, snapshots, or player standings are seeded by default.

## Important routes

- `/rankings` for the active list
- `/legacy` for legacy entries
- `/maps/[mapId]` for map detail pages
- `/players` for the score leaderboard
- `/submit-record` for record submissions
- `/submit-map` for community map proposals
- `/admin/maps` for direct staff map management
- `/admin/records` for record moderation

## Deployment workflow

The production deployment workflow lives at [.github/workflows/deploy.yml](/d:/GitHub/Repositories/FE2HML/.github/workflows/deploy.yml) and targets Vercel on pushes to `main`.

It runs:

1. `npm ci`
2. `npm run prisma:generate`
3. `npm run prisma:deploy`
4. `npm run lint`
5. `npm run build`
6. `vercel pull`
7. `vercel build --prod`
8. `vercel deploy --prebuilt --prod`

### Required GitHub secrets

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ALLOWED_PROOF_DOMAINS`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:push
npm run db:seed
```

## Verification

The current codebase passes:

- `npm run lint`
- `npm run build`
