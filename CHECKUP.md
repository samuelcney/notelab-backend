# NoteLab — Checkup & Limpeza (Backend)

Data: 2026-09-07 · Escopo: **backend** (seed + limpeza segura + remoção do Supabase).
O frontend foi tratado em paralelo por outra sessão (deps, lint, remoção do Supabase no front).

---

## 1. Seed — `prisma/seed.ts`

Script idempotente (limpa as tabelas de domínio e recria). Popula:

- 10 categorias (as mesmas do mapa de cores do front)
- 5 usuários, 4 cursos com 8 módulos e 16 aulas, 3 matrículas
- cada usuário nasce com `cart` e `userBio` (igual ao fluxo real de `createUser`)
- senha com **bcrypt, 10 rounds** — idêntico ao `AuthService`

Ligado ao `prisma.config.ts` (`migrations.seed`), então roda também no `prisma migrate reset`.

**Scripts novos:** `npm run prisma:seed` · `npm run db:reset`

### Login padrão

| Campo | Valor |
| ----- | ----- |
| E-mail | `notelab@gmail.com` |
| Senha | `12345678` |
| Role | `ADMIN` |

Outras contas (senha `12345678`): `instrutor@notelab.com`, `carlos@notelab.com`
(INSTRUCTOR); `aluno@notelab.com`, `maria@notelab.com` (STUDENT).

**Verificado end-to-end com a app rodando:**

```
POST /v1/auth/login  {notelab@gmail.com / 12345678}          → 200 + JWT
POST /v1/auth/login  {senha errada}                          → 401
GET  /v1/courses     (com Bearer token)                      → 200
GET  /v1/users/info/me                                       → 200 (admin + bio)
GET  /uploads/<arquivo>                                      → 200 (storage local)
```

O JWT emitido tem payload **flat** `{ sub, email, role, iat, exp }` — importante pro
middleware do frontend (ver F1).

---

## 2. Remoção do Supabase (a pedido do samuel)

Substituído por **storage em disco local**.

| Antes | Depois |
| ----- | ------ |
| `src/db/supabase.ts` + `src/services/supabase-s3.service.ts` (`SupabaseStorageService`, bucket `notelab-medias`) | `src/services/storage.service.ts` (`StorageService`) — grava em `uploads/`, serve via `app.useStaticAssets('/uploads/')` |
| URLs públicas do Supabase Storage | `${API_PUBLIC_URL}/uploads/<path>` (fallback `http://localhost:${PORT}`) |
| envs `SUPABASE_URL/KEY/SERVICE_ROLE_KEY` | removidas de `env.d.ts` / `.env` / `.env.example` |
| dep `@supabase/supabase-js` | removida do `package.json` (feito pela outra sessão) |

**Assinaturas mantidas** (`uploadAvatar`, `uploadCourseCover`, `uploadRequestDocument`,
`uploadLessonVideo`, `getFileUrl`, `getFilesUrl`), então os consumidores
(`users.service`, `approve-request.service`, `course.controller` + os 3 módulos)
só mudaram o nome do provider. Comportamento do avatar (apaga a pasta antiga antes
de gravar) preservado. Testado: upload grava em disco e a URL abre pelo `/uploads/`.

`.gitignore`: `uploads/*` ignorado, `uploads/.gitkeep` versionado.

---

## 3. Config / limpeza

| Item | Antes | Depois |
| ---- | ----- | ------ |
| ESLint | `.eslintrc.json` com preset **`airbnb` + React** (copiado do front); não rodava no ESLint 10 | `eslint.config.mjs` flat (`typescript-eslint`, Node). `npm run lint` volta a funcionar; **0 erros** |
| Line endings | 18 arquivos em `src/` com CRLF misturado | LF + `.gitattributes` (`* text=auto eol=lf`). Diff verificado como whitespace-only |
| `src/@types/env.d.ts` | faltavam `PORT`, `NODE_ENV`, `RESEND_API_KEY`; tinha `SUPABASE_*` | atualizado (+ `FRONTEND_URL`, `API_PUBLIC_URL`; sem Supabase) |
| `src/main.ts` | CORS `origin` fixo; `bootstrap()` solto | `origin` via `FRONTEND_URL`; `void bootstrap()`; `useStaticAssets` |
| `src/config/resend-config.ts` | `new Resend(process.env.RESEND_API_KEY)` no **load do módulo** → app quebrava no boot sem a chave (o bump do `resend` da outra sessão passou a lançar no construtor) | `getResend()` lazy — só cria o client no primeiro envio |
| `.env` (local) | **sem `JWT_SECRET`** → login dava 500 "Configuração JWT_SECRET ausente" | adicionado `JWT_SECRET` de dev + `FRONTEND_URL`/`API_PUBLIC_URL`; removido Supabase |
| `.env.example` | não existia | criado, com todas as chaves em uso |
| `README.md` | boilerplate do starter do NestJS | README real (setup, docker, migrate, seed, scripts, layout) |
| `.gitignore` | **`prisma/migrations/` ignorado** — histórico de schema fora do git | removido do ignore (migrations passam a ser versionadas — `git add prisma/migrations/` no primeiro commit) |
| Lint fixes pequenos | `catch (error: any)` + `error.message`; `catch (error)` não usado; `updateData: any` | `error instanceof Error ? …`; `catch {}`; `Prisma.CourseUpdateInput`. Sem mudança de comportamento |

