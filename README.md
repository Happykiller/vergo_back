# Vergo Back

**Vergo Back** is the backend API for the Vergo service — a fitness coaching platform with guided workouts, exercise tracking, session statistics, and gamification features.
It is built with [NestJS](https://nestjs.com/) in **TypeScript**, following a **clean 3-layer architecture** to ensure maintainability, scalability, and testability.

---

## 🚀 Features

- **Clean architecture** (presentation/usecase/service layers)
- **GraphQL API** (Apollo) and WebSocket support
- **Authentication & Authorization** (JWT, role-based access control)
- **Gamification** (XP, levels, leagues)
- **Workout & Exercise management**
- **Session tracking & statistics**
- **Image handling** via Sharp
- **Secure storage** of sensitive data
- **Logging** with Winston + daily rotate
- **Rate limiting & throttling**
- **E2E & Unit testing** with Jest

---

## 📂 Project Structure

```text
src/
  presentation/   # Controllers / GraphQL resolvers (input/output models)
  usecase/        # Application services & domain use cases
  service/        # Adapters (DB, external APIs, etc.)
  inversify/      # Dependency injection configuration
  cli/            # Command-line tools (e.g., seeders)
```

**Configuration paths** (from `tsconfig.json`):

- `@src/*` → `src/*`
- `@presentation/*` → `src/presentation/*`
- `@usecase/*` → `src/usecase/*`
- `@service/*` → `src/service/*`

---

## 🛠️ Requirements

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** >= 6 (for persistence)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Happykiller/vergo_back.git
cd vergo_back

# Install dependencies
npm install
```

---

## ⚡ Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Start the API in mock mode (no MongoDB required)
npm run start:mock
```

Then open GraphQL Playground at `http://localhost:3000/graphql`.

---

## ⚙️ Configuration

The app loads environment variables from `.env`, then overrides them with `.env.local` when present.

Create a `.env` file at the root (you can also use `.env.local`):

```env
NODE_ENV=dev
APP_PORT=3000
DB_CONN_STRING=mongodb://localhost:27017/
DB_NAME=vergo
JWT_SECRET=change_me
```

---

## ▶️ Running the Application

```bash
# Development
npm run start:dev

# Watch mode (mocked data)
npm run start:mock

# Production build
npm run build
npm run start:prod
```

You can also run in Docker:

```bash
docker-compose up --build
```

---

## 🧪 Testing

We use **Jest** for unit and e2e tests.

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# End-to-end tests
npm run test:e2e
```

Test configurations:

- `jest.json` → Unit tests (`*.spec.ts`)
- `jest-e2e.json` → E2E tests (`*.e2e-spec.ts`)

---

## 📜 Scripts

From `package.json`:

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `start:dev`         | Run app in dev mode with live reload     |
| `start:mock`        | Run app with mocked data                 |
| `start:prod`        | Run built app in production              |
| `build`             | Compile TypeScript to JavaScript         |
| `lint` / `lint:fix` | Check / fix lint issues                  |
| `test`              | Run unit tests with coverage             |
| `test:e2e`          | Run end-to-end tests                     |
| `seed:stats`        | Seed database with sample training stats |

---

## 🛠️ CLI Tools

The project provides CLI scripts for administrative or data-seeding tasks.  
They are located under `src/cli/` and can be run via `ts-node` or npm scripts.

### Seed Training Stats

The `seed-stats` command seeds training statistics for a given user.

**Usage:**

```bash
# Using npm script
npm run seed:stats -- <USER_ID>

# Directly via ts-node
npx ts-node -r tsconfig-paths/register src/cli/seed-stats.ts <USER_ID>
```

**Example:**

```bash
npm run seed:stats -- 64c5cce2a3c71234abcd5678
```

**Notes:**

- `<USER_ID>` is **mandatory**. The script will exit with an error if omitted.
- The script logs the current environment from `config.env.mode`.
- It initializes the NestJS application context to access services and dependencies via **Inversify**.
- Data is seeded via `StatsSeeder` in `src/seeds/stats.seeder.ts`.
- The CLI automatically closes the application context after execution.

---

## Troubleshooting

- **MongoDB connection error**: use `npm run start:mock` to run without MongoDB, or verify `DB_CONN_STRING` / `DB_NAME`.
- **GraphQL not reachable**: confirm the app is running and test `http://localhost:3000/graphql`.
- **Wrong environment behavior**: check `NODE_ENV` (`dev`, `mock`, `test`, `prod`) in your shell or `.env` files.

---

## 🏗️ Architecture Principles

- **Ports & Adapters**: Business logic (`usecase/`) is framework-agnostic.
- **Dependency Injection**: Managed by `Inversify`.
- **DTO Validation**: Using `class-validator` / `class-transformer`.
- **Error Handling**: Domain errors mapped to HTTP/GraphQL errors.
- **Observability**: Structured logging & future-ready for metrics/tracing.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Fabrice Rosito**
📧 [fabrice.rosito@gmail.com](mailto:fabrice.rosito@gmail.com)
