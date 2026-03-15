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
