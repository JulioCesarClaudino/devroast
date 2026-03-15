"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db/client";

/**
 * Get global roasting statistics
 */
export async function getGlobalStats() {
  const result = await db.execute(sql`
    SELECT
      COUNT(DISTINCT r.id) as total_roasts,
      COUNT(DISTINCT r.user_id) as total_users,
      COUNT(DISTINCT r.language_id) as total_languages,
      AVG(r.roast_score) as avg_score,
      MAX(r.roast_score) as best_score,
      SUM(r.views_count) as total_views,
      SUM(r.comments_count) as total_comments,
      SUM(r.favorites_count) as total_favorites
    FROM roasts r
  `);

  const stats = result.rows[0] as any;
  return {
    totalRoasts: parseInt(stats?.total_roasts as string) || 0,
    totalUsers: parseInt(stats?.total_users as string) || 0,
    totalLanguages: parseInt(stats?.total_languages as string) || 0,
    avgScore: stats.avg_score ? Math.round(stats.avg_score) : 0,
    bestScore: stats.best_score ? Math.round(stats.best_score) : 0,
    totalViews: parseInt(stats?.total_views as string) || 0,
    totalComments: parseInt(stats?.total_comments as string) || 0,
    totalFavorites: parseInt(stats?.total_favorites as string) || 0,
  };
}

/**
 * Get roast score distribution
 */
export async function getScoreDistribution() {
  const result = await db.execute(sql`
    SELECT
      FLOOR(roast_score / 10) * 10 as scoreRange,
      COUNT(*) as count
    FROM roasts
    GROUP BY FLOOR(roast_score / 10)
    ORDER BY scoreRange ASC
  `);

  return result.rows.map((row: any) => ({
    scoreRange: row.scoreRange,
    count: parseInt(row.count as string) || 0,
  }));
}

/**
 * Get verdict distribution
 */
export async function getVerdictDistribution() {
  const result = await db.execute(sql`
    SELECT
      verdict,
      COUNT(*) as count
    FROM roasts
    WHERE verdict IS NOT NULL
    GROUP BY verdict
    ORDER BY count DESC
  `);

  return result.rows.map((row: any) => ({
    verdict: row.verdict,
    count: parseInt(row.count as string) || 0,
  }));
}

/**
 * Get trending roasts (by views in last 7 days)
 */
export async function getTrendingRoasts(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      u.id as userId,
      u.username,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName
    FROM roasts r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN languages l ON r.language_id = l.id
    WHERE r.created_at >= NOW() - INTERVAL '7 days'
    ORDER BY r.views_count DESC
    LIMIT ${limit}
  `);

  return result.rows;
}

/**
 * Get top rated roasts
 */
export async function getTopRatedRoasts(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      u.id as userId,
      u.username,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName
    FROM roasts r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN languages l ON r.language_id = l.id
    ORDER BY r.roast_score DESC
    LIMIT ${limit}
  `);

  return result.rows;
}

/**
 * Get most viewed roasts
 */
export async function getMostViewedRoasts(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      u.id as userId,
      u.username,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName
    FROM roasts r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN languages l ON r.language_id = l.id
    ORDER BY r.views_count DESC
    LIMIT ${limit}
  `);

  return result.rows;
}

/**
 * Get most favorited roasts
 */
export async function getMostFavoritedRoasts(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      r.id,
      r.code,
      r.roast_score as roastScore,
      r.verdict,
      r.roast_comment as roastComment,
      r.views_count as viewsCount,
      r.favorites_count as favoritesCount,
      r.created_at as createdAt,
      r.updated_at as updatedAt,
      u.id as userId,
      u.username,
      l.id as languageId,
      l.name as languageName,
      l.display_name as languageDisplayName
    FROM roasts r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN languages l ON r.language_id = l.id
    ORDER BY r.favorites_count DESC
    LIMIT ${limit}
  `);

  return result.rows;
}

/**
 * Get roasts by date (for insights)
 */
export async function getRoastsByDate(days = 30) {
  const result = await db.execute(sql`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as count,
      AVG(roast_score) as avgScore
    FROM roasts
    WHERE created_at >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `);

  return result.rows.map((row: any) => ({
    date: row.date,
    count: parseInt(row.count as string) || 0,
    avgScore: row.avgScore ? Math.round(row.avgScore) : 0,
  }));
}

/**
 * Get issue statistics
 */
export async function getIssueStats() {
  const result = await db.execute(sql`
    SELECT
      severity,
      COUNT(*) as count,
      COUNT(DISTINCT roast_id) as roasts_affected
    FROM issues
    GROUP BY severity
  `);

  return result.rows.map((row: any) => ({
    severity: row.severity,
    count: parseInt(row.count as string) || 0,
    roastsAffected: parseInt(row.roasts_affected as string) || 0,
  }));
}

/**
 * Get most common categories
 */
export async function getMostCommonCategories(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      category,
      COUNT(*) as count,
      COUNT(DISTINCT roast_id) as roasts_affected
    FROM issues
    GROUP BY category
    ORDER BY count DESC
    LIMIT ${limit}
  `);

  return result.rows.map((row: any) => ({
    category: row.category,
    count: parseInt(row.count as string) || 0,
    roastsAffected: parseInt(row.roasts_affected as string) || 0,
  }));
}

/**
 * Get featured roasts count
 */
export async function getFeaturedRoastsCount() {
  const result = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM roasts
    WHERE is_featured = true
  `);

  return parseInt((result.rows[0] as any)?.count as string) || 0;
}

/**
 * Get user engagement metrics
 */
export async function getUserEngagementMetrics() {
  const result = await db.execute(sql`
    SELECT
      COUNT(DISTINCT u.id) as total_users,
      COUNT(DISTINCT r.id) as total_roasts,
      COUNT(DISTINCT rc.id) as total_comments,
      COUNT(DISTINCT rf.id) as total_favorites,
      ROUND(CAST(COUNT(DISTINCT r.id) AS FLOAT) / NULLIF(COUNT(DISTINCT u.id), 0), 2) as avg_roasts_per_user,
      ROUND(CAST(COUNT(DISTINCT rc.id) AS FLOAT) / NULLIF(COUNT(DISTINCT r.id), 0), 2) as avg_comments_per_roast
    FROM users u
    LEFT JOIN roasts r ON u.id = r.user_id
    LEFT JOIN roast_comments rc ON r.id = rc.roast_id
    LEFT JOIN roast_favorites rf ON r.id = rf.roast_id
  `);

  const metrics = result.rows[0] as any;
  return {
    totalUsers: parseInt(metrics?.total_users as string) || 0,
    totalRoasts: parseInt(metrics?.total_roasts as string) || 0,
    totalComments: parseInt(metrics?.total_comments as string) || 0,
    totalFavorites: parseInt(metrics?.total_favorites as string) || 0,
    avgRoastsPerUser: parseFloat(metrics?.avg_roasts_per_user as string) || 0,
    avgCommentsPerRoast: parseFloat(metrics?.avg_comments_per_roast as string) || 0,
  };
}
