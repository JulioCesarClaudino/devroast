# DevRoast - Drizzle ORM Implementation Checklist

## 📊 Complete Implementation Roadmap

This document provides a detailed, step-by-step checklist for implementing Drizzle ORM in the DevRoast project.

---

## ✅ Phase 1: Initial Setup & Configuration

### 1.1 Dependencies Installation
- [ ] Install `drizzle-orm` package
- [ ] Install `drizzle-kit` dev dependency
- [ ] Install `pg` package (PostgreSQL client)
- [ ] Install `@types/pg` for TypeScript support
- [ ] Verify all packages are in `package.json`

### 1.2 Environment Configuration
- [ ] Create `.env.local` file in project root
- [ ] Add `DATABASE_URL` with PostgreSQL connection string
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Test that environment variable is accessible

### 1.3 Docker Compose Setup
- [ ] Create `docker-compose.yml` in project root
- [ ] Configure PostgreSQL 16-alpine service
- [ ] Set database name: `devroast`
- [ ] Set username: `devroast_user`
- [ ] Set secure password (update .env.local)
- [ ] Add volume for data persistence
- [ ] Add health check
- [ ] Test Docker Compose: `docker-compose up -d`
- [ ] Verify container is running: `docker ps`

### 1.4 Drizzle Configuration
- [ ] Create `drizzle.config.ts` in project root
- [ ] Set schema path: `./src/db/schema.ts`
- [ ] Set migrations output: `./src/db/migrations`
- [ ] Set dialect: `postgresql`
- [ ] Configure database credentials from environment
- [ ] Enable strict mode
- [ ] Enable verbose logging (for development)

### 1.5 TypeScript Configuration
- [ ] Update `tsconfig.json` with strict settings
- [ ] Enable `"strict": true`
- [ ] Enable `"skipLibCheck": true`
- [ ] Enable `"forceConsistentCasingInFileNames": true`
- [ ] Verify TypeScript compilation: `npm run build`

---

## 📁 Phase 2: Directory Structure & File Setup

### 2.1 Create Directory Structure
```bash
mkdir -p src/db/migrations
mkdir -p src/server/actions
mkdir -p src/server/repositories
mkdir -p src/lib/db
mkdir -p src/lib/constants
```

- [ ] Verify all directories exist
- [ ] Add `.gitkeep` files if needed

### 2.2 Create Database Client File
- [ ] Create `src/db/client.ts`
- [ ] Import `drizzle` from `drizzle-orm/node-postgres`
- [ ] Create PostgreSQL Pool with connection string
- [ ] Export `db` instance
- [ ] Create `testConnection()` function for verification
- [ ] Test client connection

### 2.3 Create Schema File
- [ ] Create `src/db/schema.ts` (empty, will populate in Phase 3)
- [ ] Add necessary imports (drizzle-orm functions)
- [ ] Add TypeScript types/interfaces

---

## 🔤 Phase 3: Enum Definitions

### 3.1 Verdict Enum
- [ ] Define `VerdictType` enum with values:
  - `needs_serious_help`
  - `not_great`
  - `could_be_better`
  - `acceptable`
  - `pretty_good`
- [ ] Create verdict mapping to score ranges
- [ ] Export enum and type

### 3.2 Issue Severity Enum
- [ ] Define `IssueSeverity` enum with values:
  - `critical`
  - `warning`
  - `info`
- [ ] Export enum and type

### 3.3 Language Enum (Optional)
- [ ] Consider if language should be enum or separate table
- [ ] Decision: Use separate `languages` table for flexibility

---

## 📊 Phase 4: Schema Definition

### 4.1 Users Table
- [ ] Define `users` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `username` (VARCHAR, unique, not null)
  - `email` (VARCHAR, unique, not null)
  - `created_at` (timestamp default now)
  - `updated_at` (timestamp default now)
- [ ] Create unique indexes on username and email
- [ ] Add relation helper to roasts

### 4.2 Languages Table
- [ ] Define `languages` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `name` (VARCHAR, unique, not null)
  - `display_name` (VARCHAR, not null)
  - `color` (VARCHAR hex color, not null)
  - `created_at` (timestamp default now)
- [ ] Create unique index on name
- [ ] Add relation helper to roasts

### 4.3 Roasts Table
- [ ] Define `roasts` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `user_id` (UUID, foreign key to users, nullable)
  - `code` (text, not null, length 1-10000)
  - `language_id` (UUID, foreign key to languages)
  - `roast_score` (integer, not null, 0-10)
  - `verdict` (enum, not null)
  - `roast_comment` (text, not null)
  - `issue_count` (integer, default 0)
  - `views_count` (integer, default 0)
  - `favorites_count` (integer, default 0)
  - `comments_count` (integer, default 0)
  - `is_featured` (boolean, default false)
  - `created_at` (timestamp default now)
  - `updated_at` (timestamp default now)