**Estado final:** `tsc --noEmit` ✅ · `lint` ✅ (0 erros) · `build` ✅ · `seed` ✅ · boot + auth + storage ✅

> `package.json` / `package-lock.json` / `jest.config.ts` também aparecem modificados —
> isso é da outra sessão (update de deps + clean install + `allowScripts`), não deste trabalho.

---

## 4. Pendências no backend (não corrigidas — precisam de decisão)

| # | Onde | Problema | Sugestão |
| - | ---- | -------- | -------- |
| B1 | `src/controllers/*.controller.ts` | Vários `try { return this.service.x() } catch` **sem `await`** — a promise rejeitada escapa do `catch`. Alguns blocos capturam `NotFoundException`/`BadRequestException` e relançam `InternalServerErrorException`, mascarando o 404/400 real | `return await …` + exception filter global; ou remover os `try/catch` redundantes |
| B2 | `jest.config.ts` + `package.json` + `Dockerfile.test` | Config de teste duplicada (`jest` no `package.json` **e** `jest.config.ts`); `roots`/`testMatch` apontam para `test/` e `*.spec.ts` **inexistentes**; `test:e2e` → `./test/jest-e2e.json` inexistente; `Dockerfile.test` chama `yarn` num projeto npm | Decidir se vai ter teste; se não, remover o scaffolding |
| B3 | build output | `nest build` emite em `dist/src/main.js`, mas `start:prod` é `node dist/main` — **caminho errado** | ajustar `start:prod` para `node dist/src/main` (ou setar `rootDir` no tsconfig) |
| B4 | `RESEND_API_KEY` | valor placeholder (`"kkkkkkk"`) — envio de e-mail de recuperação não funciona de verdade | configurar quando for testar o fluxo de senha |
| B5 | `src/controllers/auth.controller.ts` etc. | Auth guard lê `Bearer` e assina com `JWT_SECRET` (dev: `dev-local-secret-change-me`) — precisa bater com o segredo do frontend | alinhar `.env` dos dois lados |
| B6 | `tsconfig.json` | `target: ES2021` (sem `Error` com `cause`; regra `preserve-caught-error` do ESLint desligada) | considerar bump para `ES2022` num passo separado |

---

## 5. Frontend — observações (corrigido/em curso pela outra sessão)

| # | Onde | Problema |
| - | ---- | -------- |
| F1 | `src/middleware.ts` | **Bug de auth.** Verificava o JWT com `NEXT_PUBLIC_SUPABASE_JWT_SECRET` e lia `payload.app_metadata.role`; o backend assina com `JWT_SECRET` (dev `dev-local-secret-change-me`) e payload flat `{ sub, email, role }`. Sobra da auth antiga via Supabase |
| F2 | raiz | Dois lockfiles versionados (`package-lock.json` + `yarn.lock`) — padronizar em npm |
| F3 | raiz | Sem `.env`/`.env.example` — `NEXT_PUBLIC_API_URL` e o segredo do JWT não documentados |
| F4 | `src/lib/supabase.ts` | Código morto + deps `@supabase/*` (removido pela outra sessão) |
| F5 | `package.json` | `jsonwebtoken` nas deps mas sem uso (e é lib Node) |
| F6 | `package.json` | `"lint": "next lint"` — removido no Next 16 |

---

## 6. Rodar o ambiente

```bash
cd notelab-backend
cp .env.example .env          # ajuste JWT_SECRET (mesmo valor no frontend)
docker compose up -d postgres
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev                    # API em http://localhost:5000/v1

# login: notelab@gmail.com / 12345678
```
