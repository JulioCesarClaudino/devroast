"use server";

import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

/**
 * Get all issues for a roast sorted by severity
 */
export async function getIssuesByRoast(roastId: string) {
  const result = await db.execute(sql`
    SELECT
      id,
      roast_id as roastId,
      title,
      description,
      code_example as codeExample,
      severity,
      category,
      line_number as lineNumber,
      created_at as createdAt
    FROM issues
    WHERE roast_id = ${roastId}
    ORDER BY
      CASE severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        WHEN 'info' THEN 3
        ELSE 4
      END,
      created_at DESC
  `);

  return result.rows;
}

/**
 * Get single issue by ID
 */
export async function getIssueById(issueId: string) {
  const result = await db.execute(sql`
    SELECT
      id,
      roast_id as roastId,
      title,
      description,
      code_example as codeExample,
      severity,
      category,
      line_number as lineNumber,
      created_at as createdAt
    FROM issues
    WHERE id = ${issueId}
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Create new issue
 */
export async function createIssue(
  roastId: string,
  title: string,
  description: string,
  codeExample: string | null,
  severity: "critical" | "warning" | "info",
  category: string,
  lineNumber: number | null
) {
  const issueId = uuidv4();
  const now = new Date();

  const result = await db.execute(sql`
    INSERT INTO issues (
      id, roast_id, title, description, code_example, severity, category, line_number, created_at
    )
    VALUES (${issueId}, ${roastId}, ${title}, ${description}, ${codeExample}, ${severity}, ${category}, ${lineNumber}, ${now})
    RETURNING id, roast_id as roastId, title, description, code_example as codeExample, severity, category, line_number as lineNumber, created_at as createdAt
  `);

  // Update roast issue count
  await db.execute(sql`
    UPDATE roasts
    SET issue_count = issue_count + 1, updated_at = ${now}
    WHERE id = ${roastId}
  `);

  return result.rows[0] || null;
}

/**
 * Create multiple issues at once
 */
export async function createIssues(
  roastId: string,
  issues: Array<{
    title: string;
    description: string;
    codeExample?: string | null;
    severity: "critical" | "warning" | "info";
    category: string;
    lineNumber?: number | null;
  }>
) {
  const now = new Date();
  const createdIssues = [];

  for (const issue of issues) {
    const issueId = uuidv4();

    const result = await db.execute(sql`
      INSERT INTO issues (
        id, roast_id, title, description, code_example, severity, category, line_number, created_at
      )
      VALUES (
        ${issueId},
        ${roastId},
        ${issue.title},
        ${issue.description},
        ${issue.codeExample || null},
        ${issue.severity},
        ${issue.category},
        ${issue.lineNumber || null},
        ${now}
      )
      RETURNING id, roast_id as roastId, title, description, code_example as codeExample, severity, category, line_number as lineNumber, created_at as createdAt
    `);

    createdIssues.push(result.rows[0]);
  }

  // Update roast issue count
  await db.execute(sql`
    UPDATE roasts
    SET issue_count = issue_count + ${issues.length}, updated_at = ${now}
    WHERE id = ${roastId}
  `);

  return createdIssues;
}

/**
 * Update issue
 */
export async function updateIssue(
  issueId: string,
  title: string,
  description: string,
  codeExample: string | null,
  severity: "critical" | "warning" | "info",
  category: string,
  lineNumber: number | null
) {
  const result = await db.execute(sql`
    UPDATE issues
    SET
      title = ${title},
      description = ${description},
      code_example = ${codeExample},
      severity = ${severity},
      category = ${category},
      line_number = ${lineNumber}
    WHERE id = ${issueId}
    RETURNING id, roast_id as roastId, title, description, code_example as codeExample, severity, category, line_number as lineNumber, created_at as createdAt
  `);

  return result.rows[0] || null;
}

/**
 * Delete issue
 */
export async function deleteIssue(issueId: string) {
  const issue = await getIssueById(issueId);

  if (!issue) return null;

  const now = new Date();

  const result = await db.execute(sql`
    DELETE FROM issues
    WHERE id = ${issueId}
    RETURNING id
  `);

  // Update roast issue count
  await db.execute(sql`
    UPDATE roasts
    SET issue_count = GREATEST(issue_count - 1, 0), updated_at = ${now}
    WHERE id = ${issue.roastId}
  `);

  return result.rows[0] || null;
}

/**
 * Get issues by severity
 */
export async function getIssuesBySeverity(
  roastId: string,
  severity: "critical" | "warning" | "info"
) {
  const result = await db.execute(sql`
    SELECT
      id,
      roast_id as roastId,
      title,
      description,
      code_example as codeExample,
      severity,
      category,
      line_number as lineNumber,
      created_at as createdAt
    FROM issues
    WHERE roast_id = ${roastId} AND severity = ${severity}
    ORDER BY created_at DESC
  `);

  return result.rows;
}

/**
 * Get issue count by severity for a roast
 */
export async function getIssueCounts(roastId: string) {
  const result = await db.execute(sql`
    SELECT
      severity,
      COUNT(*) as count
    FROM issues
    WHERE roast_id = ${roastId}
    GROUP BY severity
  `);

  const counts = {
    critical: 0,
    warning: 0,
    info: 0,
  };

  for (const row of result.rows as any[]) {
    counts[row.severity as keyof typeof counts] = parseInt(row.count as string) || 0;
  }

  return counts;
}
