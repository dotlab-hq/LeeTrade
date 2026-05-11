# Backend

Role-based backend built with **Bun + OpenAPIHono + Better Auth + Drizzle + SQLite + Dockerode**.

## Scripts

```bash
bun install
bun run dev
bun run typecheck
bun run db:push
```

## API

### Auth
- Better Auth endpoints mounted at `POST /api/auth/*`
- `GET /api/v1/auth/me` (Bearer token required)

### Admin (admin role required)
- `GET /api/v1/admin/users?page=1&pageSize=20`
- `PUT /api/v1/admin/users/:userId/role`
- `GET /api/v1/admin/containers?all=true`

### OpenAPI docs
- `GET /docs`

## Architecture

```
src/
  app.ts
  bootstrap.ts
  config/
  controllers/
  db/
  middlewares/
  models/
  repositories/
  routes/
  services/
  types/
  utils/
```
