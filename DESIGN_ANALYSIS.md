# Análise do Design - Screen 1: Code Input
**ID:** 9qwc9 | **Arquivo Pencil:** devroast.pen

---

## 1. ESTRUTURA GERAL DO LAYOUT

### Dimensões
- **Largura:** 1440px (full viewport)
- **Layout:** Vertical (columnar)
- **Estrutura Hierárquica:**
```
Frame (Screen 1)
├── Navbar (56px height)
├── Main Content
│   ├── Hero Section
│   ├── Code Input Area
│   ├── Actions Bar
│   ├── Footer Hint
│   ├── Spacer (60px)
│   └── Leaderboard Preview
└── Bottom Padding (60px)
```

---

## 2. NAVBAR

### Componentes
| Elemento | Tipo | Propriedades |
|----------|------|-------------|
| **Container** | Frame | width: fill_container, height: 56px |
| **Background** | Fill | `$bg-page` |
| **Divider** | Stroke | Bottom: 1px `$border-primary` |
| **Padding** | - | 0 (vertical) × 40px (horizontal) |
| **Layout** | - | space_between (horizontal distribution) |

### Componentes Internos

#### Logo (Left)
```
Frame: gap 8px, alignItems center
├── Text: ">" 
│   Font: JetBrains Mono, 20px, 700 weight
│   Color: $accent-green
└── Text: "devroast"
    Font: JetBrains Mono, 18px, 500 weight
    Color: $text-primary
```

#### Navigation (Right)
```
Frame: gap 24px, alignItems center
└── Text: "leaderboard"
    Font: JetBrains Mono, 13px, normal weight
    Color: $text-secondary
```

---

## 3. HERO SECTION

### Container
- **Frame ID:** Gk6x1
- **Layout:** vertical, centered
- **Gap:** 12px
- **Alignment:** center

### Componentes

#### Título Principal
```
Frame: gap 12px, alignItems center
├── Text: "$"
│   Font: JetBrains Mono, 36px, 700 weight
│   Color: $accent-green
│   (Command prompt symbol)
└── Text: "paste your code. get roasted."
    Font: JetBrains Mono, 36px, 700 weight
    Color: $text-primary
```

#### Subtítulo
```
Text: "// drop your code below and we'll rate it — brutally honest or full roast mode"
Font: IBM Plex Mono, 14px, normal
Color: $text-secondary
```

---

## 4. CODE INPUT AREA

### Container Principal
- **Frame ID:** 7jSCO
- **Dimensões:** 780px × 360px
- **Background:** `$bg-input`
- **Border:** 1px `$border-primary`
- **Clip:** true (overflow hidden)
- **Layout:** vertical

### 4.1 Window Header (40px height)
```
Frame: height 40px, width fill_container
├── Background: fill_container
├── Border Bottom: 1px $border-primary
├── Padding: 0 × 16px
└── Content:
    └── windowDots (Frame, gap 8px)
        ├── Ellipse: close button (12×12px, #EF4444 - red)
        ├── Ellipse: minimize button (12×12px, #F59E0B - amber)
        └── Ellipse: maximize button (12×12px, #10B981 - green)
```

### 4.2 Code Content Area

#### Line Numbers Column
```
Frame: width 48px, height fill_container
├── Background: $bg-surface
├── Border Right: 1px $border-primary
├── Layout: vertical, gap 8px
├── Padding: 16px (top) × 12px (horizontal)
├── Alignment: end (right-aligned)
└── Content: 16 text elements (lines 1-16)
    └── Font: JetBrains Mono, 12px, normal
    └── Color: $text-tertiary
```

#### Code Column
```
Frame: width fill_container, height fill_container
├── Layout: vertical, gap 8px
├── Padding: 16px
└── Content: Multiple code lines with syntax highlighting
```

#### Exemplos de Linhas de Código (com syntax highlighting)

**Linha 1:** `function calculateTotal(items) {`
```
Frame with inline text elements:
├── "function" - $syn-keyword
├── " " - operator
├── "calculateTotal" - $syn-function
├── "(" - $syn-operator
├── "items" - $syn-variable
└── ") {" - $syn-operator
```

**Linha 2:** `  var total = 0;`
```
├── "  " - operator (indentation)
├── "var" - $syn-keyword
├── " " - operator
├── "total" - $syn-variable
├── " = " - operator
├── "0" - $syn-number
└── ";" - operator
```

**Linhas 12-13:** Comentários
```
"  // TODO: handle tax calculation" - #8B8B8B
"  // TODO: handle currency conversion" - #8B8B8B
```

#### Token Colors (Syntax Highlighting)
| Token | CSS Variable | Uso |
|-------|--------------|-----|
| Keyword | `$syn-keyword` | function, var, for, if, return |
| Operator | `$syn-operator` | (, ), {, }, =, +, -, *, / |
| Function | `$syn-function` | calculateTotal, console.log |
| Variable | `$syn-variable` | items, total, i |
| Number | `$syn-number` | 0, 100, 0.9 |
| String | `$syn-string` | "discount applied" |
| Property | `$syn-property` | .length, .price |
| Comment | #8B8B8B | // TODO comments |

