import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import type { Issue, Roast, RoastComment, RoastSuggestion } from "@/db/schema";

/**
 * Get roast by ID with all related data
 * Uses pure SQL joins to fetch roast, language, user, issues, suggestions, and comments
 */
export async function getRoastById(roastId: string) {
  const result = await db.execute(sql`
    SELECT 
      r.id,
      r.user_id,
      r.code,
      r.language_id,
      r.roast_score,
      r.verdict,
      r.roast_comment,
      r.issue_count,
      r.views_count,
      r.favorites_count,
      r.comments_count,
      r.is_featured,
      r.created_at,
      r.updated_at,
      l.name as language_name,
      l.display_name as language_display_name,
      l.color as language_color,
      u.username,
      u.email
    FROM roasts r
    LEFT JOIN languages l ON r.language_id = l.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ${roastId}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Get roasts with pagination
 * Returns roasts ordered by creation date (newest first)
 */
export async function getRoasts(limit: number = 20, offset: number = 0) {
  const result = await db.execute(sql`
    SELECT 
      r.id,
      r.user_id,
      r.code,
      r.language_id,
      r.roast_score,
      r.verdict,
      r.roast_comment,
      r.issue_count,
      r.views_count,
      r.favorites_count,
      r.comments_count,
      r.is_featured,
      r.created_at,
      r.updated_at,
      l.name as language_name,
      l.display_name as language_display_name,
      u.username
    FROM roasts r
    LEFT JOIN languages l ON r.language_id = l.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.rows;
}

/**
 * Get leaderboard - Roasts sorted by score (worst/most roasted first)
 */
export async function getLeaderboard(limit: number = 20, offset: number = 0) {
  const result = await db.execute(sql`
    SELECT 
      r.id,
      r.user_id,
      r.code,
      r.language_id,
      r.roast_score,
      r.verdict,
      r.roast_comment,
      r.issue_count,
      r.views_count,
      r.favorites_count,
      r.comments_count,
      r.created_at,
      l.name as language_name,
      l.display_name as language_display_name,
      l.color as language_color,
      u.username,
      CHAR_LENGTH(r.code) as code_length
    FROM roasts r
    LEFT JOIN languages l ON r.language_id = l.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.roast_score ASC, r.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.rows;
}

/**
 * Get roasts by language
 */
export async function getRoastsByLanguage(
  languageName: string,
  limit: number = 20,
  offset: number = 0
) {
  const result = await db.execute(sql`
    SELECT 
      r.id,
      r.user_id,
      r.code,
      r.language_id,
      r.roast_score,
      r.verdict,
      r.roast_comment,
      r.issue_count,
      r.views_count,
      r.favorites_count,
      r.comments_count,
      r.created_at,
      l.name as language_name,
      l.display_name as language_display_name,
      l.color as language_color,
      u.username
    FROM roasts r
    JOIN languages l ON r.language_id = l.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE LOWER(l.name) = LOWER(${languageName})
    ORDER BY r.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.rows;
}

/**
 * Increment views count for a roast
 */
export async function incrementRoastViews(roastId: string) {
  await db.execute(sql`
    UPDATE roasts
    SET views_count = views_count + 1, updated_at = NOW()
    WHERE id = ${roastId}
  `);
}

/**
 * Get issues for a roast
 */
export async function getIssuesByRoast(roastId: string) {
  const result = await db.execute(sql`
    SELECT 
      id,
      roast_id,
      title,
      description,
      code_example,
      severity,
      category,
      line_number,
      created_at
    FROM issues
    WHERE roast_id = ${roastId}
    ORDER BY 
      CASE severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        WHEN 'info' THEN 3
        ELSE 4
      END,
      created_at ASC
  `);

  return result.rows as Issue[];
}

/**
 * Get suggestions for a roast
 */
export async function getSuggestionsByRoast(roastId: string) {
  const result = await db.execute(sql`
    SELECT 
      id,
      roast_id,
      title,
      original_code,
      improved_code,
      explanation,
      priority,
      created_at
    FROM roast_suggestions
    WHERE roast_id = ${roastId}
    ORDER BY 
      CASE priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
        ELSE 4
      END,
      created_at ASC
  `);

  return result.rows as RoastSuggestion[];
}

/**
 * Get comments for a roast with user info
 */
export async function getCommentsByRoast(roastId: string, limit: number = 50, offset: number = 0) {
  const result = await db.execute(sql`
    SELECT 
      rc.id,
      rc.roast_id,
      rc.user_id,
      rc.content,
      rc.likes_count,
      rc.created_at,
      rc.updated_at,
      u.username
    FROM roast_comments rc
    LEFT JOIN users u ON rc.user_id = u.id
    WHERE rc.roast_id = ${roastId}
    ORDER BY rc.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.rows as (RoastComment & { username?: string | null })[];
}

/**
 * Get count of roasts
 */
export async function getRoastsCount() {
  const result = await db.execute(sql`
    SELECT COUNT(*) as count FROM roasts
  `);

  return parseInt((result.rows[0] as any)?.count || "0", 10);
}

/**
 * Get average roast score
 */
export async function getAverageRoastScore() {
  const result = await db.execute(sql`
    SELECT AVG(roast_score) as avg_score FROM roasts
  `);

  return parseFloat((result.rows[0] as any)?.avg_score || "0");
}

/**
 * Get roast distribution by verdict
 */
export async function getRoastsByVerdictDistribution() {
  const result = await db.execute(sql`
    SELECT 
      verdict,
      COUNT(*) as count
    FROM roasts
    GROUP BY verdict
    ORDER BY COUNT(*) DESC
  `);

  return result.rows;
}

/**
 * Insert a new roast
 */
export async function createRoast(data: {
  userId?: string;
  code: string;
  languageId: string;
  roastScore: number;
  verdict: string;
  roastComment: string;
  issueCount?: number;
}) {
  const result = await db.execute(sql`
    INSERT INTO roasts (
      user_id,
      code,
      language_id,
      roast_score,
      verdict,
      roast_comment,
      issue_count,
      created_at,
      updated_at
    ) VALUES (
      ${data.userId || null},
      ${data.code},
      ${data.languageId},
      ${data.roastScore},
      ${data.verdict},
      ${data.roastComment},
      ${data.issueCount || 0},
      NOW(),
      NOW()
    )
    RETURNING *
  `);

  return result.rows[0];
}

/**
 * Update roast counts
 */
export async function updateRoastCounts(
  roastId: string,
  updates: Partial<{ issueCount: number; favoritesCount: number; commentsCount: number }>
) {
  const setClauses: string[] = [];
  const values: (string | number)[] = [roastId];
  let valueIndex = 1;

  if (updates.issueCount !== undefined) {
    valueIndex++;
    setClauses.push(`issue_count = $${valueIndex}`);
    values.push(updates.issueCount);
  }

  if (updates.favoritesCount !== undefined) {
    valueIndex++;
    setClauses.push(`favorites_count = $${valueIndex}`);
    values.push(updates.favoritesCount);
  }

  if (updates.commentsCount !== undefined) {
    valueIndex++;
    setClauses.push(`comments_count = $${valueIndex}`);
    values.push(updates.commentsCount);
  }

  if (setClauses.length === 0) return;

  setClauses.push("updated_at = NOW()");

  const query = `
    UPDATE roasts
    SET ${setClauses.join(", ")}
    WHERE id = $1
    RETURNING *
  `;

  const result = await db.execute(sql.raw(query));
  return result.rows[0];
}
