# UI Components Development Guidelines

## Overview

This document defines the standards and patterns for creating UI components in the `src/components/ui/` directory. All new components should follow these guidelines to maintain consistency and code quality.

## Component Structure

### 1. **Use Client Directive**

Always include `"use client"` at the top of every UI component file since these are interactive React components:

```typescript
"use client";
```

### 2. **Imports Organization**

Organize imports in this order:
1. React and hooks
2. External libraries (radix-ui, tailwind-variants, etc)
3. Internal utils and types
4. Leave a blank line between import groups

```typescript
"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { customUtils } from "@/lib/custom-utils";
```

### 3. **Variants Definition with `tailwind-variants`**

Define component variants using `tv()` from `tailwind-variants`. This provides:
- Type-safe variant composition
- Automatic class merging (no need for `cn()` on the variant level)
- Compound variants support for complex combinations
- Default variants

```typescript
export const buttonVariants = tv({
  base: "base classes here",
  variants: {
    variant: {
      primary: "primary-specific classes",
      secondary: "secondary-specific classes",
    },
    size: {
      sm: "small size classes",
      md: "medium size classes",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

**Key Points:**
- Use `base` for styles applied to all variants
- Group related variants (variant, size, state, etc)
- Use descriptive names for variant values
- Always define `defaultVariants`
- Use string literals for class names, not objects

### 4. **Component Props Interface**

Create a `ComponentProps` interface that:
- Extends the native HTML element props (`React.ButtonHTMLAttributes<HTMLButtonElement>`)
- Extends variant props from `VariantProps<typeof componentVariants>`
- Adds custom props (like `asChild`, `isLoading`, etc)

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}
```

**Convention:**
- Always name it `ComponentNameProps`
- Extend HTML element props first
- Extend variant props second
- Add custom props last
- Use `export interface` so consumers can import and extend if needed

### 5. **Component Implementation**

Use `React.forwardRef` to allow consumers to access the underlying DOM element:

```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**Key Points:**
- Use `forwardRef` for all UI components
- Pass `className` directly to the `variants()` function (no `cn()` needed)
- When using `asChild`, use `Slot` from `@radix-ui/react-slot` to forward props correctly
- Always set `displayName` for better debugging

### 6. **Passing className to Variants**

The `tailwind-variants` library automatically handles class merging. Simply pass `className` as a property:

```typescript
className={buttonVariants({ variant, size, className })}
```

This automatically:
- Merges conflicting Tailwind classes
- Applies the correct specificity
- No need to use `cn()` function

## Export Pattern

Always use **named exports**, never default exports:

```typescript
// ✅ Correct
export const Button = React.forwardRef<...>(...);
export const buttonVariants = tv(...);
export interface ButtonProps extends ... {}

// ❌ Wrong
export default Button;
```

This allows consumers to import like:
```typescript
import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
```

## Color and Theming

Use explicit color values from the design system:
- Primary actions: Use exact hex values from design (e.g., `#10b981`)
- Dark mode: Use Tailwind's `dark:` prefix
- Focus states: Use appropriate ring colors matching the variant

Example:
```typescript
primary: "bg-[#10b981] text-[#0A0A0A] hover:bg-[#0a9970] dark:bg-[#0a9970] dark:text-white"
```

## Component Variants Best Practices

1. **Keep variants focused**: Each variant property should represent one aspect (color, size, state)
2. **Use compound variants for complex combinations**: When a size changes how a variant looks
3. **Include disabled states**: Always account for disabled UI
4. **Include focus states**: For accessibility (use `focus-visible:`)
5. **Support dark mode**: Add `dark:` variants for all color-based styles

## Files to Create for New Components

For each new UI component, create:

1. **Component file**: `src/components/ui/component-name.tsx`
   - Contains the component, variants, and types
   - Use `"use client"` directive
   - Export component, variants, and interface

Example structure:
```
src/components/ui/
├── button.tsx          # Main component
├── input.tsx           # Input field component
├── card.tsx            # Card wrapper component
└── agents.md           # This file
```

## Testing Components

To showcase and test all UI components:

1. Create example pages in `src/app/components/`
2. Import components and display all variants
3. Use consistent layout/spacing for visibility
4. Update the components showcase whenever adding new components

Example:
```typescript
import { Button } from "@/components/ui/button";

export default function ComponentsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Button variants */}
      <section>
        <h2>Button Component</h2>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </section>
    </div>
  );
}
```

## Dependencies

Core dependencies for UI components:
- `tailwind-variants` - For composable variant management
- `@radix-ui/react-slot` - For flexible component composition with `asChild`
- `clsx` - For conditional class names in component logic (not variants)
- `tailwind-merge` - For smart class merging (used in `tailwind-variants`)

