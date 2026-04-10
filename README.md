# Flood Hardest Mapas List

Community-ranked hardest FE2CM and TRIA.os maps.

This repository contains a production-style Next.js app inspired by the competitive-list workflow of sites like Pointercrate, but with entirely original branding, placeholder content, and an original scoring system tailored to fictional Roblox Flood Escape 2 Community Maps and TRIA.os entries.

## Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS
- Auth.js / NextAuth credentials auth
- Prisma ORM
- PostgreSQL
- Zod validation
- Server Actions for submissions and moderation

## What is included

- Home page with stats, featured maps, announcements, and recent changes
- Main rankings with combined, FE2-only, and TRIA-only views
- Map detail pages with record tables and placement history
- Legacy archive
- Player leaderboard and player profile pages
- Rules and submission guidelines
- Authenticated record and map submission forms
- Moderator/admin dashboard for reviewing pending records and maps
- Historical snapshot archive
- Prisma schema for users, maps, submissions, accepted records, snapshots, audit data, and tags
- Seed script with 20 FE2 maps, 20 TRIA maps, 15 players, accepted records, pending submissions, and legacy entries

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and update it for your PostgreSQL instance:

```bash
cp .env.example .env
```

3. Generate the Prisma client and create the schema:

```bash
npm run prisma:generate
npm run prisma:push
```

4. Seed the database:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

## Demo credentials

When the database is seeded, all demo users use:

- Password: `demo-pass-123`

Example sign-ins:

- `admin@fhml.local`
- `moderator@fhml.local`
- `user@fhml.local`

If no database is configured, the app still renders with built-in fallback mock data and the same credentials work through the in-memory demo auth path.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run db:seed
```

## Scoring model

The scoring formula is intentionally original and configurable in [`src/lib/scoring.ts`](/d:/GitHub/Repositories/FE2HML/src/lib/scoring.ts). It weights:

- Higher placements more heavily
- Completion records above partial records
- Difficulty score as a multiplier
- Team maps with a small adjustment so team clears do not dominate solo clears by default

Accepted record points are stored on each record and aggregated into `PlayerProfile.totalPoints`.

## Important assumptions

- Authentication uses credentials auth for simplicity and easy local testing.
- Proof URLs can be restricted with `ALLOWED_PROOF_DOMAINS`.
- Submission rate limiting is enforced server-side with recent database submission counts.
- The moderation dashboard currently focuses on reviewing pending records and map submissions. The schema supports broader audit and snapshot workflows for future expansion.
- Uploaded assets are represented as URLs and metadata hooks rather than a full UploadThing or S3 integration in this initial pass.

## Verification

The current codebase passes:

- `npm run lint`
- `npm run build`
