# DevRoast - Design Analysis Documentation

## 📋 Visão Geral

Análise completa do design "Screen 1 - Code Input" (ID: 9qwc9) extraída do arquivo Pencil `devroast.pen`.

**Viewport:** 1440px | **Layout:** Vertical Flexbox | **Theme:** Dark

---

## 📁 Arquivos Gerados

### 1. **DESIGN_ANALYSIS.md** (Principal)
Documentação técnica detalhada de 11 seções:

1. **Estrutura Geral** - Layout completo com todas as seções
2. **Navbar** - Componentes: logo, navigation, dimensões, cores
3. **Hero Section** - Título ($), subtítulo, tipografia
4. **Code Input Area** - Editor com:
   - Window header (botões coloridos)
   - Line numbers (coluna 48px)
   - Code column com syntax highlighting
   - 16 linhas de exemplo JavaScript
5. **Actions Bar** - Toggle roast mode + botão submit
6. **Footer Hint** - Estatísticas (2,847 codes, 4.2/10 score)
7. **Leaderboard Preview** - Tabela com 3 linhas de exemplo
8. **Cores e Espaçamento** - Variáveis CSS, padding, gaps
9. **Responsividade** - Breakpoints e elementos adaptáveis
10. **Componentes Reutilizáveis** - Estrutura React sugerida
11. **Fonts** - Tipografia completa com pesos e tamanhos

**Tamanho:** ~8KB | **Formato:** Markdown | **Uso:** Leitura detalhada

---

### 2. **design-tokens.json** (Dados Estruturados)
Representação JSON de todos os tokens do design:

```json
{
  "screen": { /* dimensões */, "layout": "vertical" },
  "navbar": { /* 56px height, padding, logo, nav */ },
  "hero": { /* padding, gap, title, subtitle */ },
  "codeInput": { /* 780x360, header, lineNumbers, code */ },
  "actionsBar": { /* toggle, submit button */ },
  "footerHint": { /* statistics */ },
  "leaderboard": { /* table structure, 3 rows */ },
  "colors": { /* all color tokens */ },
  "spacing": { /* padding and gaps */ },
  "typography": { /* fonts, sizes, weights */ }
}
```

**Tamanho:** ~15KB | **Formato:** JSON | **Uso:** Integração com sistemas de design

---

### 3. **IMPLEMENTATION_GUIDE.tsx** (Código React)
Componentes React prontos para usar com Tailwind CSS:

- **Tailwind Config** - Extensões recomendadas
- **Interfaces TypeScript** - Props e tipos
- **Componentes:**
  - `Navbar` - Logo + nav links
  - `HeroSection` - Título e subtítulo
  - `CodeEditor` - Editor com linhas e syntax
  - `CodeHighlight` - Colorização de código
  - `ActionsBar` - Toggle + submit
  - `FooterHint` - Estatísticas
  - `LeaderboardPreview` - Tabela com rows
  - `LeaderboardRow` - Linha individual
- **Hooks Custom** - `useCodeInput`
- **Page Component** - Exemplo de uso completo

**Tamanho:** ~12KB | **Formato:** TypeScript/React | **Uso:** Implementação React/Next.js

---

### 4. **QUICK_REFERENCE.md** (Cheat Sheet)
Guia rápido com informações sumarizadas:

- **Layout Hierárquico** - Diagrama ASCII visual
- **Dimensões** - Widths, heights, breakpoints
- **Cores** - Tabelas de CSS variables
- **Tipografia** - Font sizes, weights, families
- **Espaçamento** - Padding e gaps
- **Componentes Principais** - Resumo de cada seção
- **Tailwind Classes** - Exemplos prontos para copiar
- **Checklist** - 12 itens para implementação

**Tamanho:** ~6KB | **Formato:** Markdown | **Uso:** Referência rápida durante desenvolvimento

---

### 5. **ANALYSIS_SUMMARY.html** (Visualização Web)
Página HTML interativa com:

- Dashboard visual das dimensões
- Paleta de cores com swatches
- Tabelas de tipografia
- Resumo de componentes
- Estrutura React/Next.js
- Dicas de implementação
- Links para todos os arquivos

**Tamanho:** ~20KB | **Formato:** HTML5 | **Uso:** Visualizar no navegador

---

## 🎨 Paleta de Cores

### Background
- `$bg-page`: #0A0A0A
- `$bg-input`: #0F0F0F
- `$bg-surface`: #1A1A1A

### Text
- `$text-primary`: #FFFFFF
- `$text-secondary`: #A0A0A0
- `$text-tertiary`: #606060

### Accent
- `$accent-green`: #10B981 (Logo, toggle, buttons)
- `$accent-amber`: #F59E0B (Ranking #1)
- `$accent-red`: #EF4444 (Bad scores)

### Borders
- `$border-primary`: #2A2A2A (1px borders)

---

## 📐 Dimensões Principais

