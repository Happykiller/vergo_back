# Vergo Back

**Vergo Back** is the backend API for the Vergo service — a fitness coaching platform with guided workouts, exercise tracking, session statistics, and gamification features.  
It is built with [NestJS](https://nestjs.com/) in **TypeScript**, following a **hexagonal architecture** to ensure maintainability, scalability, and testability.

---

## 🚀 Features

- **Hexagonal architecture** separating domain logic from infrastructure
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

```

src/
presentation/   # Controllers / GraphQL resolvers (input/output models)
usecase/        # Application services & domain use cases
service/        # Adapters (DB, external APIs, etc.)
inversify/      # Dependency injection configuration
cli/            # Command-line tools (e.g., seeders)

````

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
git clone https://github.com/your-org/vergo_back.git
cd vergo_back

# Install dependencies
npm install
````

---

## ⚙️ Configuration

Create an `.env` file at the root based on `.env.example`:

```env
NODE_ENV=dev
PORT=3000
MONGO_URI=mongodb://localhost:27017/vergo
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

* `jest.json` → Unit tests (`*.spec.ts`)
* `jest-e2e.json` → E2E tests (`*.e2e-spec.ts`)

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
````

**Example:**

```bash
npm run seed:stats -- 64c5cce2a3c71234abcd5678
```

**Notes:**

* `<USER_ID>` is **mandatory**. The script will exit with an error if omitted.
* The script logs the current environment from `config.env.mode`.
* It initializes the NestJS application context to access services and dependencies via **Inversify**.
* Data is seeded via `StatsSeeder` in `src/seeds/stats.seeder.ts`.
* The CLI automatically closes the application context after execution.

---

## 🏗️ Architecture Principles

* **Ports & Adapters**: Business logic (`usecase/`) is framework-agnostic.
* **Dependency Injection**: Managed by `Inversify`.
* **DTO Validation**: Using `class-validator` / `class-transformer`.
* **Error Handling**: Domain errors mapped to HTTP/GraphQL errors.
* **Observability**: Structured logging & future-ready for metrics/tracing.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Fabrice Rosito**
📧 [fabrice.rosito@gmail.com](mailto:fabrice.rosito@gmail.com)