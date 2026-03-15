"use server";

import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

/**
 * Get comments for a roast with user info (paginated)
 */
export async function getCommentsByRoast(roastId: string, limit = 20, offset = 0) {
  const countResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM roast_comments
    WHERE roast_id = ${roastId}
  `);

  const total = parseInt((countResult.rows[0] as any)?.count as string) || 0;

  const result = await db.execute(sql`
    SELECT
      rc.id,
      rc.content,
      rc.likes_count as likesCount,
      rc.created_at as createdAt,
      rc.updated_at as updatedAt,
      u.id as userId,
      u.username,
      u.email
    FROM roast_comments rc
    LEFT JOIN users u ON rc.user_id = u.id
    WHERE rc.roast_id = ${roastId}
    ORDER BY rc.likes_count DESC, rc.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return { data: result.rows, total, limit, offset };
}

/**
 * Get single comment by ID
 */
export async function getCommentById(commentId: string) {
  const result = await db.execute(sql`
    SELECT
      rc.id,
      rc.roast_id as roastId,
      rc.user_id as userId,
      rc.content,
      rc.likes_count as likesCount,
      rc.created_at as createdAt,
      rc.updated_at as updatedAt,
      u.username
    FROM roast_comments rc
    LEFT JOIN users u ON rc.user_id = u.id
    WHERE rc.id = ${commentId}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Create new comment on a roast
 */
export async function createComment(roastId: string, userId: string, content: string) {
  const commentId = uuidv4();
  const now = new Date();

  // Insert comment
  const result = await db.execute(sql`
    INSERT INTO roast_comments (id, roast_id, user_id, content, likes_count, created_at, updated_at)
    VALUES (${commentId}, ${roastId}, ${userId}, ${content}, 0, ${now}, ${now})
    RETURNING id, roast_id as roastId, user_id as userId, content, likes_count as likesCount, created_at as createdAt, updated_at as updatedAt
  `);

  // Update roast comments count
  await db.execute(sql`
    UPDATE roasts
    SET comments_count = comments_count + 1, updated_at = ${now}
    WHERE id = ${roastId}
  `);

  return result.rows[0] || null;
}

/**
 * Update comment content
 */
export async function updateComment(commentId: string, content: string) {
  const now = new Date();

  const result = await db.execute(sql`
    UPDATE roast_comments
    SET content = ${content}, updated_at = ${now}
    WHERE id = ${commentId}
    RETURNING id, roast_id as roastId, user_id as userId, content, likes_count as likesCount, created_at as createdAt, updated_at as updatedAt
  `);

  return result.rows[0] || null;
}

/**
 * Increment comment likes
 */
export async function incrementCommentLikes(commentId: string) {
  const now = new Date();

  const result = await db.execute(sql`
    UPDATE roast_comments
    SET likes_count = likes_count + 1, updated_at = ${now}
    WHERE id = ${commentId}
    RETURNING id, likes_count as likesCount
  `);

  return result.rows[0] || null;
}

/**
 * Decrement comment likes
 */
export async function decrementCommentLikes(commentId: string) {
  const now = new Date();

  const result = await db.execute(sql`
    UPDATE roast_comments
    SET likes_count = GREATEST(likes_count - 1, 0), updated_at = ${now}
    WHERE id = ${commentId}
    RETURNING id, likes_count as likesCount
  `);

  return result.rows[0] || null;
}

/**
 * Delete comment
 */
export async function deleteComment(commentId: string) {
  // Get the comment first to know which roast to update
  const commentData = await getCommentById(commentId);

  if (!commentData) return null;

  const now = new Date();

  // Delete the comment
  const result = await db.execute(sql`
    DELETE FROM roast_comments
    WHERE id = ${commentId}
    RETURNING id
  `);

  // Update roast comments count
  if (commentData.roastId) {
    await db.execute(sql`
      UPDATE roasts
      SET comments_count = GREATEST(comments_count - 1, 0), updated_at = ${now}
      WHERE id = ${commentData.roastId}
    `);
  }

  return result.rows[0] || null;
}

/**
 * Get comments by user
 */
export async function getCommentsByUser(userId: string, limit = 20, offset = 0) {
  const countResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM roast_comments
    WHERE user_id = ${userId}
  `);

  const total = parseInt((countResult.rows[0] as any)?.count as string) || 0;

  const result = await db.execute(sql`
    SELECT
      rc.id,
      rc.roast_id as roastId,
      rc.content,
      rc.likes_count as likesCount,
      rc.created_at as createdAt,
      rc.updated_at as updatedAt,
      r.code as roastCode,
      r.roast_score as roastScore,
      r.verdict
    FROM roast_comments rc
    LEFT JOIN roasts r ON rc.roast_id = r.id
    WHERE rc.user_id = ${userId}
    ORDER BY rc.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return { data: result.rows, total, limit, offset };
}