| Elemento | Width | Height | Notas |
|----------|-------|--------|-------|
| Navbar | 1440px | 56px | Full width |
| Code Input | 780px | 360px | Centered |
| Actions Bar | 780px | - | Matches code input |
| Leaderboard | 960px | - | Centered preview |
| Line Numbers | 48px | Fill | Alinhado à direita |
| Toggle Button | 40px | 22px | Rounded switch |
| Window Buttons | 12px | 12px | Each |

---

## 🔤 Tipografia

### Font Families
- **JetBrains Mono** - Código, UI, labels
- **IBM Plex Mono** - Descrições, comentários

### Tamanhos
- **Hero Title:** 36px, 700 weight
- **Subtitle:** 14px, 400 weight
- **Body/Code:** 12px, 400 weight
- **Labels:** 13px, 500 weight
- **Logo:** 18px (text), 20px (symbol)

---

## 🎯 Estrutura React Recomendada

```
Page
├── Navbar
│   ├── Logo
│   └── NavLinks
├── MainContent
│   ├── HeroSection
│   ├── CodeEditor
│   │   ├── WindowHeader
│   │   ├── LineNumbers
│   │   └── CodeColumn
│   ├── ActionsBar
│   │   ├── RoastToggle
│   │   └── SubmitButton
│   ├── FooterHint
│   ├── LeaderboardPreview
│   │   ├── TableHeader
│   │   ├── TableRows
│   │   └── TableFooter
```

---

## ⚙️ Tailwind Config Essencial

```javascript
theme: {
  extend: {
    colors: {
      'bg-page': '#0A0A0A',
      'bg-input': '#0F0F0F',
      'text-primary': '#FFFFFF',
      'accent-green': '#10B981',
      // ... mais cores
    },
    fontFamily: {
      mono: ['JetBrains Mono', 'IBM Plex Mono'],
    },
    width: {
      'code-input': '780px',
      'leaderboard': '960px',
    },
    spacing: {
      'nav-pad': '40px',
      'gap-lg': '24px',
      // ... mais spacing
    },
  },
}
```

---

## 📊 Componentes por Seção

### Navbar (56px)
- Logo: `>` (green, 20px) + "devroast" (white, 18px)
- Nav: "leaderboard" link (gray, 13px)
- Layout: space-between
- Border: bottom 1px

### Hero Section
- Title: `$` (green) + "paste your code. get roasted." (white, 36px)
- Subtitle: "// drop your code below..." (gray, 14px)
- Layout: centered, vertical

### Code Editor (780×360px)
- Header: 3 colored circles (red, amber, green)
- Line Numbers: 1-16 (gray, 12px, right-aligned)
- Code: 16 linhas de JavaScript com syntax highlighting
- Exemplo: `function calculateTotal(items) { ... }`

### Actions Bar (780px)
- Left: Toggle (40×22px, green) + label "roast mode"
- Right: Button "$ roast_my_code" (green bg, black text)
- Layout: space-between

### Footer Hint
- Centered stats: "2,847 codes roasted · avg score: 4.2/10"

### Leaderboard (960px)
- Title: "// shame_leaderboard" + "$ view_all >>"
- Subtitle: "// the worst code on the internet..."
- Table:
  - Header: # | score | code | lang
  - Row 1: 1 | 1.2 | eval() | javascript
  - Row 2: 2 | 1.8 | if/else | typescript
  - Row 3: 3 | 2.1 | SELECT | sql

---

## 🚀 Quick Start

### Para Leitura
1. Abra **QUICK_REFERENCE.md** para visão rápida
2. Abra **ANALYSIS_SUMMARY.html** no navegador para visão visual
3. Leia **DESIGN_ANALYSIS.md** para detalhes completos

### Para Implementação
1. Copie **design-tokens.json** para seu projeto
2. Configure **tailwind.config.ts** usando IMPLEMENTATION_GUIDE.tsx
3. Crie componentes baseado na estrutura em IMPLEMENTATION_GUIDE.tsx
4. Use QUICK_REFERENCE.md como cheat sheet durante desenvolvimento

### Para Integração de Design System
1. Importe **design-tokens.json** em seu sistema
2. Mapeie tokens para CSS variables ou Tailwind
3. Reutilize as definições de cores, spacing e typography

---

## 🔍 Detalhes Técnicos

### Syntax Highlighting Tokens
```
$syn-keyword    → var, function, for, if, return
$syn-operator   → ( ) { } = + - * /
$syn-function   → calculateTotal, console.log
$syn-variable   → items, total, i
$syn-number     → 0, 100, 0.9
$syn-string     → "quoted text"
$syn-property   → .length, .price
comment (#8B8B8B) → // TODO comments
```

### Toggle Button Behavior
- **Off:** gray border, white text "roast mode"
- **On:** green background, black knob, green text "roast mode"
- **Size:** 40×22px with 11px border-radius
- **Knob:** 16×16px, animated

### Leaderboard Data Structure
```javascript
{
  rank: 1,
  rankColor: '$accent-amber',
  score: 1.2,
  scoreColor: '$accent-red',
  code: ['line
