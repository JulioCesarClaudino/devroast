# DevRoast - Drizzle ORM Implementation Specification

## 📋 Overview

This document outlines the complete specification for implementing **Drizzle ORM** in the DevRoast project with **PostgreSQL** via **Docker Compose**. The implementation will handle persistence of code roasts, user submissions, leaderboard data, and analytics.

---

## 🎯 Objectives

- Set up PostgreSQL database with Docker Compose
- Implement Drizzle ORM for type-safe database operations
- Create database schema for DevRoast features
- Establish migrations workflow
- Ensure data integrity and proper relationships

---

## 📊 Database Schema

### Overview of Tables

The following tables are required to support all DevRoast features:

```
users
├── Stores user information and preferences
├── Relationships: has many roasts, has many favorites

roasts
├── Stores code roast submissions
├── Relationships: belongs to user, has many issues, has many comments

issues (analysis)
├── Stores detected code issues/problems
├── Relationships: belongs to roast

roast_suggestions
├── Stores code improvement suggestions
├── Relationships: belongs to roast

roast_comments
├── Stores user comments on roasts
├── Relationships: belongs to roast, belongs to user

roast_favorites
├── Stores user favorites (likes) on roasts
├── Relationships: belongs to user, belongs to roast

languages
├── Stores supported programming languages
├── Relationships: has many roasts

roast_verdicts
├── Enumeration: "needs_serious_help", "not_great", "could_be_better", "acceptable", "pretty_good"

issue_severity
├── Enumeration: "critical", "warning", "info"
```

---

## 📌 Detailed Table Specifications

### 1. **users**

**Purpose**: Store user information for future authentication and profile features

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | User's display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**: `UNIQUE(username)`, `UNIQUE(email)`

---

### 2. **languages**

**Purpose**: Reference table for supported programming languages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique language identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Language name (e.g., "javascript") |
| display_name | VARCHAR(100) | NOT NULL | Display name (e.g., "JavaScript") |
| color | VARCHAR(7) | NOT NULL | Hex color code for UI (e.g., "#F7DF1E") |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes**: `UNIQUE(name)`

**Pre-populated Languages**:
- JavaScript
- TypeScript
- Python
- Java
- C++
- Rust
- Go
- PHP
- Ruby
- C#

---

### 3. **roasts**

**Purpose**: Store code roast submissions with results and metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique roast identifier |
| user_id | UUID | NULLABLE, FK → users | Author of the roast (NULL for anonymous) |
| code | TEXT | NOT NULL | Submitted code snippet |
| language_id | UUID | NOT NULL, FK → languages | Programming language used |
| roast_score | INTEGER | NOT NULL (0-10) | Roast score from 0-10 |
| verdict | VARCHAR(50) | NOT NULL, ENUM | Verdict category (needs_serious_help, not_great, could_be_better, acceptable, pretty_good) |
| roast_comment | TEXT | NOT NULL | Witty/constructive feedback text |
| issue_count | INTEGER | DEFAULT 0 | Number of issues found |
| views_count | INTEGER | DEFAULT 0 | Number of times viewed |
| favorites_count | INTEGER | DEFAULT 0 | Number of favorites/likes |
| comments_count | INTEGER | DEFAULT 0 | Number of comments |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured on homepage |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**: `FK(user_id)`, `FK(language_id)`, `(roast_score DESC)`, `(created_at DESC)`, `(favorites_count DESC)`

**Constraints**: 
- `roast_score` must be between 0 and 10
- `verdict` must be one of the enum values
- `code` must have 1-10000 characters

---

### 4. **issues** (Code Analysis Issues)

**Purpose**: Store individual code issues detected in a roast

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique issue identifier |
| roast_id | UUID | NOT NULL, FK → roasts | Associated roast |
| title | VARCHAR(255) | NOT NULL | Issue title/name |
| description | TEXT | NOT NULL | Detailed description of the issue |
| code_example | TEXT | NULLABLE | Code snippet showing the issue |
| severity | VARCHAR(50) | NOT NULL, ENUM | Issue severity (critical, warning, info) |
| category | VARCHAR(100) | NOT NULL | Issue category (e.g., "scope", "performance", "readability") |
| line_number | INTEGER | NULLABLE | Line number where issue occurs |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes**: `FK(roast_id)`, `(severity)`

**Constraints**: 
- `severity` must be one of: "critical", "warning", "info"
- `roast_id` must exist in roasts table

---

### 5. **roast_suggestions** (Improvement Suggestions)

