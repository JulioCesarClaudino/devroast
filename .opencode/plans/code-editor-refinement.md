# 🎯 PLANO DE REFINAMENTO - DevRoast Code Editor

## Resumo das Decisões do Usuário

✅ **1. Linguagens**: Adicionar Top 5 mais populares (PHP, Java, Go, Rust, C++)
✅ **2. Default Select**: Começar SEM seleção (permitir detecção automática)
✅ **3. Estrutura**: Renomear `/src/app/components/` → `/src/app/design-system/`
✅ **4. Documentação**: Manter JSDoc nos arquivos .tsx
✅ **5. Lint**: Priorizar correção de "Comments inside children..."

---

## FASE 1: Adicionar Novas Linguagens

### 1.1 Atualizar `src/lib/constants/languages.ts`

**Adicionar 5 linguagens:**
```typescript
// Existentes (manter):
- JavaScript
- Python
- TypeScript

// Novos (adicionar):
- PHP (php)
- Java (java)
- Go (go)
- Rust (rust)
- C++ (cpp)
```

**Atualizar:**
- `LANGUAGES` object com 8 linguagens
- `LANGUAGE_LIST` export com todas as 8
- `DEFAULT_LANGUAGE` continua sendo `JavaScript`

### 1.2 Atualizar `src/lib/hooks/useHighlighter.ts`

**Modificar:**
```typescript
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["javascript", "python", "typescript", "php", "java", "go", "rust", "cpp"],
  // Antes: 3 langs
  // Depois: 8 langs
});
```

### 1.3 Atualizar `src/lib/utils/detectLanguage.ts`

**Adicionar padrões para 5 linguagens novas:**

**PHP patterns:**
- `<?php`, `echo`, `$var`, `function name()`, `class Name {}`, `->`

**Java patterns:**
- `public class`, `public static void main`, `import java`, `String`, `new`, `extends`

**Go patterns:**
- `package main`, `func name()`, `import (`, `:=`, `go routine`, `defer`

**Rust patterns:**
- `fn main()`, `let`, `mut`, `impl`, `trait`, `struct`, `->`, `::`, `&str`

**C++ patterns:**
- `#include`, `using namespace std`, `int main()`, `cout`, `vector<`, `::`, `auto`

---

## FASE 2: Mudar Default do Select para VAZIO

### 2.1 Modificar `src/components/home/language-selector.tsx`

**Adicionar estado "none":**
```typescript
// Opção especial no select:
<option value="none">Auto-detect language</option>

// Quando valor é "none", não fazer nada no onChange
// A detecção automática funciona no code-editor.tsx
```

### 2.2 Atualizar `src/components/home/code-editor.tsx`

**Mudanças:**
```typescript
// Antes:
const [selectedLanguage, setSelectedLanguage] = 
  React.useState<Language>(DEFAULT_LANGUAGE);

// Depois:
const [selectedLanguage, setSelectedLanguage] = 
  React.useState<Language | null>(null);

// Lógica de detecção:
// Se selectedLanguage === null:
//   - Auto-detecta quando user digita código
//   - Se detectar, atualiza selectedLanguage
//   - Se não detectar, usa DEFAULT_LANGUAGE para highlight
```

---

## FASE 3: Renomear `/src/app/components/` → `/src/app/design-system/`

### 3.1 Mover Pasta

```bash
mv src/app/components/ src/app/design-system/
```

### 3.2 Atualizar Rota

**Antes:**
- URL: `/components`
- Arquivo: `src/app/components/page.tsx`

**Depois:**
- URL: `/design-system`
- Arquivo: `src/app/design-system/page.tsx`

---

## FASE 4: Corrigir Erros de LINT - Comments

### 4.1 Arquivos com Erro `react/jsx-no-comment-textnodes`

7 arquivos precisam correção:
1. `src/app/design-system/page.tsx` (7 erros)
2. `src/components/home/actions-bar.tsx` (1 erro)
3. `src/components/home/hero-section.tsx` (1 erro)
4. `src/components/home/leaderboard-preview-server.tsx` (3 erros)
5. `src/components/home/leaderboard-preview.tsx` (2 erros)