Install new dependencies as needed for component features.

## Code Quality

- Use Biome for formatting with 2-space indentation
- Run `npm run formate` before committing
- TypeScript should be strict (no `any` types)
- All props should be properly typed
- Use `export` instead of `export default`

## Available Components

### Badge (`src/components/ui/badge.tsx`)
Simple indicator with colored dot and optional label.

**Variants:**
- `critical`: Red (#EF4444)
- `warning`: Amber (#F59E0B)
- `good`: Green (#10B981)
- `verdict`: Red (#EF4444)

**Props:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  variant?: "critical" | "warning" | "good" | "verdict";
  label?: React.ReactNode;
}
```

**Usage:**
```typescript
import { Badge } from "@/components/ui/badge";

<Badge variant="critical" label="Critical" />
```

---

### Card (`src/components/ui/card.tsx`)
Container component with header, title, description, and optional content.

**Props:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: BadgeVariant;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}
```

**Features:**
- Status badge with variant color
- Bold title (JetBrains Mono, text-base)
- Description text (IBM Plex Mono, text-sm, gray)
- Border and rounded corners
- Optional children content

**Usage:**
```typescript
import { Card } from "@/components/ui/card";

<Card
  status="good"
  title="Component Name"
  description="A brief description"
>
  {/* Additional content */}
</Card>
```

---

### DiffLine (`src/components/ui/diff-line.tsx`)
Shows code changes with add/remove/context indicators.

**Variants:**
- `added`: Green text (+), light background (#0A1A0F)
- `removed`: Red text (-), dark background (#1A0A0A)
- `context`: Gray text (space), transparent background

**Props:**
```typescript
interface DiffLineProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof diffLineVariants> {
  type: "added" | "removed" | "context";
  code: string;
}
```

**Usage:**
```typescript
import { DiffLine } from "@/components/ui/diff-line";

<DiffLine type="added" code="const greeting = 'Hello';" />
<DiffLine type="removed" code="const old = 'Goodbye';" />
<DiffLine type="context" code="return greeting;" />
```

---

### TableRow (`src/components/ui/table-row.tsx`)
Flexible row component for table-like layouts.

**Props:**
```typescript
interface TableCell {
  content: React.ReactNode;
  width?: string | number;
}

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  cells: TableCell[];
}
```

**Features:**
- Horizontal flex layout with customizable column widths
- Border bottom for row separation
- Flexible cell sizing

**Usage:**
```typescript
import { TableRow } from "@/components/ui/table-row";

<TableRow
  cells={[
    { content: "#1", width: "40px" },
    { content: "1250", width: "60px" },
    { content: "console.log('hello')" },
    { content: "JavaScript", width: "100px" }
  ]}
/>
```

---

### Toggle (`src/components/ui/toggle.tsx`)
Switch component with optional label.

**Props:**
```typescript
interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
```

**Features:**
- Green track when ON (#10B981), gray when OFF (#2A2A2A)
- Black knob when ON, gray when OFF
- Optional label with dynamic color
- Uses @base-ui/react Switch primitive

**Usage:**
```typescript
import { Toggle } from "@/components/ui/toggle";

const [roastMode, setRoastMode] = useState(false);

<Toggle
  checked={roastMode}
  onCheckedChange={setRoastMode}
  label="roast mode"
/>
```

---

### CodeBlock (`src/components/ui/code-block.tsx`)
Syntax-highlighted code display with optional line numbers.

**Props:**
```typescript
interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}
```

**Features:**
- Shiki syntax highlighting (theme: vesper)
- Status dots (red, amber, green)
- Filename display
- Optional line numbers with right alignment
- Scrollable container

**Usage:**
```typescript
import { CodeBlock } from "@/components/ui/code-block";

<CodeBlock
  code="console.log('hello');"
  language="javascript"
  filename="index.js"
  showLineNumbers={true}
/>
```

**Note:** This component is async and uses Shiki. Use it in Server Components or with dynamic imports.

---

## Summary Checklist

When creating a new UI component, ensure:

- [ ] File starts with `"use client"`
- [ ] Imports are organized (React → external → internal)
- [ ] Variants defined with `tv()` from tailwind-variants
- [ ] Component extends native HTML element props
- [ ] Component extends variant props with `VariantProps`
- [ ] Component uses `React.forwardRef`
- [ ] `className` passed directly to variants (no `cn()`)
- [ ] All exports are named exports (no default export)
- [ ] `displayName` is set
- [ ] Biome formatted with 2 spaces
- [ ] Build compiles without errors
- [ ] TypeScript has no errors
