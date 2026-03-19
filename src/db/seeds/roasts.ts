import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

// Severidades de issues
const ISSUE_SEVERITIES = ["critical", "warning", "info"] as const;

// Categorias de issues
const ISSUE_CATEGORIES = [
  "performance",
  "security",
  "readability",
  "maintainability",
  "naming",
  "logic",
  "memory",
  "error_handling",
  "concurrency",
  "documentation",
];

// Exemplos de código ruim
const BAD_CODE_SAMPLES = [
  "eval(prompt('enter code'))",
  "if (x == true) { return true; } else if (x == false) { return false; }",
  "SELECT * FROM users WHERE 1=1",
  "const arr = []; for(let i = 0; i < 1000000; i++) arr.push(i);",
  "function getData() { var x = 1; var x = 2; return x; }",
  "try { } catch(e) { }",
  "setTimeout(() => { location.href = 'http://...'; }, 1000)",
  "var global_var = 123; global_var = 456;",
  "function x(){function y(){function z(){return 1;}}}",
  "const password = 'admin123'; const apiKey = '12345';",
  "document.innerHTML = userInput;",
  "while(true) { doSomething(); }",
  "if(condition) { if(condition2) { if(condition3) { /* nested */ } } }",
  "const data = JSON.parse(response);",
  "function* generator() { yield 1; yield 2; yield 3; }",
  "const promise = new Promise(() => {});",
  "Object.prototype.customMethod = function() {};",
  "const arr = new Array(10000);",
  "setInterval(() => { fetch('api/data'); }, 100);",
  "for(let i = 0; i < arr.length; i++) { arr[i] = arr.indexOf(arr[i]); }",
];

