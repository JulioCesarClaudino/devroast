# DevRoast - Drizzle ORM Quick Start Guide

## 🚀 Quick Start in 5 Steps

### Step 1: Install Dependencies

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

### Step 2: Set Up Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://devroast_user:devroast_password@localhost:5432/devroast
```

### Step 3: Create Docker Compose File

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-postgres
    environment:
      POSTGRES_DB: devroast
      POSTGRES_USER: devroast_user
      POSTGRES_PASSWORD: devroast_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - devroast_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  devroast_network:
    driver: bridge
```

Start the database:

```bash
docker-compose up -d
```

### Step 4: Create Drizzle Configuration

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  migrations: {
    prefix: "timestamp",
  },
  strict: true,
  verbose: true,
});
```

### Step 5: Create Database Client

Create `src/db/client.ts`:

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected:", result.rows[0]);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
```

---

## 📋 Common Commands

### Development Workflow

```bash
# Generate migration from schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (GUI for database)
npm run db:studio

# View migration status
npm run db:check
```

### Add to package.json Scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:check": "drizzle-kit check",
    "db:push": "drizzle-kit push",
    "db:introspect": "drizzle-kit introspect"
  }
}
```

---

## 🗂️ Project Structure Setup

Create the following folder structure:

```bash
mkdir -p src/db/migrations
mkdir -p src/server/actions
mkdir -p src/server/repositories
mkdir -p src/lib/db
mkdir -p src/lib/constants
```

---

## ✅ Verification Checklist

After following the quick start, verify:

- [ ] PostgreSQL container is running: `docker ps`
- [ ] Database is accessible: `docker exec -it devroast-postgres psql -U devroast_user -d devroast`
- [ ] `.env.local` is configured correctly
- [ ] `drizzle.config.ts` exists and is valid
- [ ] `src/db/client.ts` is created
- [ ] Database connection test passes
- [ ] Migration folder exists: `src/db/migrations`

---

## 🔧 Troubleshooting

### Connection Refused Error

```bash
# Check if container is running
docker ps | grep postgres

# Check container logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

### Migration Issues

```bash
# Reset migrations (⚠️ Deletes all data)
docker-compose down -v
docker-compose up -d

# Then regenerate and apply migrations
npm run db:generate
npm run db:migrate
```

### Port Already in Use

Change postgres port in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Use 5433 instead of 5432
```

Update `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL=postgresql://devroast_user:devroast_password@localhost:5433/devroast
```

---

## 📚 Next Steps

1. Read the full specification: `DRIZZLE_ORM_SPECIFICATION.md`
2. Implement the schema definitions in `src/db/schema.ts`
3. Generate the initial migration
4. Create repository/data access layer
5. Implement API endpoints

---

**For detailed specifications, see:** `specs/DRIZZLE_ORM_SPECIFICATION.md`
