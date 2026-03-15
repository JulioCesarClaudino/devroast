import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ==================== ENUMS ====================

export const VerdictEnum = [
  "needs_serious_help",
  "not_great",
  "could_be_better",
  "acceptable",
  "pretty_good",
] as const;
export type Verdict = (typeof VerdictEnum)[number];

export const IssueSeverityEnum = ["critical", "warning", "info"] as const;
export type IssueSeverity = (typeof IssueSeverityEnum)[number];

// ==================== TABLES ====================

/**
 * Users table - Stores user accounts
 * Uses UUID primary keys for scalability and privacy
 */
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

/**
 * Languages table - Reference table for programming languages
 * Pre-populated with common languages
 */
export const languagesTable = pgTable(
  "languages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    displayName: text("display_name").notNull(),
    color: text("color").notNull(), // Hex color code
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex("languages_name_idx").on(table.name),
  })
);

/**
 * Roasts table - Stores code submissions and roast results
 * Denormalized counts for fast leaderboard queries
 */
export const roastsTable = pgTable(
  "roasts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"), // Nullable for anonymous submissions
    code: text("code").notNull(),
    languageId: uuid("language_id")
      .notNull()
      .references(() => languagesTable.id),
    roastScore: integer("roast_score").notNull(),
    verdict: text("verdict").notNull(), // One of VerdictEnum
    roastComment: text("roast_comment").notNull(),
    issueCount: integer("issue_count").notNull().default(0),
    viewsCount: integer("views_count").notNull().default(0),
    favoritesCount: integer("favorites_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    // Important indexes for queries
    scoreIdx: index("roasts_score_idx").on(table.roastScore),
    createdAtIdx: index("roasts_created_at_idx").on(table.createdAt),
    favoritesIdx: index("roasts_favorites_count_idx").on(table.favoritesCount),
  })
);

/**
 * Issues table - Code quality issues detected in roasts
 */
export const issuesTable = pgTable(
  "issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roastId: uuid("roast_id")
      .notNull()
      .references(() => roastsTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    codeExample: text("code_example"),
    severity: text("severity").notNull(), // One of IssueSeverityEnum
    category: text("category").notNull(),
    lineNumber: integer("line_number"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    roastIdIdx: index("issues_roast_id_idx").on(table.roastId),
    severityIdx: index("issues_severity_idx").on(table.severity),
  })
);

/**
 * Roast Suggestions table - Code improvement suggestions
 */
export const roastSuggestionsTable = pgTable(
  "roast_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roastId: uuid("roast_id")
      .notNull()
      .references(() => roastsTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    originalCode: text("original_code").notNull(),
    improvedCode: text("improved_code").notNull(),
    explanation: text("explanation").notNull(),
    priority: text("priority").notNull().default("medium"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    roastIdIdx: index("roast_suggestions_roast_id_idx").on(table.roastId),
  })
);

/**
 * Roast Comments table - User comments on roasts
 */
export const roastCommentsTable = pgTable(
  "roast_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roastId: uuid("roast_id")
      .notNull()
      .references(() => roastsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id"), // Nullable for anonymous comments
    content: text("content").notNull(),
    likesCount: integer("likes_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    roastIdIdx: index("roast_comments_roast_id_idx").on(table.roastId),
    createdAtIdx: index("roast_comments_created_at_idx").on(table.createdAt),
  })
);

/**
 * Roast Favorites table - Junction table for user favorites/likes
 * Unique constraint ensures a user can favorite a roast only once
 */
export const roastFavoritesTable = pgTable(
  "roast_favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roastId: uuid("roast_id")
      .notNull()
      .references(() => roastsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id"), // Nullable for anonymous favorites
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueFavoriteIdx: uniqueIndex("roast_favorites_unique_idx").on(table.roastId, table.userId),
  })
);

// ==================== TYPE EXPORTS ====================

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Language = typeof languagesTable.$inferSelect;
export type NewLanguage = typeof languagesTable.$inferInsert;

export type Roast = typeof roastsTable.$inferSelect;
export type NewRoast = typeof roastsTable.$inferInsert;

export type Issue = typeof issuesTable.$inferSelect;
export type NewIssue = typeof issuesTable.$inferInsert;

export type RoastSuggestion = typeof roastSuggestionsTable.$inferSelect;
export type NewRoastSuggestion = typeof roastSuggestionsTable.$inferInsert;

export type RoastComment = typeof roastCommentsTable.$inferSelect;
export type NewRoastComment = typeof roastCommentsTable.$inferInsert;

export type RoastFavorite = typeof roastFavoritesTable.$inferSelect;
export type NewRoastFavorite = typeof roastFavoritesTable.$inferInsert;