---

## 5. ACTIONS BAR

### Container
- **Frame ID:** CN3U8
- **Width:** 780px (matches code input)
- **Layout:** horizontal, space_between
- **Alignment:** center

### 5.1 Left Actions
```
Frame: gap 16px, alignItems center
├── Roast Toggle (Frame, gap 10px, alignItems center)
│   ├── Toggle Track (Frame)
│   │   ├── Width: 40px, Height: 22px
│   │   ├── Background: $accent-green
│   │   ├── Border Radius: 11px (fully rounded)
│   │   ├── Padding: 0 × 3px
│   │   ├── Justify: end
│   │   └── Content:
│   │       └── Toggle Knob (Ellipse)
│   │           └── 16×16px, fill: #0A0A0A (dark)
│   └── Text: "roast mode"
│       Font: JetBrains Mono, 13px, normal
│       Color: $accent-green
└── Hint Text: "// maximum sarcasm enabled"
    Font: IBM Plex Mono, 12px, normal
    Color: $text-tertiary
```

### 5.2 Submit Button
```
Frame: (right side)
├── Background: $accent-green
├── Gap: 8px
├── Padding: 10px (vertical) × 24px (horizontal)
├── Alignment: center
└── Text: "$ roast_my_code"
    Font: JetBrains Mono, 13px, 500 weight
    Color: #0A0A0A (dark/inverted on green bg)
```

---

## 6. FOOTER HINT

### Container
- **Frame ID:** e1iw1
- **Layout:** horizontal, center-aligned
- **Gap:** 24px
- **Justify:** center
- **Alignment:** center

### Conteúdo
```
Frame (centered row):
├── Text: "2,847 codes roasted"
│   Font: IBM Plex Mono, 12px, normal
│   Color: $text-tertiary
├── Text: "·" (bullet separator)
│   Font: JetBrains Mono, 12px, normal
│   Color: $text-tertiary
└── Text: "avg score: 4.2/10"
    Font: IBM Plex Mono, 12px, normal
    Color: $text-tertiary
```

---

## 7. LEADERBOARD PREVIEW

### Container Principal
- **Frame ID:** luohW
- **Width:** 960px
- **Layout:** vertical
- **Gap:** 24px

### 7.1 Title Row
```
Frame: width fill_container, justifyContent space_between
├── Left (Title)
│   ├── Text: "//" - $accent-green (14px, 700 weight)
│   └── Text: "shame_leaderboard" - $text-primary (14px, 700)
└── Right (View All Link)
    ├── Border: 1px $border-primary
    ├── Padding: 6px × 12px
    └── Text: "$ view_all >>"
        Font: JetBrains Mono, 12px, normal
        Color: $text-secondary
```

### 7.2 Subtitle
```
Text: "// the worst code on the internet, ranked by shame"
Font: IBM Plex Mono, 13px, normal
Color: $text-tertiary
```

### 7.3 Leaderboard Table

#### Table Header (40px height)
```
Frame:
├── Background: $bg-surface
├── Border Bottom: 1px $border-primary
├── Padding: 0 × 20px
├── Alignment: center
└── Columns (left-to-right):
    ├── "#" - width: 50px, color: $text-tertiary
    ├── "score" - width: 70px, color: $text-tertiary
    ├── "code" - width: fill_container, color: $text-tertiary
    └── "lang" - width: 100px, color: $text-tertiary
    All: JetBrains Mono, 12px, 500 weight
```

#### Table Row Structure (Example Row 1)
```
Frame: width fill_container, padding 16px × 20px
├── Border Bottom: 1px $border-primary
└── Columns:
    ├── Rank: "1" - $accent-amber (12px, normal)
    ├── Score: "1.2" - $accent-red (12px, 700 weight)
    ├── Code (vertical layout, gap 3px):
    │   ├── "eval(prompt(\"enter code\"))" - $text-primary
    │   ├── "document.write(response)" - $text-primary
    │   └── "// trust the user lol" - #8B8B8B (comment)
    │   All: JetBrains Mono, 12px, normal
    └── Language: "javascript" - $text-secondary (12px, normal)
```

#### Três Linhas de Exemplo

**Row 1 - Score 1.2 (Worst)**
```
Rank: 1 ($accent-amber)
Score: 1.2 ($accent-red)
Code:
  eval(prompt("enter code"))
  document.write(response)
  // trust the user lol
Language: javascript
```

**Row 2 - Score 1.8**
```
Rank: 2 ($text-secondary)
Score: 1.8 ($accent-red)
Code:
  if (x == true) { return true; }
  else if (x == false) { return false; }
  else { return !false; }
Language: typescript
```

**Row 3 - Score 2.1**
```
Rank: 3 ($text-secondary)
Score: 2.1 ($accent-red)
Code:
  S
