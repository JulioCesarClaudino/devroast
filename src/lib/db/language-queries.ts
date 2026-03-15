"use server";

import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

/**
 * Get all languages
 */
export async function getAllLanguages() {
  const result = await db.execute(sql`
    SELECT
      id,
      name,
      display_name as displayName,
      color
    FROM languages
    ORDER BY display_name ASC
  `);

  return result.rows;
}

/**
 * Get language by ID
 */
export async function getLanguageById(languageId: string) {
  const result = await db.execute(sql`
    SELECT
      id,
      name,
      display_name as displayName,
      color
    FROM languages
    WHERE id = ${languageId}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Get language by name
 */
export async function getLanguageByName(name: string) {
  const result = await db.execute(sql`
    SELECT
      id,
      name,
      display_name as displayName,
      color
    FROM languages
    WHERE name = ${name}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Create new language
 */
export async function createLanguage(name: string, displayName: string, color: string) {
  const languageId = uuidv4();

  const result = await db.execute(sql`
    INSERT INTO languages (id, name, display_name, color)
    VALUES (${languageId}, ${name}, ${displayName}, ${color})
    RETURNING id, name, display_name as displayName, color
  `);

  return result.rows[0] || null;
}

/**
 * Update language
 */
export async function updateLanguage(languageId: string, displayName: string, color: string) {
  const result = await db.execute(sql`
    UPDATE languages
    SET display_name = ${displayName}, color = ${color}
    WHERE id = ${languageId}
    RETURNING id, name, display_name as displayName, color
  `);

  return result.rows[0] || null;
}

/**
 * Get languages with roast counts
 */
export async function getLanguagesWithCounts() {
  const result = await db.execute(sql`
    SELECT
      l.id,
      l.name,
      l.display_name as displayName,
      l.color,
      COUNT(r.id) as roastCount
    FROM languages l
    LEFT JOIN roasts r ON l.id = r.language_id
    GROUP BY l.id, l.name, l.display_name, l.color
    ORDER BY roastCount DESC, l.display_name ASC
  `);

  return result.rows.map((row) => ({
    ...row,
    roastCount: parseInt(row.roastCount as string) || 0,
  }));
}

/**
 * Get popular languages (with most roasts)
 */
export async function getPopularLanguages(limit = 10) {
  const result = await db.execute(sql`
    SELECT
      l.id,
      l.name,
      l.display_name as displayName,
      l.color,
      COUNT(r.id) as roastCount,
      AVG(r.roast_score) as avgScore
    FROM languages l
    LEFT JOIN roasts r ON l.id = r.language_id
    GROUP BY l.id, l.name, l.display_name, l.color
    ORDER BY roastCount DESC
    LIMIT ${limit}
  `);

  return result.rows.map((row: any) => ({
    ...row,
    roastCount: parseInt(row.roastCount as string) || 0,
    avgScore: row.avgScore ? Math.round(row.avgScore as number) : 0,
  }));
}

/**
 * Delete language
 */
export async function deleteLanguage(languageId: string) {
  const result = await db.execute(sql`
    DELETE FROM languages
    WHERE id = ${languageId}
    RETURNING id
  `);

  return result.rows[0] || null;
}
