# Syntax Highlighting Implementation Guide for DevRoast

## Quick Comparison Table

| Criteria | Shiki | Highlight.js | CodeMirror | Monaco |
|----------|-------|--------------|-----------|--------|
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Bundle Size** | 200KB | 80KB | 400KB+ | 2-4MB |
| **Client-Side** | ✅ | ✅ | ✅ | ✅ |
| **Auto-Detect** | ❌ | ✅ Built-in | ❌ | ❌ |
| **Themes** | 50+ | Limited | Limited | VSCode |
| **Learning Curve** | Medium | Easy | Hard | Very Hard |
| **Best For DevRoast** | ✅✅✅ | ✅ (if tight budget) | ❌ | ❌❌ |

---

## Ray.so Architecture (Reference Implementation)

Ray.so uses a **dual-component approach**:

```typescript
// Component Structure
<div className="editor-container">
  {/* Left: Editable Textarea */}
  <textarea 
    value={code}
    onChange={(e) => setCode(e.target.value)}
    style={{ position: 'absolute', zIndex: 1 }}
  />
  
  {/* Right: Highlighted Code (Read-only) */}
  <div 
    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    style={{ position: 'absolute', zIndex: 0, color: 'transparent' }}
  />
</div>
```

**Key Insight**: The textarea is positioned above the highlighted code with transparent text. When you type in the textarea, you see the highlighted code beneath it.

---

## Recommended Implementation for DevRoast

### Step 1: Install Dependencies
```bash
npm install shiki
```

### Step 2: Create Highlighter Hook
```typescript
// hooks/useHighlighter.ts
import { useEffect, useState } from 'react';
import { getHighlighterCore, Highlighter } from 'shiki';
import getWasm from 'shiki/wasm';

export function useHighlighter() {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initHighlighter = async () => {
      const hl = await getHighlighterCore({
        themes: ['github-dark', 'github-light'],
        langs: [
          import('shiki/langs/javascript.mjs'),
          import('shiki/langs/python.mjs'),
          import('shiki/langs/typescript.mjs'),
        ],
        loadWasm: getWasm,
      });
      setHighlighter(hl as Highlighter);
      setLoading(false);
    };

    initHighlighter();
  }, []);

  const highlightCode = async (code: string, language: string) => {
    if (!highlighter) return code;
    
    // Load language if not already loaded
    const loaded = highlighter.getLoadedLanguages() || [];
    if (!loaded.includes(language)) {
      try {
        await highlighter.loadLanguage(
          import(`shiki/langs/${language}.mjs`)
        );
      } catch {
        // Fallback if language not available
        return highlighter.codeToHtml(code, { 
          lang: 'plaintext',
          theme: 'github-dark'
        });
      }
    }

    return highlighter.codeToHtml(code, {
      lang: language,
      theme: 'github-dark',
    });
  };

  return { highlighter, loading, highlightCode };
}
```

### Step 3: Create Language Selector Component
```typescript
// components/LanguageSelector.tsx
import { useMemo } from 'react';
import * as Select from '@radix-ui/react-select';

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'plaintext', label: 'Plain Text' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-40 px-3 py-2 rounded border border-border-primary bg-input">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-surface border border-border-primary rounded shadow-lg">
          <Select.Viewport>
            {LANGUAGES.map((lang) => (
              <Select.Item
                key={lang.value}
                value={lang.value}
                className="px-3 py-2 cursor-pointer hover:bg-input"
              >
                {lang.label}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

### Step 4: Create Code Highlighter Component
```typescript
// components/CodeHighlighter.tsx
'use client';

import { useEffect, useState } from 'react';
import { useHighlighter } from '@/hooks/useHighlighter';

interface CodeHighlighterProps {
  code: string;
  language: string;
  theme?: 'github-dark' | 'github-light';
}

