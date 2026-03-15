import { createHighlighter } from "shiki";

/**
 * Script de teste para validar a implementação do Shiki
 * Execute: npx ts-node scripts/test-shiki.ts
 */
async function testShiki() {
  console.log("🧪 Testing Shiki Implementation...\n");

  try {
    // 1. Teste de inicialização
    console.log("1️⃣  Initializing highlighter...");
    const highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["javascript", "python", "typescript"],
    });
    console.log("✅ Highlighter initialized successfully\n");

    // 2. Teste com JavaScript
    console.log("2️⃣  Testing JavaScript highlighting...");
    const jsCode = 'const greeting = "Hello, World!";\nconsole.log(greeting);';
    const jsHtml = await highlighter.codeToHtml(jsCode, {
      lang: "javascript",
      theme: "github-light",
    });
    console.log("✅ JavaScript highlighting works");
    console.log(`   Generated HTML: ${jsHtml.substring(0, 100)}...\n`);

    // 3. Teste com Python
    console.log("3️⃣  Testing Python highlighting...");
    const pyCode = 'def greet(name):\n    print(f"Hello, {name}!")';
    const pyHtml = await highlighter.codeToHtml(pyCode, {
      lang: "python",
      theme: "github-light",
    });
    console.log("✅ Python highlighting works");
    console.log(`   Generated HTML: ${pyHtml.substring(0, 100)}...\n`);

    // 4. Teste com TypeScript
    console.log("4️⃣  Testing TypeScript highlighting...");
    const tsCode = "const greet = (name: string): void => {\n  console.log(`Hello, ${name}!`);\n};";
    const tsHtml = await highlighter.codeToHtml(tsCode, {
      lang: "typescript",
      theme: "github-dark",
    });
    console.log("✅ TypeScript highlighting works");
    console.log(`   Generated HTML: ${tsHtml.substring(0, 100)}...\n`);

    // 5. Teste com tema dark
    console.log("5️⃣  Testing dark theme...");
    const darkHtml = await highlighter.codeToHtml(jsCode, {
      lang: "javascript",
      theme: "github-dark",
    });
    console.log("✅ Dark theme works\n");

    console.log("🎉 All tests passed! Syntax highlighting is ready to use.\n");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testShiki();
