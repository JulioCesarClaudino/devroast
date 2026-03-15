# DevRoast - Database Architecture Overview

## 📋 Executive Summary

This document provides a high-level overview of the Drizzle ORM implementation for DevRoast, including architecture diagrams, technology choices, and quick reference guides.

---

## 🏗️ System Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DevRoast Frontend                        │
│         (Next.js 16 + React 19 + Tailwind CSS)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ (Server Actions)
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Server Layer                        │
│  - /src/server/actions/* (Server Actions)                   │
│  - /src/server/repositories/* (Data Access Layer)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ (Drizzle ORM)
┌─────────────────────────────────────────────────────────────┐
│                     Drizzle ORM                              │
│  - Query Building & Execution                               │
│  - Type-Safe Database Operations                            │
│  - Connection Management                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ (PostgreSQL Wire Protocol)
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                            │
│  - Running in Docker Container                              │
│  - Persistent Data Storage                                  │
│  - Query Execution                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK, UUID)    │
│ username (UNIQUE)│
│ email (UNIQUE)   │
│ created_at       │
│ updated_at       │
└──────┬───────────┘
       │ 1
       │
       ├─────── (1:N) ──────────────┐
       │                            │
       │ (1:N)                      ▼
       │        ┌──────────────────────────┐
       │        │  ROASTS                  │
       │        ├──────────────────────────┤
       │        │ id (PK, UUID)            │
       └───────►│ user_id (FK, NULLABLE)   │ (1:N)
                │ code (TEXT)              ├──────┐
                │ language_id (FK)────┐    │      │
                │ roast_score (INT)    │    │      │
                │ verdict (ENUM)       │    │      │
                │ roast_comment (TEXT) │    │      │
                │ issue_count (INT)    │    │      │
                │ views_count (INT)    │    │      │
                │ favorites_count(INT) │    │      │
                │ comments_count (INT) │    │      │
                │ is_featured (BOOL)   │    │      │
                │ created_at           │    │      │
                │ updated_at           │    │      │
                └──┬───────┬────────────┘    │      │
                   │       │                 │      │
        (1:N)      │       │                 │      │
       ┌──────────┘│       │                 │      │
       │           │       │                 │      │
       │           │       └────┬────────────┘      │
       │           │            │                   │
       ▼           ▼            ▼                   │
┌──────────────┐  ┌──────────────────────┐         │
│  LANGUAGES   │  │      ISSUES          │         │
├──────────────┤  ├──────────────────────┤         │
│ id (PK)      │  │ id (PK)              │         │
│ name (UNIQUE)│  │ roast_id (FK)────────┼─────────┘
│ display_name │  │ title (VARCHAR)      │
│ color (HEX)  │  │ description (TEXT)   │
│ created_at   │  │ code_example (TEXT)  │
└──────────────┘  │ severity (ENUM)      │
                  │ category (VARCHAR)   │
                  │ line_number (INT)    │
                  │ created_at           │
                  └──────────────────────┘

              ROASTS (1:N Relationships)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐
   │ ROAST_      │ │ ROAST_       │ │ ROAST_COMMENTS   │
   │ SUGGESTIONS │ │ FAVORITES    │ │                  │
   ├─────────────┤ ├──────────────┤ ├──────────────────┤
   │ id (PK)     │ │ id (PK)      │ │ id (PK)          │
   │ roast_id(FK)│ │ roast_id(FK) │ │ roast_id (FK)    │
   │ title       │ │ user_id(FK)  │ │ user_id (FK,NUL) │
   │ original    │ │ created_at   │ │ content (TEXT)   │
   │ improved    │ │ UNIQUE(R,U)  │ │ likes_count      │
   │ explanation │ └──────────────┘ │ created_at       │
   │ priority    │                  │ updated_at       │
   │ created_at  │                  └──────────────────┘
   └─────────────┘
```

---

## 📊 Database Schema Summary

### Table Overview

| Table | Purpose | Rows Est. | Growth |
|-------|---------|-----------|---------|
| users | User accounts | 1K-10K | Slow |
| languages | Programming languages | 10 | Static |
| roasts | Code submissions | 10K-100K | Fast |
| issues | Code quality issues | 50K-500K | Very Fast |
| roast_suggestions | Code improvements | 30K-300K | Very Fast |
| roast_comments | User discussions | 100K-1M | Very Fast |
| roast_favorites | User likes | 100K-1M | Very Fast |

### Storage Estimates

```
At 100,000 roasts:
- users table:              ~5 MB
- languages table:          ~50 KB
- roasts table:             ~150 MB
- issues table:             ~500 MB
- roast_suggestions table:  ~300 MB
- roast_comments table:     ~500 MB
- roast_favorites table:    ~200 MB
- Indexes:                  ~400 MB
─────────────────────────────────
TOTAL (conservative):       ~2-2.5 GB

Note: Actual size depends on code length, comment length, etc.
```

---

## 🔄 Key Relationships

### User-Centric View

```
User (1) ──┬─→ Roasts (N)
           │
           ├─→ Comments (N)
           │
           └─→ Favorites (N)

Roast (1) ──┬─→ Issues (N)
            │
            ├─→ Suggestions (N)
            │
            ├─→ Comments (N)
            │
            ├─→ Favorites (N)
            │
            └─→ Language (1)
```

### Data Normalization

- ✅ First Normal Form (1NF): No repeating groups
- ✅ Second Normal Form (2NF): No partial dependencies
- ✅ Third Normal Form (3NF): No transitive dependencies
- ⚠️ Denormalization: `roasts` table includes `issue_count`, `favorites_count`, etc. for performance

---

## 🔍 Performance Considerations

### Indexing Strategy

```
PRIMARY KEYS (Clustered)
├── All tables: (id)

FOREIGN KEYS (Required for relationships)
├── roasts: (user_id, language_id)
├── issues: (roast_id)
├── roast_suggestions: (roast_id)
├── roast_comments: (roast_id, user_id)
├── roast_favorites: (roast_id, user_id)

BUSINESS LOGIC (Optional but recommended)
├── roasts: (roast_score DESC) - for leaderboard
├── roasts: (created_at DESC) - for chronological feed
├── roasts: (favorites_count DESC) - for top roasts
├── issues: (severity) - for filtering
├── roast_comments: (created_at DESC) - for sorting
```

### Query Optimization Tips

1. **Use pagination** for all list queries (LIMIT + OFFSET)
2. **Pre-aggregate counts** in denormalized columns (issue_count, favorites_count)
3. **Create compound indexes** for common filter combinations
4. **Cache leaderboard** data (updated every few minutes)
5. **Partition large tables** if they exceed 100M rows

---

## 🔐 Data Integrity & Constraints

### Primary & Unique Constraints

```
UNIQUE CONSTRAINTS:
├── users.username
├── users.email
├── languages.name
└── roast_favorites.(roast_id, user_id)

FOREIGN KEY CONSTRAINTS:
├── roasts.user_id → users.id (NULLABLE)
├── roasts.language_id → languages.id (NOT NULL)
├── issues.roast_id → roasts.id (CASCADE DELETE)
├── roast_suggestions.roast_id → roasts.id (CASCADE Delete)
├── roast_comments.roast_id → roasts.id (CASCADE Delete)
├── roast_comments.user_id → users.id (NULLABLE)
├── roast_favorites.roast_id → roasts.id (CASCADE Delete)
└── roast_favorites.user_id → users.id (NULLABLE)

CHECK CONSTRAINTS:
├── roasts.roast_score BETWEEN 0 AND 10
└── roasts.verdict IN ('needs_serious_help', 'not_great', 'could_be_better', 'acceptable', 'pretty_good')
```

---

## 📈 Scalability Path

### Phase 1: Initial (0-10K roasts)
- Single PostgreSQL instance
- Standard indexing
- No caching needed
- Estimated: 500 MB - 1 GB

### Phase 2: Growth (10K-100K roasts)
- Add read replicas for analytics queries
- Implement result caching (Redis)
- Optimize slow queries
- Estimated: 1 GB - 5 GB

### Phase 3: Scale (100K-1M roasts)
- Database partitioning by date
- Separate OLTP and OLAP databases
- Implement materialized views for leaderboards
- Add search engine (Elasticsearch) for code search
- Estimated: 5 GB - 50 GB

### Phase 4: Enterprise (1M+ roasts)
- Multi-region replication
- Sharding strategy implementation
- Dedicated analytics infrastructure
- Advanced caching strategies

---

## 🛠️ Development Tools

### Command Reference

```bash
# Database setup
docker-compose up -d                  # Start database
docker-compose down                   # Stop database
docker-compose down -v                # Reset database (⚠️ destructive)

# Drizzle commands
npm run db:generate                   # Generate migrations
npm run db:migrate                    # Apply migrations
npm run db:studio                     # Open GUI database explorer
npm run db:check                      # Check migration status
npm run db:push                       # Push changes to database
npm run db:introspect                 # Introspect existing database

# Database access
docker exec -it devroast-postgres psql -U devroast_user -d devroast
```

### Useful psql Commands

```sql
-- List all tables
\dt

-- Describe a table
\d roasts

-- List indexes
\di

-- Show table size
SELECT pg_size_pretty(pg_total_relation_size('roasts'));

-- Check row count
SELECT COUNT(*) FROM roasts;

-- Show all schema details
\d+ roasts

-- Quit psql
\q
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Database migrations tested on staging
- [ ] Backup strategy documented
- [ ] Connection pooling configured
- [ ] Environment variables configured
- [ ] Monitoring/alerting set up
- [ ] Rollback procedure documented

### Post-Deployment

- [ ] Verify all migrations applied
- [ ] Verify schema matches expectations
- [ ] Test critical user flows
- [ ] Monitor query performance
- [ ] Check database size
- [ ] Verify backups working

---

## 📚 Quick Reference

### Enum Values

**VerdictType:**
- `needs_serious_help` (0-2 score)
- `not_great` (3-4 score)
- `could_be_better` (5-6 score)
- `acceptable` (7-8 score)
- `pretty_good` (9-10 score)

**IssueSeverity:**
- `critical` - Must fix
- `warning` - Should fix
- `info` - Nice to fix

### Common Data Access Patterns

```typescript
// Fetch with relations
const roast = await db
  .select()
  .from(roasts)
  .leftJoin(users, eq(roasts.user_id, users.id))
  .leftJoin(languages, eq(roasts.language_id, languages.id))
  .where(eq(roasts.id, roastId))
  .limit(1)

// Leaderboard with pagination
const leaderboard = await db
  .select()
  .from(roasts)
  .orderBy(desc(roasts.roast_score))
  .limit(pageSize)
  .offset((page - 1) * pageSize)

// Aggregate counts
const stats = await db
  .select({
    totalRoasts: count(),
    avgScore: avg(roasts.roast_score)
  })
  .from(roasts)
```

---

## 🔗 Related Documentation

- **Full Specification**: `DRIZZLE_ORM_SPECIFICATION.md`
- **Quick Start Guide**: `DRIZZLE_QUICK_START.md`
- **Implementation Checklist**: `DRIZZLE_IMPLEMENTATION_CHECKLIST.md`
- **Drizzle Official Docs**: https://orm.drizzle.team/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## 📞 Support & Troubleshooting

### Common Issues

**Connection Refused**
- Check Docker container is running: `docker ps`
- Check .env.local has correct DATABASE_URL
- Check PostgreSQL is listening on port 5432

**Migration Errors**
- Review generated SQL in migration file
- Check schema.ts for syntax errors
- Ensure database is empty before first migration

**Type Errors**
- Run `npm run db:generate` to sync types
- Check all relations are properly defined
- Verify TypeScript compilation: `npm run build`

### Getting Help

1. Check Drizzle documentation: https://orm.drizzle.team/
2. Review migration files for generated SQL
3. Check PostgreSQL logs: `docker logs devroast-postgres`
4. Review TypeScript errors: `npm run build`

---

**Document Version**: 1.0  
**Last Updated**: March 15, 2025  
**Status**: Reference Material