- [ ] Create indexes on:
  - `user_id` (foreign key)
  - `language_id` (foreign key)
  - `roast_score DESC` (for sorting)
  - `created_at DESC` (for chronological sorting)
  - `favorites_count DESC` (for leaderboard)
- [ ] Add constraint: `roast_score` between 0-10
- [ ] Add constraint: `verdict` is valid enum value
- [ ] Add relation helpers

### 4.4 Issues Table
- [ ] Define `issues` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `roast_id` (UUID, foreign key to roasts)
  - `title` (VARCHAR, not null)
  - `description` (text, not null)
  - `code_example` (text, nullable)
  - `severity` (enum, not null)
  - `category` (VARCHAR, not null)
  - `line_number` (integer, nullable)
  - `created_at` (timestamp default now)
- [ ] Create indexes on:
  - `roast_id` (foreign key)
  - `severity`
- [ ] Add constraint: severity is valid enum
- [ ] Add relation helper to roasts

### 4.5 Roast Suggestions Table
- [ ] Define `roast_suggestions` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `roast_id` (UUID, foreign key to roasts)
  - `title` (VARCHAR, not null)
  - `original_code` (text, not null)
  - `improved_code` (text, not null)
  - `explanation` (text, not null)
  - `priority` (VARCHAR, default "medium")
  - `created_at` (timestamp default now)
- [ ] Create indexes on:
  - `roast_id` (foreign key)
  - `priority`
- [ ] Add relation helper to roasts

### 4.6 Roast Comments Table
- [ ] Define `roast_comments` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `roast_id` (UUID, foreign key to roasts)
  - `user_id` (UUID, foreign key to users, nullable)
  - `content` (text, not null, length 1-5000)
  - `likes_count` (integer, default 0)
  - `created_at` (timestamp default now)
  - `updated_at` (timestamp default now)
- [ ] Create indexes on:
  - `roast_id` (foreign key)
  - `user_id` (foreign key)
  - `created_at DESC` (for sorting)
- [ ] Add relation helpers

### 4.7 Roast Favorites Table (Junction Table)
- [ ] Define `roast_favorites` table schema
- [ ] Add fields:
  - `id` (UUID primary key)
  - `roast_id` (UUID, foreign key to roasts)
  - `user_id` (UUID, foreign key to users, nullable)
  - `created_at` (timestamp default now)
- [ ] Create unique compound index on (roast_id, user_id)
- [ ] Create indexes on:
  - `roast_id` (foreign key)
  - `user_id` (foreign key)
- [ ] Add relation helpers

### 4.8 Relations Configuration
- [ ] Users has many Roasts
- [ ] Users has many Comments
- [ ] Users has many Favorites
- [ ] Roasts belongs to User (nullable)
- [ ] Roasts belongs to Language
- [ ] Roasts has many Issues
- [ ] Roasts has many Suggestions
- [ ] Roasts has many Comments
- [ ] Roasts has many Favorites
- [ ] Issues belongs to Roast
- [ ] Suggestions belongs to Roast
- [ ] Comments belongs to Roast
- [ ] Comments belongs to User (nullable)
- [ ] Favorites belongs to Roast
- [ ] Favorites belongs to User (nullable)

---

## 🗂️ Phase 5: Migrations

### 5.1 Generate Initial Migration
- [ ] Run `npm run db:generate`
- [ ] Verify migration file created in `src/db/migrations/`
- [ ] Review generated SQL for accuracy
- [ ] Check migration has proper naming (timestamp_description.sql)

### 5.2 Test Migration
- [ ] Run `npm run db:migrate`
- [ ] Verify migration completes without errors
- [ ] Check for SQL syntax errors in logs
- [ ] Verify all tables created in database:
  ```bash
  docker exec -it devroast-postgres psql -U devroast_user -d devroast -c "\dt"
  ```

### 5.3 Verify Schema
- [ ] Check users table structure
- [ ] Check languages table structure
- [ ] Check roasts table structure
- [ ] Check all constraints are applied
- [ ] Check all indexes are created
- [ ] Verify foreign key relationships

### 5.4 Create Seed Data
- [ ] Create `src/db/seeds/languages.ts`
- [ ] Add insert statements for default languages:
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
- [ ] Create seed script runner
- [ ] Test seed data insertion
- [ ] Verify data inserted correctly

---

## 📚 Phase 6: Data Access Layer (Repositories)