// Linguagens padrão
const LANGUAGES = [
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
 * Gerar um roast score entre 1 e 10
 */
function generateRoastScore(): number {
  return faker.datatype.number({ min: 1, max: 10 });
}

/**
 * Gerar um verdict baseado no score
 */
function getVerdictFromScore(score: number): string {
  if (score <= 2) return "needs_serious_help";
  if (score <= 4) return "not_great";
  if (score <= 6) return "could_be_better";
  if (score <= 8) return "acceptable";
  return "pretty_good";
}

/**
 * Gerar um comentário de roast realista
 */
function generateRoastComment(): string {
  const comments = [
    "Este código é uma mistura perigosa de má prática e criatividade questionável.",
    "Se esta fosse uma competição de código ruim, você seria campeão.",
    "Seu código fez meu linter chorar. Literal.",
    "Este é o tipo de código que aparece em pesadelos dos DevOps.",
    "Parabéns! Você conseguiu fazer O(n²) em O(n) operações.",
    "Este código é tão seguro quanto uma porta de vidro em um banco.",
    "A complexidade ciclomática deste código rivaliza com um labirinto medieval.",
    "Se Stack Overflow fosse um videogame, este seria o último nível.",
    "Este é provavelmente o motivo pelo qual o seu projeto foi cancelado.",
    "Seu código conseguiu fazer meu compilador ficar em silêncio contemplativo.",
    "Este é o tipo de código que faz você questionar suas escolhas de vida.",
    "Parabéns por descobrir uma nova maneira de quebrar computadores.",
    "Este código é tão confuso que nem você saberia explicar.",
    "Se este fosse um detector de fumbo, teria quebrado.",
    "Seu código é a prova viva de que nem tudo que é possível fazer, deveria ser feito.",
    "Este código é tão denso que poderia colapsar em um buraco negro.",
    "Se eu tivesse um euro para cada bug potencial aqui, seria rico.",
    "Este é o tipo de código que faz você se questionar sobre tudo na vida.",
    "Parabéns! Você conseguiu fazer SQL injection parecer seguro.",
    "Se existisse um campeonato de código ruim, isso seria ouro puro.",
  ];

  return faker.helpers.arrayElement(comments);
}

/**
 * Gerar issues para um roast
 */
function generateIssues(count: number = faker.datatype.number({ min: 1, max: 5 })) {
  const issues = [];

  for (let i = 0; i < count; i++) {
    const severity = faker.helpers.arrayElement(ISSUE_SEVERITIES);
    const category = faker.helpers.arrayElement(ISSUE_CATEGORIES);

    issues.push({
      id: uuidv4(),
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      codeExample: faker.helpers.arrayElement(BAD_CODE_SAMPLES),
      severity,
      category,
      lineNumber: faker.datatype.number({ min: 1, max: 100 }),
    });
  }

  return issues;
}

/**
 * Gerar sugestões para um roast
 */
function generateSuggestions(count: number = faker.datatype.number({ min: 0, max: 3 })) {
  const suggestions = [];

  for (let i = 0; i < count; i++) {
    suggestions.push({
      id: uuidv4(),
      title: faker.company.catchPhrase(),
      originalCode: faker.helpers.arrayElement(BAD_CODE_SAMPLES),
      improvedCode: faker.lorem.sentence(),
      explanation: faker.lorem.paragraph(),
      priority: faker.helpers.arrayElement(["high", "medium", "low"]),
    });
  }

  return suggestions;
}

/**
 * Seed do banco de dados
 */
export async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...\n");

    // Passo 1: Verificar/criar usuários
    console.log("📝 Etapa 1/5: Criando usuários...");
    const users = [];
    const userCount = 20; // 20 usuários

    for (let i = 0; i < userCount; i++) {
      const userId = uuidv4();
      const username = faker.internet.userName().toLowerCase();
      const email = faker.internet.email();
      const now = new Date();

      await db.execute(sql`
        INSERT INTO users (id, username, email, created_at, updated_at)
        VALUES (${userId}, ${username}, ${email}, ${now}, ${now})
        ON CONFLICT (username) DO NOTHING
      `);

      users.push({ id: userId, username, email });
    }

    console.log(`✅ ${users.length} usuários criados\n`);

    // Passo 2: Verificar/criar linguagens
    console.log("📝 Etapa 2/5: Criando linguagens...");
    const languages = [];

    for (const lang of LANGUAGES) {
      const langId = uuidv4();

      await db.execute(sql`
        INSERT INTO languages (id, name, display_name, color)
        VALUES (${langId}, ${lang.name}, ${lang.displayName}, ${lang.color})
        ON CONFLICT (name) DO NOTHING
      `);

      languages.push({ id: langId, ...lang });
    }

    console.log(`✅ ${languages.length} linguagens criadas\n`);

    // Passo 3: Criar roasts
    console.log("📝 Etapa 3/5: Criando 100 roasts...");
    const roasts = [];
    const roastCount = 100;

    for (let i = 0; i < roastCount; i++) {
      const roastId = uuidv4();
      const userId = faker.datatype.boolean({ probability: 0.7 })
        ? faker.helpers.arrayElement(users).id
        : null;
      const languageId = faker.helpers.arrayElement(languages).id;
      const score = generateRoastScore();
      const verdict = getVerdictFromScore(score);
      const code = faker.helpers.arrayElement(BAD_CODE_SAMPLES);
      const comment = generateRoastComment();
      const issueCount = faker.datatype.number({ min: 1, max: 5 });
      const viewsCount = faker.datatype.number({ min: 0, max: 5000 });
      const favoritesCount = faker.datatype.number({ min: 0, max: 500 });
      const commentsCount = faker.datatype.number({ min: 0, max: 50 });
      const isFeatured = faker.datatype.boolean({ probability: 0.05 });

      const createdAt = faker.date.past({ years: 1 });
      const updatedAt = new Date(
        createdAt.getTime() + faker.datatype.number({ min: 0, max: 1000000 })
      );

      await db.execute(sql`
        INSERT INTO roasts (
          id, user_id, language_id, code, roast_score, verdict,
          roast_comment, issue_count, views_count, favorites_count,
          comments_count, is_featured, created_at, updated_at
        )
        VALUES (
          ${roastId}, ${userId}, ${languageId}, ${code}, ${score}, ${verdict},
          ${comment}, ${issueCount}, ${viewsCount}, ${favoritesCount},
          ${commentsCount}, ${isFeatured}, ${createdAt}, ${updatedAt}
        )
      `);

      roasts.push({ id: roastId });

      // Progress indicator a cada 10 roasts
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  ${i + 1}/${roastCount} roasts criados...`);
      }
    }

    console.log(`\r✅ ${roastCount} roasts criados                  \n`);

    // Passo 4: Criar issues para cada roast
    console.log("📝 Etapa 4/5: Criando issues para roasts...");
    let totalIssues = 0;

    for (let i = 0; i < roasts.length; i++) {
      const roastId = roasts[i].id;
      const issues = generateIssues();

      for (const issue of issues) {
        await db.execute(sql`
          INSERT INTO issues (
            id, roast_id, title, description, code_example,
            severity, category, line_number, created_at
          )
          VALUES (
            ${issue.id}, ${roastId}, ${issue.title}, ${issue.description},
            ${issue.codeExample}, ${issue.severity}, ${issue.category},
            ${issue.lineNumber}, NOW()
          )
        `);
        totalIssues++;
      }

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  ${i + 1}/${roasts.length} roasts processados...`);
      }
    }

    console.log(`\r✅ ${totalIssues} issues criadas                  \n`);

    // Passo 5: Criar sugestões de melhoria
    console.log("📝 Etapa 5/5: Criando sugestões de melhoria...");
    let totalSuggestions = 0;

    for (let i = 0; i < roasts.length; i++) {
      const roastId = roasts[i].id;
      const suggestions = generateSuggestions();

      for (const suggestion of suggestions) {
        await db.execute(sql`
          INSERT INTO roast_suggestions (
            id, roast_id, title, original_code, improved_code,
            explanation, priority, created_at
          )
          VALUES (
            ${suggestion.id}, ${roastId}, ${suggestion.title},
            ${suggestion.originalCode}, ${suggestion.improvedCode},
            ${suggestion.explanation}, ${suggestion.priority}, NOW()
          )
        `);
        totalSuggestions++;
      }

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  ${i + 1}/${roasts.length} roasts processados...`);
      }
    }

    console.log(`\r✅ ${totalSuggestions} sugestões criadas                  \n`);

    // Passo 6: Criar comentários (opcional)
    console.log("📝 Etapa 6/6: Criando comentários...");
    let totalComments = 0;

    for (let i = 0; i < roasts.length; i++) {
      const roastId = roasts[i].id;
      const commentCount = faker.datatype.number({ min: 0, max: 5 });

      for (let j = 0; j < commentCount; j++) {
        const commentId = uuidv4();
        const userId = faker.helpers.arrayElement(users).id;
        const content = faker.lorem.sentence();
        const likesCount = faker.datatype.number({ min: 0, max: 100 });
        const createdAt = faker.date.recent({ days: 30 });

        await db.execute(sql`
          INSERT INTO roast_comments (
            id, roast_id, user_id, content, likes_count, created_at, updated_at
          )
          VALUES (
            ${commentId}, ${roastId}, ${userId}, ${content}, ${likesCount}, ${createdAt}, ${createdAt}
          )
        `);
        totalComments++;
      }

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  ${i + 1}/${roasts.length} roasts processados...`);
      }
    }

    console.log(`\r✅ ${totalComments} comentários criados                  \n`);

    // Resumo final
    console.log("═".repeat(70));
    console.log("✨ SEED CONCLUÍDO COM SUCESSO!");
    console.log("═".repeat(70));
    console.log("\n📊 Resumo dos dados criados:\n");
    console.log(`  👥 Usuários:              ${users.length}`);
    console.log(`  📚 Linguagens:            ${languages.length}`);
    console.log(`  🔥 Roasts:                ${roastCount}`);
    console.log(`  ⚠️  Issues:                ${totalIssues}`);
    console.log(`  💡 Sugestões:             ${totalSuggestions}`);
    console.log(`  💬 Comentários:           ${totalComments}`);
    console.log("\n═".repeat(70));
    console.log("✅ Banco de dados está pronto para uso!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro durante o seed:", error);
    console.error(error);
    process.exit(1);
  }
}

// Executar se este for o arquivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