**Padrão do problema:**

```typescript
// ❌ ERRADO:
<h2 className="...">
  // button_component
</h2>

// ✅ CERTO:
<h2 className="...">
  {/* button_component */}
</h2>
```

**Solução:**
- Trocar `// comment` por `{/* comment */}` dentro de JSX

### 4.2 Outros Erros de LINT (Para Later)

- `unescaped-entities` (1 erro em hero-section.tsx)
- `no-explicit-any` (14+ erros em db/queries)
- `no-unused-vars` (11 warnings em vários arquivos)

**Estes serão corrigidos DEPOIS da prioridade dos comments**

---

## FASE 5: TESTES

### Teste 1: Detecção Automática com Novo Default
```
1. Abrir página home
2. Select de linguagem: vazio/nenhuma seleção
3. Digitar código JavaScript
4. Verificar: auto-detecta JavaScript ✓
5. Digitar código Python
6. Verificar: muda para Python ✓
7. Colar código Java/Go/Rust/PHP/C++
8. Verificar: detecta corretamente ✓
```

### Teste 2: Syntax Highlighting das Novas Linguagens
```
Cada linguagem:
- PHP: echo "hello"; <?php ?>
- Java: public class Main {}
- Go: func main() {}
- Rust: fn main() {}
- C++: #include <iostream>
```

### Teste 3: Responsividade
```
- Desktop: editor com max-h-[500px]
- Mobile: editor com max-h-96
- Sem quebras
```

### Teste 4: Rename `/components/` → `/design-system/`
```
- URL deve ser /design-system (não mais /components)
- Página carrega normalmente
```

### Teste 5: Lint Limpo
```
npm run lint
- Sem erros de "Comments inside children..."
- Verificar se sem outros problemas
```

### Teste 6: Build Completo
```
npm run build
✅ Compiled successfully
✅ 4 páginas geradas (/, /home, /design-system, /_not-found)
```

---

## RESUMO DE MUDANÇAS

| Arquivo | Tipo | Mudanças |
|---------|------|----------|
| `src/lib/constants/languages.ts` | MODIFICAR | Adicionar 5 linguagens (PHP, Java, Go, Rust, C++) |
| `src/lib/hooks/useHighlighter.ts` | MODIFICAR | Adicionar 5 langs ao Shiki |
| `src/lib/utils/detectLanguage.ts` | MODIFICAR | Adicionar padrões para 5 linguagens |
| `src/components/home/language-selector.tsx` | MODIFICAR | Adicionar opção "Auto-detect" vazia |
| `src/components/home/code-editor.tsx` | MODIFICAR | Default language = null, lógica ajustada |
| `src/app/components/` → `/design-system/` | MOVER | Renomear pasta |
| `src/app/design-system/page.tsx` | MODIFICAR | Corrigir 7 erros de comments JSX |
| `src/components/home/actions-bar.tsx` | MODIFICAR | Corrigir 1 erro de comment JSX |
| `src/components/home/hero-section.tsx` | MODIFICAR | Corrigir 1 erro + 1 unescaped entity |
| `src/components/home/leaderboard-preview-server.tsx` | MODIFICAR | Corrigir 3 erros de comment JSX |
| `src/components/home/leaderboard-preview.tsx` | MODIFICAR | Corrigir 2 erros de comment JSX |

---

## Ordem de Execução

1. ✅ Atualizar `languages.ts` com 5 novas linguagens
2. ✅ Atualizar `useHighlighter.ts` com 5 langs no Shiki
3. ✅ Atualizar `detectLanguage.ts` com padrões das 5 linguagens
4. ✅ Atualizar `language-selector.tsx` com opção "Auto-detect"
5. ✅ Atualizar `code-editor.tsx` para default null
6. ✅ Corrigir todos os comentários JSX (7 arquivos)
7. ✅ Corrigir hero-section.tsx (unescaped entity)
8. ✅ Mover/Renomear `/src/app/components/` → `/src/app/design-system/`
9. ✅ TESTES (Fase 5 completa)
10. ✅ Build final sem erros
11. ✅ Commit com mensagem convencional

---

**PRONTO PARA EXECUTAR?**
