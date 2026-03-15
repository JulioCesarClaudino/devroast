import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

export const SEED_LANGUAGES = [
  { name: "javascript", displayName: "JavaScript", color: "#F7DF1E" },
  { name: "typescript", displayName: "TypeScript", color: "#3178C6" },
  { name: "python", displayName: "Python", color: "#3776AB" },
  { name: "java", displayName: "Java", color: "#007396" },
  { name: "csharp", displayName: "C#", color: "#239120" },
  { name: "cpp", displayName: "C++", color: "#00599C" },
  { name: "c", displayName: "C", color: "#A8B9CC" },
  { name: "rust", displayName: "Rust", color: "#CE422B" },
  { name: "go", displayName: "Go", color: "#00ADD8" },
  { name: "php", displayName: "PHP", color: "#777BB4" },
  { name: "ruby", displayName: "Ruby", color: "#CC342D" },
  { name: "swift", displayName: "Swift", color: "#FA7343" },
  { name: "kotlin", displayName: "Kotlin", color: "#7F52FF" },
  { name: "scala", displayName: "Scala", color: "#DC322F" },
  { name: "r", displayName: "R", color: "#276DC3" },
  { name: "sql", displayName: "SQL", color: "#336791" },
  { name: "html", displayName: "HTML", color: "#E34C26" },
  { name: "css", displayName: "CSS", color: "#563D7C" },
  { name: "bash", displayName: "Bash", color: "#4EAA25" },
  { name: "dockerfile", displayName: "Dockerfile", color: "#2496ED" },
];

/**
 * Seed database with default languages
 */
export async function seedLanguages() {
  try {
    console.log("Seeding languages...");

    for (const lang of SEED_LANGUAGES) {
      // Check if language already exists
      const existing = await db.execute(sql`
        SELECT id FROM languages WHERE name = ${lang.name}
      `);

      if (existing.rows.length > 0) {
        console.log(`⏭  ${lang.displayName} already exists, skipping...`);
        continue;
      }

      const languageId = uuidv4();

      await db.execute(sql`
        INSERT INTO languages (id, name, display_name, color)
        VALUES (${languageId}, ${lang.name}, ${lang.displayName}, ${lang.color})
      `);

      console.log(`✅ Seeded: ${lang.displayName}`);
    }

    console.log("\n✨ Language seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding languages:", error);
    throw error;
  }
}

// Run seeding if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seedLanguages().then(() => {
    console.log("\nDone!");
    process.exit(0);
  });
}