export function CodeHighlighter({ 
  code, 
  language, 
  theme = 'github-dark' 
}: CodeHighlighterProps) {
  const { highlighter, loading } = useHighlighter();
  const [html, setHtml] = useState('');

  useEffect(() => {
    const highlight = async () => {
      if (!highlighter) return;

      const loaded = highlighter.getLoadedLanguages() || [];
      if (!loaded.includes(language)) {
        try {
          await highlighter.loadLanguage(
            import(`shiki/langs/${language}.mjs`)
          );
        } catch {
          // Fallback to plaintext
        }
      }

      const highlightedHtml = highlighter.codeToHtml(code, {
        lang: language,
        theme,
      });
      setHtml(highlightedHtml);
    };

    highlight();
  }, [code, language, highlighter, theme]);

  if (loading) {
    return <div className="text-text-tertiary">Loading syntax highlighter...</div>;
  }

  return (
    <div
      className="bg-input rounded p-4 font-mono text-sm overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### Step 5: Integrate into CodeEditor
```typescript
// components/CodeEditor.tsx
'use client';

import { useState } from 'react';
import { CodeHighlighter } from './CodeHighlighter';
import { LanguageSelector, LANGUAGES } from './LanguageSelector';

export function CodeEditor() {
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-text-secondary">Language:</label>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Dual View */}
      <div className="relative bg-input rounded border border-border-primary">
        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent text-transparent 
                     p-4 font-mono text-sm resize-none focus:outline-none"
          spellCheck="false"
        />

        {/* Highlighted Code */}
        <div className="pointer-events-none">
          <CodeHighlighter code={code} language={language} />
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-text-tertiary">
        {code.split('\n').length} lines • {code.length} characters
      </div>
    </div>
  );
}
```

---

## Bundle Size Analysis

### Initial Load (First Page Visit)
- Shiki core: ~100KB
- 3 preloaded languages: ~80KB
- Themes: ~20KB
- **Total: ~200KB** (gzipped: ~50-60KB)

### Lazy Loading (On Language Selection)
- Each additional language: 10-50KB (gzipped: 3-15KB)
- Loaded once and cached

### Optimization Strategies
1. **Lazy import languages** ✅ Already done
2. **Tree-shake unused themes** - Only include needed themes
3. **Code-split components** - Load CodeHighlighter only when needed
4. **Service Worker caching** - Cache language grammars

---

## Alternative: Highlight.js (Budget Version)

If you need smaller bundle:

```typescript
// Install
npm install highlight.js

// Usage
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

// Highlight code
const result = hljs.highlight(code, { language: 'javascript' });
const html = result.value;

// Optional: Auto-detect
const auto = hljs.highlightAuto(code);
console.log(auto.language); // Detected language
```

**Bundle Size**: ~80KB (with 5 languages)

---

## CSS Integration with Tailwind

Add to your `globals.css` or Tailwind config:

```css
/* Shiki syntax highlighting */
.shiki {
  @apply bg-input rounded p-4 font-mono text-sm overflow-auto;
}

.shiki code {
  @apply block;
}

.shiki-light {
  @apply bg-white text-gray-900;
}

.shiki-dark {
  @apply bg-slate-900 text-slate-200;
}
```

---

## Performance Monitoring

```typescript
// Monitor syntax highlighting performance
useEffect(() => {
  const start = performance.now();
  
  highlightCode(code, language).then(() => {
    const duration = performance.now() - start;
    console.log(`Highlighted in ${duration.toFixed(2)}ms`);
  });
}, [code, language]);
```

---

## Testing Recommendations

```typescript
describe('CodeHighlighter', () => {
  it('should highlight JavaScript code', async () => {
    const { getByText } = render(
      <CodeHighlighter code="const x = 5;" language="javascript" />
    );
    
    await waitFor(() => {
      expect(getByText('const')).toHaveClass('highlight');
    });
  });

  it('should load language on demand', async () => {
    const { rerender } = render(
      <CodeHighlighter code="let x = 5;" language="javascript" />
    );
    
    rerender(<CodeHighlighter code="let x = 5;" language="python" />);
    
    await waitFor(() => {
      // Python should be loaded
    });
  });
});
```

---

## Production Checklist

- ✅ Test on slow 3G connection
- ✅ Verify bundle size with `npm run build`
- ✅ Test language switching performance
- ✅ Verify syntax highlighting accuracy for roasting
- ✅ Test dark/light mode theme switching
- ✅ Monitor Core Web Vitals (LCP, FID, CLS)
- ✅ Test accessibility (keyboard navigation in textarea)
- ✅ Verify copy-paste functionality
- ✅ Test with large code snippets (1000+ lines)

---

## Migration Timeline

| Phase | Task | Time | Priority |
|-------|------|------|----------|
| 1 | Add Shiki dependency | 15 min | P0 |
| 2 | Create useHighlighter hook | 45 min | P0 |
| 3 | Create CodeHighlighter component | 30 min | P0 |
| 4 | Create LanguageSelector | 30 min | P0 |
| 5 | Integrate with CodeEditor | 30 min | P0 |
| 6 | Test & optimize bundle | 1 hour | P1 |
| 7 | Add more languages | 30 min | P2 |
| 8 | Performance monitoring | 30 min | P2 |

**Total Time**: 4-5 hours for basic implementation

---

## References

- Ray.so GitHub: https://github.com/raycast/ray-so
- Shiki Docs: https://shiki.style
- Highlight.js Docs: https://highlightjs.org
- Radix UI Select: https://www.radix-ui.com/docs/primitives/components/select