**Purpose**: Store code improvement suggestions for each roast

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique suggestion identifier |
| roast_id | UUID | NOT NULL, FK → roasts | Associated roast |
| title | VARCHAR(255) | NOT NULL | Suggestion title |
| original_code | TEXT | NOT NULL | Original problematic code |
| improved_code | TEXT | NOT NULL | Improved/fixed code |
| explanation | TEXT | NOT NULL | Why this improvement helps |
| priority | VARCHAR(50) | DEFAULT "medium" | Priority level (low, medium, high) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Indexes**: `FK(roast_id)`, `(priority)`

**Constraints**: 
- `roast_id` must exist in roasts table

---

### 6. **roast_comments** (User Comments)

**Purpose**: Store user comments/discussions on roasts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique comment identifier |
| roast_id | UUID | NOT NULL, FK → roasts | Associated roast |
| user_id | UUID | NULLABLE, FK → users | Comment author (NULL for anonymous) |
| content | TEXT | NOT NULL | Comment text |
| likes_count | INTEGER | DEFAULT 0 | Number of likes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Comment creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last edit timestamp |

**Indexes**: `FK(roast_id)`, `FK(user_id)`, `(created_at DESC)`

**Constraints**: 
- `content` must have 1-5000 characters
- `roast_id` must exist in roasts table

---

### 7. **roast_favorites** (User Likes)

**Purpose**: Store user favorites/likes on roasts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, AUTO | Unique favorite record identifier |
| roast_id | UUID | NOT NULL, FK → roasts | Favorited roast |
| user_id | UUID | NULLABLE, FK → users | User who favorited (NULL for anonymous) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Favorite timestamp |

**Indexes**: `UNIQUE(roast_id, user_id)`, `FK(roast_id)`, `FK(user_id)`

**Constraints**: 
- `roast_id` must exist in roasts table
- Compound unique constraint on (roast_id, user_id) to prevent duplicates

---

### 8. **migrations** (Auto-generated by Drizzle)

**Purpose**: Track applied database migrations

Generated automatically by Drizzle Kit.

---

## 🔤 Enums

### VerdictEnum
Represents the roast score verdict/category

```typescript
enum VerdictType {
  NEEDS_SERIOUS_HELP = "needs_serious_help",
  NOT_GREAT = "not_great",
  COULD_BE_BETTER = "could_be_better",
  ACCEPTABLE = "acceptable",
  PRETTY_GOOD = "pretty_good"
}
```

**Mapping**:
- `needs_serious_help`: Score 0-2 (Red - Critical feedback needed)
- `not_great`: Score 3-4 (Orange - Significant issues)
- `could_be_better`: Score 5-6 (Yellow - Room for improvement)
- `acceptable`: Score 7-8 (Light Green - Generally good)
- `pretty_good`: Score 9-10 (Green - Excellent code)

---

### SeverityEnum
Represents the severity level of code issues

```typescript
enum IssueSeverity {
  CRITICAL = "critical",
  WARNING = "warning",
  INFO = "info"
}
```

---

## 📦 Technology Stack

### Core Dependencies

```json
{
  "drizzle-orm": "^0.33.0",
  "drizzle-kit": "^0.23.0",
  "pg": "^8.11.0",
  "@types/pg": "^8.11.0"
}
```

### Dev Dependencies

```json
{
  "typescript": "^5.x",
  "@types/node": "^20.x"
}
```

### Docker & Infrastructure

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
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

volumes:
  postgres_data:

networks:
  devroast_network:
```

---

## 📁 Project Structure

```
src/
├── db/
│   ├── schema.ts                 # Drizzle ORM schema definitions
│   ├── client.ts                 # Database client setup
│   ├── migrations/               # Migration files (generated by Drizzle Kit)
│   │   └── 0001_initial.sql
│   └── seeds/
│       └── languages.ts          # Initial language data
├── server/                       # Server-side code (if Next.js API routes)
│   ├── actions/
│   │   ├── roasts.ts            # Roast CRUD operations
│   │   ├── users.ts             # User operations
│   │   └── comments.ts          # Comment operations
│   └── repositories/
│       └── roast-repository.ts  # Data access layer for roasts
└── lib/
    ├── db/
    │   └── utils.ts             # Database utility functions
    └── constants/
        └── verdict-map.ts       # Score to verdict mappings
```

---

## 🔧 Configuration Files

### `.env.local` (Environment Variables)

```env
# Database Configuration
DATABASE_URL=postgresql://devroast_user:devroast_password@localhost:5432/devroast