### 6.1 Roast Repository
- [ ] Create `src/server/repositories/roast-repository.ts`
- [ ] Implement `insertRoast()` function
- [ ] Implement `getRoastById()` function
- [ ] Implement `getRoasts()` with pagination
- [ ] Implement `getRoastsByLanguage()` function
- [ ] Implement `getRoastsByUser()` function
- [ ] Implement `updateRoastScore()` function
- [ ] Implement `updateRoastViewCount()` function
- [ ] Implement `updateFavoritesCount()` function
- [ ] Implement `deleteRoast()` function
- [ ] Add error handling
- [ ] Add logging

### 6.2 User Repository
- [ ] Create `src/server/repositories/user-repository.ts`
- [ ] Implement `insertUser()` function
- [ ] Implement `getUserById()` function
- [ ] Implement `getUserByEmail()` function
- [ ] Implement `getUserByUsername()` function
- [ ] Implement `updateUser()` function
- [ ] Implement `deleteUser()` function
- [ ] Add error handling

### 6.3 Issues Repository
- [ ] Create `src/server/repositories/issue-repository.ts`
- [ ] Implement `insertIssue()` function
- [ ] Implement `insertBulkIssues()` function
- [ ] Implement `getIssuesByRoast()` function
- [ ] Implement `deleteIssuesByRoast()` function

### 6.4 Comments Repository
- [ ] Create `src/server/repositories/comment-repository.ts`
- [ ] Implement `insertComment()` function
- [ ] Implement `getCommentsByRoast()` function
- [ ] Implement `updateCommentLikes()` function
- [ ] Implement `deleteComment()` function

### 6.5 Favorites Repository
- [ ] Create `src/server/repositories/favorite-repository.ts`
- [ ] Implement `addFavorite()` function
- [ ] Implement `removeFavorite()` function
- [ ] Implement `isFavorited()` function
- [ ] Implement `getFavoritedByUser()` function
- [ ] Implement `getFavoritesCount()` function

### 6.6 Language Repository
- [ ] Create `src/server/repositories/language-repository.ts`
- [ ] Implement `getAllLanguages()` function
- [ ] Implement `getLanguageById()` function
- [ ] Implement `getLanguageByName()` function

---

## 🔍 Phase 7: Query Builders & Utilities

### 7.1 Leaderboard Queries
- [ ] Create `src/server/queries/leaderboard.ts`
- [ ] Implement `getLeaderboardByScore()` function
- [ ] Implement `getLeaderboardByVerdictCount()` function
- [ ] Implement `getMostCommentedRoasts()` function
- [ ] Implement `getMostFavoritedRoasts()` function
- [ ] Implement pagination support
- [ ] Add sorting options

### 7.2 Analytics Queries
- [ ] Create `src/server/queries/analytics.ts`
- [ ] Implement `getAverageScoreByLanguage()` function
- [ ] Implement `getTotalRoastsCount()` function
- [ ] Implement `getRoastCountByVerdictCategory()` function
- [ ] Implement `getMostCommonIssueCategories()` function
- [ ] Implement `getRoastCountByLanguage()` function

### 7.3 Database Utilities
- [ ] Create `src/lib/db/utils.ts`
- [ ] Implement `withPagination()` helper
- [ ] Implement `buildFilters()` helper
- [ ] Implement transaction wrapper
- [ ] Implement error handling utilities

---

## 🎯 Phase 8: Server Actions (Next.js)

### 8.1 Roast Actions
- [ ] Create `src/server/actions/roasts.ts`
- [ ] Implement `submitRoast()` server action
- [ ] Implement `getRoastDetails()` server action
- [ ] Implement `incrementRoastViews()` server action
- [ ] Add validation using zod or similar
- [ ] Add error handling
- [ ] Add logging

### 8.2 Leaderboard Actions
- [ ] Create `src/server/actions/leaderboard.ts`
- [ ] Implement `getLeaderboardData()` server action
- [ ] Support pagination
- [ ] Support sorting options
- [ ] Add caching if needed

### 8.3 Comment Actions
- [ ] Create `src/server/actions/comments.ts`
- [ ] Implement `postComment()` server action
- [ ] Implement `getComments()` server action
- [ ] Implement `deleteComment()` server action

### 8.4 Favorite Actions
- [ ] Create `src/server/actions/favorites.ts`
- [ ] Implement `addFavorite()` server action
- [ ] Implement `removeFavorite()` server action
- [ ] Implement `checkFavoriteStatus()` server action

---

## 🔗 Phase 9: Integration with Existing Components

### 9.1 Home Page Integration
- [ ] Update code editor component to save submissions
- [ ] Connect submit button to `submitRoast()` action
- [ ] Implement loading states during submission
- [ ] Display success/error messages

