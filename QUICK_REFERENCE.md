# DEVROAST - Análise de Design - Quick Reference

## Informações Básicas
- **Screen ID:** 9qwc9
- **Nome:** Screen 1 - Code Input
- **Viewport:** 1440px (Desktop)
- **Layout:** Vertical (Flexbox/Grid)

---

## Layout Hierárquico

```
┌─────────────────────────────────────────┐
│           NAVBAR (56px)                 │  bg-page, border-bottom
│  > devroast              leaderboard    │
├─────────────────────────────────────────┤
│                                         │
│                 HERO                    │  centered, gap-32
│         $ paste your code...            │
│         // drop your code...            │
│                                         │
│          ┌──────────────────┐           │
│          │  CODE EDITOR     │           │  780x360, bg-input, border
│          │  (16 lines)      │           │
│          └──────────────────┘           │
│                                         │
│  ☐ roast mode     $ roast_my_code      │  Actions Bar
│                                         │
│  2,847 codes · avg score: 4.2/10       │  Footer Hint
│                                         │
│         // shame_leaderboard            │  Leaderboard
│         ┌─────────────────────────┐     │
│         │ # │ score │ code │ lang │     │
│         │─────────────────────────│     │
│         │ 1 │ 1.2   │ eval │ js  │     │
│         │ 2 │ 1.8   │ if   │ ts  │     │
│         │ 3 │ 2.1   │ SQL  │ sql │     │
│         └─────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## Dimensões

### Fixed Widths
- **Navbar:** 1440px (full width)
- **Code Input:** 780px
- **Actions Bar:** 780px
- **Leaderboard:** 960px

### Heights
- **Navbar:** 56px
- **Header (Code):** 40px
- **Code Editor:** 360px
- **Toggle Button:** 22px

---

## Cores (CSS Variables)

```css
:root {
  --bg-page: #0A0A0A;              /* Background principal */
  --bg-input: #0F0F0F;             /* Fundo do editor */
  --bg-surface: #1A1A1A;           /* Superfícies secundárias */
  --border-primary: #2A2A2A;       /* Bordas */
  
  --text-primary: #FFFFFF;         /* Texto principal */
  --text-secondary: #A0A0A0;       /* Texto secundário */
  --text-tertiary: #606060;        /* Texto terciário */
  
  --accent-green: #10B981;         /* Verde - destaque */
  --accent-amber: #F59E0B;         /* Âmbar - ranking #1 */
  --accent-red: #EF4444;           /* Vermelho - scores ruins */
  
  /* Syntax Highlighting */
  --syn-keyword: #569CD6;          /* Keywords */
  --syn-function: #DCDCAA;         /* Function names */
  --syn-variable: #9CDCFE;         /* Variables */
  --syn-number: #B5CEA8;           /* Numbers */
  --syn-string: #CE9178;           /* Strings */
  --syn-property: #9CDCFE;         /* Properties */
}
```

---

## Tipografia

### Fonts
- **Principal:** JetBrains Mono
- **Secundária:** IBM Plex Mono

### Tamanhos & Pesos
| Elemento | Font | Size | Weight | Uso |
|----------|------|------|--------|-----|
| Logo | JetBrains | 20px | 700 | Logo > |
| Logo Text | JetBrains | 18px | 500 | devroast |
| Hero Title | JetBrains | 36px | 700 | Título principal |
| Subtitle | IBM Plex | 14px | 400 | Subtítulo |
| Code | JetBrains | 12px | 400 | Código |
| Label | JetBrains | 13px | 500 | Labels, botões |
| Table Header | JetBrains | 12px | 500 | Cabeçalho tabela |

---

## Espaçamento

### Padding
- **Navbar Horizontal:** 40px
- **Main Content Top:** 80px
- **Code/Leaderboard:** 16px-20px

### Gaps
- **XS (8px):** Entre logo, dots, inputs
- **SM (12px):** Entre linhas de hero
- **MD (16px):** Entre seções menores
- **LG (24px):** Entre seções grandes
- **XL (32px):** Entre main sections

---

## Componentes Principais

### 1. Navbar
```
Logo (> devroast) | [spacing] | leaderboard link
```
- Height: 56px
- Border bottom: 1px
- Layout: space-between

### 2. Hero Section
```
$ paste your code. get roasted.
// drop your code below...
```
- Font size: 36px (title), 14px (subtitle)
- Color: green ($), white (text), gray (description)
- Centered alignment

### 3. Code Editor
```
┌─ ● ● ● ──────────────────┐
│ function calculateTotal() │
│   var total = 0;         │
│   for (var i = 0...) {   │
│     ...                  │
│   }                      │
│ }                        │
└──────────────────────────┘
```
- With line numbers (48px column)
- Syntax highlighting
- Window chrome (colored circles)

### 4. Actions Bar
```
[Toggle] roast mode // comment    [Button] $ roast_my_code
```
- Roast toggle (40x22px, green)
- Submit button (green, text: $ roast_my_code)

### 5. Footer Hint
```
2,847 codes roasted · avg score: 4.2/10
```
- Centered, teriary color
- Statistical display

### 6. Leaderboard Preview
```
// shame_leaderboard          [$ view_all >>]
// the worst code...