# Optional: For migrations
DRIZZLE_MIGRATIONS_FOLDER=./src/db/migrations
```

### `drizzle.config.ts` (Drizzle Kit Configuration)

```typescript
import { defineConfig } from "drizzle-kit";

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
});
```

### `tsconfig.json` (TypeScript Configuration)

```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

---

## 📝 Schema Definition (src/db/schema.ts)

Key types and relations to implement:

```typescript
// Users table
users: Table {
  id: uuid (pk)
  username: string (unique)
  email: string (unique)
  created_at: timestamp
  updated_at: timestamp
}

// Languages reference table
languages: Table {
  id: uuid (pk)
  name: string (unique)
  display_name: string
  color: string (hex)
  created_at: timestamp
}

// Roasts - main content table
roasts: Table {
  id: uuid (pk)
  user_id: uuid (fk -> users, nullable)
  code: text
  language_id: uuid (fk -> languages)
  roast_score: integer (0-10)
  verdict: enum (verdict_type)
  roast_comment: text
  issue_count: integer
  views_count: integer
  favorites_count: integer
  comments_count: integer
  is_featured: boolean
  created_at: timestamp
  updated_at: timestamp
}

// Issues - code analysis issues
issues: Table {
  id: uuid (pk)
  roast_id: uuid (fk -> roasts)
  title: string
  description: text
  code_example: text (nullable)
  severity: enum (issue_severity)
  category: string
  line_number: integer (nullable)
  created_at: timestamp
}

// Suggestions - improvement suggestions
roast_suggestions: Table {
  id: uuid (pk)
  roast_id: uuid (fk -> roasts)
  title: string
  original_code: text
  improved_code: text
  explanation: text
  priority: string
  created_at: timestamp
}

// Comments - user discussion
roast_comments: Table {
  id: uuid (pk)
  roast_id: uuid (fk -> roasts)
  user_id: uuid (fk -> users, nullable)
  content: text
  likes_count: integer
  created_at: timestamp
  updated_at: timestamp
}

// Favorites - user likes
roast_favorites: Table {
  id: uuid (pk)
  roast_id: uuid (fk -> roasts)
  user_id: uuid (fk -> users, nullable)
  created_at: timestamp
  unique: (roast_id, user_id)
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Setup & Configuration
- [ ] Install Drizzle ORM and PostgreSQL packages
- [ ] Set up Docker Compose with PostgreSQL
- [ ] Configure `.env.local` and database URL
- [ ] Create `drizzle.config.ts`
- [ ] Set up database client (`src/db/client.ts`)

### Phase 2: Schema Definition
- [ ] Define enum types (VerdictType, IssueSeverity)
- [ ] Create `users` table schema
- [ ] Create `languages` table schema
- [ ] Create `roasts` table schema with all relations
- [ ] Create `issues` table schema
- [ ] Create `roast_suggestions` table schema
- [ ] Create `roast_comments` table schema
- [ ] Create `roast_favorites` table schema

### Phase 3: Migrations & Database Setup
- [ ] Generate initial migration with Drizzle Kit
- [ ] Test migration on local Docker PostgreSQL
- [ ] Create seed file for default languages
- [ ] Run migrations and seed data
- [ ] Verify schema integrity

### Phase 4: Data Access Layer
- [ ] Create roast repository with CRUD operations
- [ ] Create user repository (for future auth)
- [ ] Create comment repository
- [ ] Create favorite repository
- [ ] Add query builders for leaderboard filtering
- [ ] Add aggregation queries (stats, counts)

### Phase 5: Integration & Testing
- [ ] Connect existing roast submission flow to database
- [ ] Implement leaderboard queries
- [ ] Test all CRUD operations
- [ ] Performance testing with indexes
- [ ] Create API endpoints for roast submission/retrieval

### Phase 6: Documentation & Optimization
- [ ] Add database operation examples
- [ ] Create migration rollback procedures
- [ ] Document query performance characteristics
- [ ] Add monitoring/logging for DB queries

---

## 🐳 Docker Compose Setup

### Starting the Database

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Check container status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop the container
docker-compose down

# Complete reset (including data)
docker-compose down -v
```

### Database CLI Access

```bash
# Connect to PostgreSQL via psql
docker exec -it devroast-postgres psql -U devroast_user -d devroast

# Common commands in psql:
# \dt                    - List all tables
# \d tablename          - Describe table
# \q                    - Quit psql
```

---

## 💾 Initial Data (Seeds)

### Default Languages to Insert

