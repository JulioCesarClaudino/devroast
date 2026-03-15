"use server";

import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";
import { usersTable } from "@/db/schema";

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const result = await db.execute(sql`
    SELECT id, username, email, created_at, updated_at
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const result = await db.execute(sql`
    SELECT id, username, email, created_at, updated_at
    FROM users
    WHERE username = ${username}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const result = await db.execute(sql`
    SELECT id, username, email, created_at, updated_at
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Create new user
 */
export async function createUser(username: string, email: string) {
  const userId = uuidv4();
  const now = new Date();

  const result = await db.execute(sql`
    INSERT INTO users (id, username, email, created_at, updated_at)
    VALUES (${userId}, ${username}, ${email}, ${now}, ${now})
    RETURNING id, username, email, created_at, updated_at
  `);

  return result.rows[0] || null;
}

/**
 * Update user email
 */
export async function updateUserEmail(userId: string, email: string) {
  const now = new Date();

  const result = await db.execute(sql`
    UPDATE users
    SET email = ${email}, updated_at = ${now}
    WHERE id = ${userId}
    RETURNING id, username, email, created_at, updated_at
  `);

  return result.rows[0] || null;
}

/**
 * Update username
 */
export async function updateUsername(userId: string, username: string) {
  const now = new Date();

  const result = await db.execute(sql`
    UPDATE users
    SET username = ${username}, updated_at = ${now}
    WHERE id = ${userId}
    RETURNING id, username, email, created_at, updated_at
  `);

  return result.rows[0] || null;
}

/**
 * Get user roast statistics
 */
export async function getUserRoastStats(userId: string) {
  const result = await db.execute(sql`
    SELECT
      COUNT(*) as total_roasts,
      AVG(roast_score) as avg_score,
      MAX(roast_score) as best_score,
      MIN(roast_score) as worst_score,
      SUM(views_count) as total_views,
      SUM(favorites_count) as total_favorites,
      SUM(comments_count) as total_comments
    FROM roasts
    WHERE user_id = ${userId}
  `);

  const stats = result.rows[0] as any;
  return {
    totalRoasts: parseInt(stats?.total_roasts as string) || 0,
    avgScore: stats?.avg_score ? Math.round(stats.avg_score as number) : 0,
    bestScore: stats?.best_score ? Math.round(stats.best_score as number) : 0,
    worstScore: stats?.worst_score ? Math.round(stats.worst_score as number) : 0,
    totalViews: parseInt(stats?.total_views as string) || 0,
    totalFavorites: parseInt(stats?.total_favorites as string) || 0,
    totalComments: parseInt(stats?.total_comments as string) || 0,
  };
}

/**
 * Get user's recent roasts
 */
export async function getUserRecentRoasts(userId: string, limit = 10) {
  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.issue_count as issueCount,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.comments_count as commentsCount,
      r.is_featured as isFeatured,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName,
      l.color as languageColor
    FROM roasts r
    LEFT JOIN languages l ON r.language_id = l.id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
    LIMIT ${limit}
  `);

  return result.rows;
}

/**
 * Get user's favorite roasts (paginated)
 */
export async function getUserFavorites(userId: string, limit = 20, offset = 0) {
  const countResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM roast_favorites
    WHERE user_id = ${userId}
  `);

  const total = parseInt(countResult.rows[0].count as string) || 0;

  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.issue_count as issueCount,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.comments_count as commentsCount,
      r.is_featured as isFeatured,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      u.id as userId,
      u.username,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName,
      l.color as languageColor
    FROM roast_favorites rf
    LEFT JOIN roasts r ON rf.roast_id = r.id
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN languages l ON r.language_id = l.id
    WHERE rf.user_id = ${userId}
    ORDER BY rf.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return { data: result.rows, total, limit, offset };
}

/**
 * Delete user account and cascade delete related data
 */
export async function deleteUser(userId: string) {
  const result = await db.execute(sql`
    DELETE FROM users
    WHERE id = ${userId}
    RETURNING id
  `);

  return result.rows[0] || null;
}