┌─────────────────────────────────┐
│ # │ score │ code          │ lang │
├─────────────────────────────────┤
│ 1 │ 1.2   │ eval(prompt)  │ js   │
│ 2 │ 1.8   │ if/else logic │ ts   │
│ 3 │ 2.1   │ SELECT *      │ sql  │
└─────────────────────────────────┘
showing top 3 of 2,847...
```
- Table with 4 columns
- Rank (50px), Score (70px), Code (flex), Language (100px)
- Alternating rows with 1px borders

---

## Componentes para React

```
├── Page
│   ├── Navbar
│   │   ├── Logo
│   │   └── NavLinks
│   ├── MainContent
│   │   ├── HeroSection
│   │   │   ├── Title (with $ prompt)
│   │   │   └── Subtitle
│   │   ├── CodeEditor
│   │   │   ├── WindowHeader (buttons)
│   │   │   ├── LineNumbers
│   │   │   └── CodeColumn (with syntax)
│   │   ├── ActionsBar
│   │   │   ├── RoastToggle
│   │   │   └── SubmitButton
│   │   ├── FooterHint
│   │   ├── LeaderboardPreview
│   │   │   ├── Title
│   │   │   ├── LeaderboardTable
│   │   │   │   ├── TableHeader
│   │   │   │   ├── TableRow (x3)
│   │   │   │   └── CodeCell (multi-line)
│   │   │   └── Footer
```

---

## Tailwind Classes Cheat Sheet

```html
<!-- Navbar -->
<nav class="w-full h-[56px] bg-bg-page border-b border-border-primary px-10">
  <div class="flex items-center justify-between h-full">
    <div class="flex items-center gap-2">
      <span class="text-2xl font-bold text-accent-green">&gt;</span>
      <span class="text-lg font-medium text-text-primary">devroast</span>
    </div>
  </div>
</nav>

<!-- Hero -->
<section class="text-center space-y-3">
  <h1 class="text-4xl font-bold">
    <span class="text-accent-green">$</span>
    <span class="text-text-primary">paste your code...</span>
  </h1>
  <p class="text-sm text-text-secondary">// drop your code below...</p>
</section>

<!-- Code Editor -->
<div class="w-[780px] h-[360px] bg-bg-input border border-border-primary">
  <div class="flex">
    <div class="w-12 bg-bg-surface border-r border-border-primary p-4">
      <!-- Line numbers -->
    </div>
    <div class="flex-1 p-4 overflow-auto">
      <!-- Code -->
    </div>
  </div>
</div>

<!-- Toggle Button -->
<button class="w-10 h-[22px] bg-accent-green rounded-full p-1 flex justify-end">
  <div class="w-4 h-4 bg-black rounded-full" />
</button>

<!-- Submit Button -->
<button class="px-6 py-2 bg-accent-green text-black font-mono">
  $ roast_my_code
</button>

<!-- Table Row -->
<div class="flex items-center border-b border-border-primary px-5 py-4">
  <div class="w-12 text-accent-amber">1</div>
  <div class="w-16 text-accent-red font-bold">1.2</div>
  <div class="flex-1">
    <div class="text-text-primary">eval(prompt("..."))</div>
  </div>
  <div class="w-24 text-text-secondary">javascript</div>
</div>
```

---

## Atributos de Configuração do Pencil

### Code Input Frame (ID: 7jSCO)
- Type: frame
- Width: 780
- Height: 360
- Fill: `$bg-input`
- Border: 1px `$border-primary`
- Clip: true
- Layout: vertical

### Leaderboard Frame (ID: luohW)
- Type: frame
- Width: 960
- Layout: vertical
- Gap: 24

### Toggle Button (ID: GVia8)
- Width: 40
- Height: 22
- Border Radius: 11
- Padding: 0 (top/bottom) × 3 (left/right)
- Justify Content: end

---

## Checklist de Implementação

- [ ] Setup Tailwind config com cores e spacing
- [ ] Criar componente Navbar
- [ ] Criar componente HeroSection
- [ ] Criar componente CodeEditor com syntax highli
