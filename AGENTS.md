# AGENTS.md

This file provides guidance to AI coding agents (Claude, Gemini, Codex, etc.) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Hot reload with NODE_ENV=dev (uses MongoDB)
npm run start:mock      # Mock mode with NODE_ENV=mock (uses in-memory fake DB)

# Build
npm run build           # Compile TypeScript

# Testing
npm test                # Unit tests with coverage (jest.json config)
npm run test:watch      # Unit tests in watch mode
npm run test:e2e        # E2E tests (jest-e2e.json config)

# Run a single test file
npx jest path/to/file.spec.ts

# Linting
npm run lint            # Check
npm run lint:fix        # Auto-fix
```

## Architecture

The project follows a strict 3-layer clean architecture:

```
Presentation (GraphQL Resolvers)  →  src/presentation/
Business Logic (Usecases)         →  src/usecase/
Data Access (Services)            →  src/service/db/
```

### Dependency Injection

Rather than standard NestJS DI, the project uses a **custom Inversify container** (`src/inversify/investify.ts`). All services and usecases are manually instantiated there. Each feature module receives the `Inversify` singleton via `{ useValue: inversify, provide: 'Inversify' }` and resolvers inject it with `@Inject('Inversify')`.

To add a new usecase: instantiate it in `investify.ts` and expose it as a property on the `Inversify` class.

### Environment-Aware Database

The `Inversify` constructor selects the DB implementation based on `NODE_ENV`:
- `prod` / `dev` → `BddServiceMongo` (real MongoDB via native driver)
- `mock` / `test` → `BddServiceFake` (in-memory, hardcoded data in `src/service/db/fake/`)

`BddServiceMongo` is built via **mixin composition** (`applyInstanceMixins`) combining multiple partial service classes (one per domain).

### Adding a Feature

1. Define the DB interface method in `src/service/db/db.service.ts`
2. Implement it in the relevant `src/service/db/mongo/db.service.*.mongo.ts` and in the fake (`src/service/db/fake/`)
3. Create a usecase in `src/usecase/<domain>/`
4. Register the usecase in `src/inversify/investify.ts`
5. Add GraphQL resolver/DTO in `src/presentation/<domain>/`

### External Dependency

`@happykiller/sunny-apis` provides Auth, User, Passkey, and System modules. These are imported directly into `AppModule` and their services are wired in `Inversify`.

### Path Aliases

TypeScript path aliases defined in `tsconfig.json`:
- `@src/*` → `src/*`
- `@presentation/*` → `src/presentation/*`
- `@usecase/*` → `src/usecase/*`
- `@service/*` → `src/service/*`

### Testing

- Unit tests use `jest-mock-extended` to mock the `Inversify` container
- E2E tests spin up the full NestJS app with `NODE_ENV=mock` (fake DB) and a signed JWT
- Test files: `*.spec.ts` (unit), `*.e2e-spec.ts` (E2E)