### 9.2 Results Page Integration
- [ ] Load roast results from database
- [ ] Display issues from database
- [ ] Display suggestions from database
- [ ] Show comment count, favorite count

### 9.3 Leaderboard Integration
- [ ] Load leaderboard data from database
- [ ] Implement pagination
- [ ] Add sorting options
- [ ] Display user information if available

### 9.4 Theme/Styling Integration
- [ ] Ensure all new database operations use existing design tokens
- [ ] Maintain consistent styling with current components
- [ ] Test responsive behavior on mobile

---

## 🧪 Phase 10: Testing & Validation

### 10.1 Database Connection Tests
- [ ] Test database connection succeeds
- [ ] Test connection string from environment variables
- [ ] Test connection pooling
- [ ] Test error handling for connection failures

### 10.2 Schema Validation Tests
- [ ] Test all constraints are enforced
- [ ] Test unique constraints work
- [ ] Test foreign key constraints work
- [ ] Test default values are applied
- [ ] Test timestamp columns auto-update

### 10.3 Data Access Layer Tests
- [ ] Test insertRoast() with valid data
- [ ] Test insertRoast() with invalid data
- [ ] Test getRoastById() returns correct data
- [ ] Test pagination queries
- [ ] Test filtering queries
- [ ] Test sorting queries
- [ ] Test null handling in optional fields

### 10.4 Integration Tests
- [ ] Test complete submission flow
- [ ] Test leaderboard loading
- [ ] Test comment submission
- [ ] Test favorite/like functionality
- [ ] Test concurrent operations

### 10.5 Performance Tests
- [ ] Run load test on database
- [ ] Verify indexes are being used
- [ ] Check query execution times
- [ ] Test with 100+ roasts
- [ ] Test with 1000+ roasts

### 10.6 Data Integrity Tests
- [ ] Test cascading deletes work correctly
- [ ] Test foreign key violations are prevented
- [ ] Test duplicate prevention (unique constraints)
- [ ] Test transaction rollback

---

## 📝 Phase 11: Documentation & Cleanup

### 11.1 Code Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Document repository method signatures
- [ ] Add usage examples for complex queries
- [ ] Document error handling approach
- [ ] Document environment variables required

### 11.2 Database Documentation
- [ ] Create entity-relationship diagram (ERD)
- [ ] Document table relationships
- [ ] Document index strategy and rationale
- [ ] Document migration procedure
- [ ] Document backup/restore procedure

### 11.3 Developer Guide
- [ ] Write guide for adding new tables
- [ ] Write guide for writing new queries
- [ ] Write guide for debugging database issues
- [ ] Document common pitfalls

### 11.4 Production Checklist
- [ ] Update `.env.example` with all required variables
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Create production database URL template
- [ ] Document backup strategy
- [ ] Document monitoring/alerting strategy
- [ ] Create disaster recovery plan

---

## 🚀 Phase 12: Deployment Preparation

### 12.1 Environment Setup
- [ ] Test migration on staging database
- [ ] Test with production connection string format
- [ ] Verify all environment variables are documented
- [ ] Test with production-like data volume

### 12.2 CI/CD Integration
- [ ] Add database migration step to CI/CD pipeline
- [ ] Add database validation tests to CI/CD
- [ ] Add database seeding to deployment process
- [ ] Document rollback procedure

### 12.3 Monitoring & Maintenance
- [ ] Set up database query logging
- [ ] Set up slow query alerting
- [ ] Document connection pool configuration
- [ ] Document backup frequency and retention

---

## 📊 Summary Statistics

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| 1: Setup | 15 | 2-3 |
| 2: Structure | 5 | 1 |
| 3: Enums | 8 | 1 |
| 4: Schema | 30 | 4-5 |
| 5: Migrations | 10 | 2 |
| 6: Repositories | 25 | 8-10 |
| 7: Utilities | 12 | 3-4 |
| 8: Server Actions | 15 | 5 |
| 9: Integration | 15 | 4-6 |
| 10: Testing | 20 | 8-10 |
| 11: Documentation | 15 | 4-5 |
| 12: Deployment | 10 | 3 |
| **TOTAL** | **180** | **45-57** |

---

## ⚠️ Important Reminders

1. **Always backup data** before running migrations in production
2. **Test migrations thoroughly** on staging before production
3. **Keep `.env.local` out of version control**
4. **Review generated migrations** before applying them
5. **Monitor database performance** after deployment
6. **Maintain audit trails** for compliance (timestamps are important)
7. **Plan for growth** - consider sharding/partitioning for large datasets

---

**Document Version**: 1.0  
**Last Updated**: March 15, 2025  
**Status**: Ready for Implementation
