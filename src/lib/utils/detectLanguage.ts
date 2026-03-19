import { LANGUAGES, type Language } from "@/lib/constants/languages";

interface DetectionScore {
  language: Language;
  score: number;
}

/**
 * Detecta a linguagem de programação do código fornecido
 * Retorna o objeto Language detectado ou null se não conseguir detectar
 */
export function detectLanguage(code: string): Language | null {
  const scores = detectLanguageScores(code);

  if (scores.length === 0) {
    return null;
  }

  const highestScore = scores[0];

  // Mínimo 3 pontos para considerar detectado
  if (highestScore.score < 3) {
    return null;
  }

  return highestScore.language;
}

/**
 * Detecta a linguagem e retorna apenas o ID
 */
export function detectLanguageId(code: string): string | null {
  const detected = detectLanguage(code);
  return detected ? detected.id : null;
}

/**
 * Calcula scores para cada linguagem
 * Retorna array ordenado por score descendente
 */
function detectLanguageScores(code: string): DetectionScore[] {
  const scores: Record<string, number> = {
    javascript: 0,
    python: 0,
    typescript: 0,
    php: 0,
    java: 0,
    go: 0,
    rust: 0,
    cpp: 0,
  };

  // Padrões Python (2 pontos cada)
  if (/^\s*def\s+\w+\s*\(/m.test(code)) scores.python += 2;
  if (/^\s*import\s+\w+/m.test(code) || /^\s*from\s+\w+\s+import/m.test(code)) scores.python += 2;
  if (/^\s*class\s+\w+/m.test(code)) scores.python += 2;
  if (/^\s*(for|while)\s+\w+\s+in\s+/m.test(code)) scores.python += 2;
  if (/^\s*if\s+.+:\s*$/m.test(code)) scores.python += 2;
  if (/:\s*$\n\s{4}/m.test(code)) scores.python += 1; // Indentation pattern

  // Padrões TypeScript (2 pontos cada)
  if (/interface\s+\w+\s*{/m.test(code)) scores.typescript += 2;
  if (/type\s+\w+\s*=/m.test(code)) scores.typescript += 2;
  if (/:\s*(string|number|boolean|any|void|never|unknown)\s*[,;=)]/m.test(code)) {
    scores.typescript += 2;
  }
  if (/<\w+(\s+\w+)?>/m.test(code)) scores.typescript += 1; // Generic types or JSX
  if (/\?\s*:/m.test(code)) scores.typescript += 1; // Optional properties

  // Padrões JavaScript (1.5 pontos cada)
  if (/(const|let|var)\s+\w+\s*=/m.test(code)) scores.javascript += 1.5;
  if (/=>\s*{?/m.test(code)) scores.javascript += 1.5; // Arrow functions
  if (/async\s+\w+|await\s+/m.test(code)) scores.javascript += 1.5;
  if (/Promise|\.then\(|\.catch\(/m.test(code)) scores.javascript += 1.5;
  if (/function\s+\w+\s*\(/m.test(code)) scores.javascript += 1;
  if (/console\.\w+\(/m.test(code)) scores.javascript += 1;

  // Padrões PHP (2 pontos cada)
  if (/<\?php|<\?=/.test(code)) scores.php += 2;
  if (/\$\w+\s*=/m.test(code)) scores.php += 2;
  if (/echo|print\s+/m.test(code)) scores.php += 1;
  if (/public\s+function|function\s+\w+\s*\(/m.test(code)) scores.php += 1;
  if (/namespace\s+\w+/m.test(code)) scores.php += 1;

  // Padrões Java (2 pontos cada)
  if (/public\s+class\s+\w+/m.test(code)) scores.java += 2;
  if (/public\s+static\s+void\s+main/m.test(code)) scores.java += 2;
  if (/import\s+java\./m.test(code)) scores.java += 2;
  if (/new\s+\w+\s*\(/m.test(code)) scores.java += 1;
  if (/extends|implements/m.test(code)) scores.java += 1;

  // Padrões Go (2 pontos cada)
  if (/package\s+\w+/m.test(code)) scores.go += 2;
  if (/func\s+\w+\s*\(/m.test(code)) scores.go += 2;
  if (/import\s+\(/m.test(code)) scores.go += 1;
  if (/^[a-zA-Z_]\w*\s*:=/m.test(code)) scores.go += 1; // Short variable declaration
  if (/defer\s+/m.test(code)) scores.go += 1;

  // Padrões Rust (2 pontos cada)
  if (/fn\s+\w+\s*\(/m.test(code)) scores.rust += 2;
  if (/let\s+(mut\s+)?\w+\s*=/m.test(code)) scores.rust += 2;
  if (/impl\s+\w+|trait\s+\w+/m.test(code)) scores.rust += 2;
  if (/struct\s+\w+/m.test(code)) scores.rust += 1;
  if (/&str|&\[/m.test(code)) scores.rust += 1;

  // Padrões C++ (2 pontos cada)
  if (/#include\s*</m.test(code)) scores.cpp += 2;
  if (/using\s+namespace\s+std/m.test(code)) scores.cpp += 2;
  if (/int\s+main\s*\(/m.test(code)) scores.cpp += 2;
  if (/std::cout|cout\s*<</m.test(code)) scores.cpp += 1;
  if (/vector<|map<|set</m.test(code)) scores.cpp += 1;

  // Bônus especiais
  if (/import\s+{.*?}\s+from/m.test(code)) scores.typescript += 1; // ES6 imports (mais comum em TS)
  if (/export\s+(default\s+)?(const|function|class)\s+/m.test(code)) scores.typescript += 0.5;

  // Converter para array e ordenar
  const result: DetectionScore[] = Object.entries(scores).map(([languageId, score]) => ({
    language: LANGUAGES[languageId as keyof typeof LANGUAGES],
    score,
  }));

  return result.sort((a, b) => b.score - a.score);
}
