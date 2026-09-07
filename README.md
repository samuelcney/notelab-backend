# NoteLab — Backend

REST API for NoteLab, a platform for online music courses. Built with
[NestJS](https://nestjs.com/) 11, [Prisma](https://www.prisma.io/) 7 and
PostgreSQL.

## Stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | NestJS 11 (Express)                       |
| ORM            | Prisma 7 (`@prisma/adapter-pg`)           |
| Database       | PostgreSQL 16                             |
| Auth           | JWT (`@nestjs/jwt`), bcrypt password hash |
| Validation     | Zod via `nestjs-zod`                      |
| File storage   | Supabase Storage (course covers, avatars) |
| Transactional  | Resend (password-recovery e-mail)         |

## Requirements

- Node.js 20+
- Docker (for the local PostgreSQL instance)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env        # then edit as needed

# 3. Start PostgreSQL
docker compose up -d postgres

# 4. Apply migrations and generate the Prisma client
npm run prisma:migrate      # dev migrations (creates/updates the schema)
npm run prisma:generate

# 5. Seed the database (see below)
npm run prisma:seed
```

## Running

```bash
npm run dev          # watch mode
npm run start        # single run
npm run start:prod   # from the compiled dist/ output
```

The API listens on `http://localhost:${PORT:-5000}` and every route is prefixed
with `/v1`.

## Database seed

`npm run prisma:seed` runs `prisma/seed.ts`. It is idempotent: it wipes the
domain tables and recreates a predictable data set (categories, instructors,
students, courses with modules/lessons, and a few enrollments).

It also runs automatically after `npm run db:reset`
(`prisma migrate reset`), via the `migrations.seed` entry in `prisma.config.ts`.

### Default login

| Field    | Value               |
| -------- | ------------------- |
| E-mail   | `notelab@gmail.com` |
| Password | `12345678`          |
| Role     | `ADMIN`             |

Other seeded accounts (all with password `12345678`):

- `instrutor@notelab.com`, `carlos@notelab.com` — `INSTRUCTOR`
- `aluno@notelab.com`, `maria@notelab.com` — `STUDENT`

## Useful scripts

| Script                    | Description                                  |
| ------------------------- | ------------------------------------------- |
| `npm run build`           | Compile to `dist/`                          |
| `npm run lint`            | ESLint (flat config, `eslint.config.mjs`)   |
| `npm run format`          | Prettier                                    |
| `npm run prisma:migrate`  | `prisma migrate dev`                        |
| `npm run prisma:generate` | Regenerate the Prisma client               |
| `npm run prisma:seed`     | Seed the database                           |
| `npm run db:reset`        | Drop, re-migrate and re-seed the database   |

## Project layout

```
src/
  controllers/   HTTP layer (routing, request/response)
  services/      business logic
  repositories/  Prisma data access
  modules/       Nest module wiring
  common/        guards, DTOs, Zod schemas
  db/            Prisma service + Supabase client
  utils/         helpers (tokens, dates, e-mail templates)
prisma/
  schema.prisma  data model
  migrations/    SQL migration history
  seed.ts        development seed
```
