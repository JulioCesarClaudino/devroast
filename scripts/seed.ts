#!/usr/bin/env tsx

/**
 * Database Seed Manager
 *
 * Uso:
 *   tsx scripts/seed.ts languages      # Seed apenas linguagens
 *   tsx scripts/seed.ts roasts         # Seed apenas roasts
 *   tsx scripts/seed.ts all            # Seed completo
 */

import { seedLanguages } from "@/db/seeds/languages";
import { seedDatabase } from "@/db/seeds/roasts";

async function main() {
  const command = process.argv[2] || "all";

  console.log(`\n🌱 DevRoast Database Seeding\n`);
  console.log(`Command: ${command}\n`);

  try {
    switch (command.toLowerCase()) {
      case "languages":
        console.log("📚 Seeding languages...\n");
        await seedLanguages();
        break;

      case "roasts":
        console.log("🔥 Seeding roasts and analytics...\n");
        await seedDatabase();
        break;

      case "all":
      case "full":
        console.log("📦 Running complete seed (languages + roasts)...\n");
        console.log("Step 1/2: Languages");
        console.log("─".repeat(50));
        await seedLanguages();

        console.log("\nStep 2/2: Roasts and Analytics");
        console.log("─".repeat(50));
        await seedDatabase();
        break;

      case "--help":
      case "-h":
      case "help":
        showHelp();
        break;

      default:
        console.error(`❌ Unknown command: ${command}\n`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`Usage: tsx scripts/seed.ts [command]

Commands:
  languages       Seed only programming languages (20 entries)
  roasts          Seed only roasts with analytics (100+ entries)
  all             Seed everything (languages + roasts) - default
  full            Alias for 'all'
  help            Show this help message

Examples:
  tsx scripts/seed.ts                 # Full seed
  tsx scripts/seed.ts languages       # Only languages
  tsx scripts/seed.ts roasts          # Only roasts
  
Using npm scripts:
  npm run db:seed                     # Full seed
  npm run db:seed:languages           # Only languages
  npm run db:seed:roasts              # Only roasts
`);
}

main();