```sql
INSERT INTO languages (id, name, display_name, color) VALUES
('lang_js', 'javascript', 'JavaScript', '#F7DF1E'),
('lang_ts', 'typescript', 'TypeScript', '#3178C6'),
('lang_py', 'python', 'Python', '#3776AB'),
('lang_java', 'java', 'Java', '#007396'),
('lang_cpp', 'cpp', 'C++', '#00599C'),
('lang_rust', 'rust', 'Rust', '#CE422B'),
('lang_go', 'go', 'Go', '#00ADD8'),
('lang_php', 'php', 'PHP', '#777BB4'),
('lang_ruby', 'ruby', 'Ruby', '#CC342D'),
('lang_csharp', 'csharp', 'C#', '#239120');
```

---

## 🔑 Key Relationships

### User → Roasts
- One user can submit many roasts
- A roast belongs to one user (nullable for anonymous submissions)
- Relationship: `users.id → roasts.user_id` (One-to-Many)

### Roast → Issues
- One roast has many issues identified
- An issue belongs to one roast
- Relationship: `roasts.id → issues.roast_id` (One-to-Many)

### Roast → Suggestions
- One roast has many improvement suggestions
- A suggestion belongs to one roast
- Relationship: `roasts.id → roast_suggestions.roast_id` (One-to-Many)

### Roast → Comments
- One roast can have many comments
- A comment belongs to one roast
- User can optionally be associated with a comment
- Relationship: `roasts.id → roast_comments.roast_id` (One-to-Many)

### Roast ← → Favorites (User Likes)
- Users can favorite multiple roasts
- Roasts can be favorited by multiple users
- Relationship: Many-to-Many through `roast_favorites` junction table

### Language ← Roasts
- One language can have many roasts submitted in it
- A roast belongs to one language
- Relationship: `languages.id → roasts.language_id` (One-to-Many)

---

## 🔍 Queries to Implement

### Basic CRUD Queries

```typescript
// Create
- insertRoast(roastData)
- insertIssue(issueData)
- insertUser(userData)
- insertComment(commentData)

// Read
- getRoastById(id)
- getRoastsByLanguage(languageId, limit, offset)
- getLeaderboard(limit, offset, sortBy)
- getIssuesByRoast(roastId)
- getCommentsByRoast(roastId, limit, offset)
- getUserProfile(userId)

// Update
- updateRoastScore(roastId, newScore)
- updateRoastViewCount(roastId)
- updateFavoritesCount(roastId)

// Delete
- deleteRoast(roastId)
- deleteComment(commentId)
- removeFavorite(roastId, userId)
```

### Complex Queries

```typescript
// Analytics
- getAverageScoreByLanguage()
- getTotalRoastsCount()
- getRoastsByVerdictDistribution()
- getMostCommonIssues(limit)

// Leaderboard
- getTopRoastedCodes(limit) // Sorted by roast_score DESC
- getMostCommentedRoasts(limit) // Sorted by comments_count DESC
- getMostFavoritedRoasts(limit) // Sorted by favorites_count DESC
```

---

## 🧪 Testing Considerations

### Unit Tests
- Test schema validation
- Test query builders
- Test data transformations

### Integration Tests
- Test database operations with actual PostgreSQL
- Test transaction rollbacks
- Test foreign key constraints
- Test unique constraints

### Performance Tests
- Test index effectiveness on large datasets
- Test pagination queries
- Test filtering/sorting performance

---

## 📌 Important Notes

1. **UUID vs Serial**: Using UUID (Primary Key) instead of auto-incrementing integers for better privacy and distributed systems compatibility

2. **Soft Deletes**: Consider implementing soft deletes (is_deleted flag) for roasts and users instead of hard deletion for audit trails

3. **Timestamps**: All tables include `created_at` and `updated_at` for audit purposes and chronological sorting

4. **Anonymous Submissions**: `user_id` is nullable to support anonymous code submissions without requiring authentication

5. **Denormalization**: Tables like `roasts` include denormalized counts (`issue_count`, `favorites_count`, etc.) for faster leaderboard queries. These should be updated via triggers or application logic

6. **Verdict Calculation**: The verdict should be calculated based on `roast_score` at submission time, not stored as raw score

7. **Future Considerations**:
   - Add `deleted_at` timestamp for soft deletes
   - Add `is_public` boolean to control roast visibility
   - Add `tags` table for categorizing roasts beyond language
   - Add `user_preferences` table for theme, notification settings

---

## 📞 Support & Resources

- **Drizzle Documentation**: https://orm.drizzle.team/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/

---

**Document Version**: 1.0  
**Last Updated**: March 15, 2025  
**Status**: Ready for Implementation
