# DevRoast - Project Overview & Development Guidelines

## Project Overview

**DevRoast** is a code roasting platform built during Rocketseat's NLW event. Users can paste their code and receive humoristic, constructive feedback with a "roast score" that evaluates code quality in a fun way.

### Tech Stack
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4 + Tailwind Variants
- **Type Safety**: TypeScript 5
- **Components**: Radix UI, Base UI, Lucide Icons
- **Code Highlighting**: Shiki
- **Code Quality**: Biome, ESLint

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── home/                # Home page routes
│   ├── components/          # Components showcase page
│   └── layout.tsx           # Root layout
├── components/
│   ├── home/                # Page-specific components
│   │   ├── code-editor.tsx      # Editable code input
│   │   ├── actions-bar.tsx      # Roast button & toggle
│   │   ├── footer-hint.tsx      # Stats display
│   │   ├── leaderboard-preview.tsx
│   │   ├── hero-section.tsx
│   │   └── navbar.tsx
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── code-block.tsx
│       ├── diff-line.tsx
│       ├── score-ring.tsx
│       ├── table-row.tsx
│       └── toggle.tsx
└── lib/                     # Utilities & helpers
```

## Global Standards

### 1. **Component Patterns**

**UI Components** (`src/components/ui/`):
- Use `"use client"` directive
- Export variants with `tailwind-variants` (tv)
- Use `React.forwardRef` for all UI components
- Named exports only (no default exports)
- Always set `displayName`

Example:
```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  )
);
Button.displayName = "Button";
```

**Page Components** (`src/components/home/`):
- Use `"use client"` for interactive features
- Keep components focused and composable
- Use responsive utilities for mobile-first design

### 2. **Styling Guidelines**

- **Width Handling**: Use `w-full` for flexible layouts, avoid fixed widths unless necessary
- **Responsive Design**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- **Hover States**: Use `enabled:hover:` for buttons to prevent hover on disabled state
- **Dark Mode**: Support with `dark:` prefix
- **Colors**: Use design tokens from `design-tokens.json`

### 3. **Layout Container Pattern**

For consistent spacing across all sections:
```typescript
<div className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
  <div className="mx-auto max-w-6xl flex flex-col gap-8 sm:gap-10 md:gap-12">
    {/* Content */}
  </div>
</div>
```

### 4. **Naming Conventions**

- **Components**: PascalCase (e.g., `CodeEditor`, `ActionsBar`)
- **Files**: kebab-case (e.g., `code-editor.tsx`, `actions-bar.tsx`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (for sample data)
- **CSS Classes**: Use Tailwind utilities (no custom CSS unless unavoidable)

### 5. **File Organization**

Each component file should follow:
1. `"use client"` directive (if needed)
2. Imports (React → external → internal)
3. Constants/Sample data
4. Types/Interfaces
5. Variant definitions (tv)
6. Component implementation
7. Display name

### 6. **Key Design Tokens**

**Colors**:
- `bg-page`: Page background
- `bg-input`: Input/editor background
- `bg-surface`: Surface/secondary background
- `text-primary`: Main text
- `text-secondary`: Secondary text
- `text-tertiary`: Tertiary/muted text
- `accent-green`: Primary action color
- `accent-red`: Error/critical color
- `accent-amber`: Warning color
- `border-primary`: Primary border color

**Spacing**: Use Tailwind's default scale (4px base unit)
**Typography**: Mono fonts for code/terminal style (JetBrains Mono, IBM Plex Mono)

## Development Workflow

### Running the Project
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run formate  # Format with Biome
npm run lint     # Check with ESLint
```

### Code Quality
- Run `npm run formate` before committing
- No `any` types - use strict TypeScript
- All props properly typed
- Components should be reusable and composable

## Git Commit Pattern

Use Conventional Commits:
```
type(scope): subject

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
**Scope**: `ui`, `components`, `editor`, `docs`, etc.

Example:
```
feat(editor): make code editor editable with textarea
fix(button): disable hover effect when button is disabled
docs: add AGENTS.md and update README
```

## Future Enhancements

- Syntax highlighting for code editor
- API integration for roasting logic
- User authentication
- Code roast history/leaderboard
- Export roasts functionality
