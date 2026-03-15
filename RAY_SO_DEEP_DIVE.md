# Ray.so Deep Dive: Architecture & Implementation Patterns

## Ray.so's Actual Implementation

### 1. State Management (Using Jotai)

Ray.so uses **jotai atoms** for state management:

```typescript
// Store atoms for code state
export const codeAtom = atom<string>('console.log("Hello")');
export const selectedLanguageAtom = atom<Language | null>(LANGUAGES.javascript);
export const highlighterAtom = atom<Highlighter | null>(null);
export const highlightedLinesAtom = atom<number[]>([]);
export const showLineNumbersAtom = atom<boolean>(true);
export const loadingLanguageAtom = atom<boolean>(false);

// Usage in components
const [code, setCode] = useAtom(codeAtom);
const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
const [highlighter, setHighlighter] = useAtom(highlighterAtom);
```

**Why Jotai?**
- Minimal, hooks-based state management
- No boilerplate
- Works perfectly with TypeScript
- Easy async operations with atoms

---

### 2. Shiki Initialization (code.tsx)

Ray.so initializes Shiki with a **specific strategy**:

```typescript
import { getHighlighterCore } from 'shiki';
import getWasm from 'shiki/wasm';

export function Code() {
  const [highlighter, setHighlighter] = useAtom(highlighterAtom);

  useEffect(() => {
    getHighlighterCore({
      // Preload only essential themes
      themes: [
        shikiTheme,           // Custom theme
        tailwindLight,        // Light theme
        tailwindDark,         // Dark theme
      ],
      // Preload only 4 essential languages
      langs: [
        LANGUAGES.javascript.src(),
        LANGUAGES.tsx.src(),
        LANGUAGES.swift.src(),
        LANGUAGES.python.src(),
      ],
      // Use WASM for browser support
      loadWasm: getWasm,
    }).then((highlighter) => {
      setHighlighter(highlighter as Highlighter);
    });
  }, []); // Initialize once on mount

  return highlighter ? <Frame /> : <LoadingState />;
}
```

**Key Points**:
- Only 4 languages preloaded (not all)
- Only 3 themes loaded (not 50+)
- WASM loaded dynamically
- Initialize once, cache result
- Don't show UI until ready

---

### 3. Language Configuration

Ray.so defines languages as **lazy-loaded modules**:

```typescript
// util/languages.ts
export type Language = {
  name: string;
  src: () => Promise<any>;
};

export const LANGUAGES: { [index: string]: Language } = {
  javascript: {
    name: "JavaScript",
    src: () => import("shiki/langs/javascript.mjs"),
  },
  typescript: {
    name: "TypeScript",
    src: () => import("shiki/langs/typescript.mjs"),
  },
  python: {
    name: "Python",
    src: () => import("shiki/langs/python.mjs"),
  },
  swift: {
    name: "Swift",
    src: () => import("shiki/langs/swift.mjs"),
  },
  rust: {
    name: "Rust",
    src: () => import("shiki/langs/rust.mjs"),
  },
  go: {
    name: "Go",
    src: () => import("shiki/langs/go.mjs"),
  },
  // ... more languages
  plaintext: {
    name: "Plain Text",
    src: () => Promise.resolve(null),
  },
};
```

**Advantages**:
- Each language is a code-split chunk
- Only loaded when selected
- Type-safe language references
- Easy to add new languages

---

### 4. Editor Component (The Textarea)

Ray.so's editor handles **keyboard shortcuts & UX**:

```typescript
// components/Editor.tsx
function Editor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useAtom(codeAtom);
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);

  // Handle Tab key (indentation)
  const handleKeyDown = useCallback((event) => {
    const textarea = textareaRef.current!;
    
    if (event.key === "Tab") {
      event.preventDefault();
      handleTab(textarea, event.shiftKey);
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleEnter(textarea); // Smart indent
    } else if (event.key === "}") {
      event.preventDefault();
      handleBracketClose(textarea);
    } else if (event.key === "Escape") {
      textarea.blur();
    }
  }, []);

  return (
    <div 
      className={styles.editor}
      style={{ '--editor-padding': '16px' } as React.CSSProperties}
      data-value={code}
    >
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.textarea}
        spellCheck="false"
        autoCapitalize="off"
      />
      <HighlightedCode code={code} selectedLanguage={selectedLanguage} />
    </div>
  );
}
```

**Features**:
- Smart tab indentation
- Enter key auto-indent
- Bracket auto-closing
- ESC to blur
- Uses data-value for CSS debugging

---

### 5. Highlighting Component (The Magic)

Ray.so's **HighlightedCode** component is the core:

```typescript
// components/HighlightedCode.tsx
type Props = {
  selectedLanguage: Language | null;
  code: string;
};

const HighlightedCode: React.FC<Props> = ({ selectedLanguage, code }) => {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const highlighter = useAtomValue(highlighterAtom);
  const setIsLoadingLanguage = useSetAtom(loadingLanguageAtom);
  const highlightedLines = useAtomValue(highlightedLinesAtom);
  const darkMode = useAtomValue(themeDarkModeAtom);
  const theme = useAtomValue(themeAtom);

  // Determine theme name
  const themeName = theme.id === "tailwind" 
    ? (darkMode ? "tailwind-dark" : "tailwind-light")
    : "css-variables";

  useEffect(() => {
    const generateHighlightedHtml = async () => {
      // Skip if no highlighter, language, or plaintext
      if (!highlighter || !selectedLanguage || selectedLanguage === LANGUAGES.plaintext) {
        return escapeHtml(code); // Fallback for plain text
      }

      // Check if language is already loaded
      const loadedLanguages = highlighter.getLoadedLanguages() || [];
      const hasLoadedLanguage = loadedLanguages.includes(
        selectedLanguage.name.toLowerCase()
      );

      // Load language if not already loaded
      if (!hasLoadedLanguage && selectedLanguage.src) {
        setIsLoadingLanguage(true);
        await highlighter.loadLanguage(selectedLanguage.src());
        setIsLoadingLanguage(false);
      }

      // Highlight code
      let lang = selectedLanguage.name.toLowerCase();
      if (lang === "typescript") lang = "tsx"; // Normalize

      return highlighter.codeToHtml(code, {
        lang: lang,
        theme: themeName,
        // Custom transformer for line numbers
        transformers: [
          {
            line(node, line) {
              node.properties["data-line"] = line;
              // Highlight selected lines
              if (highlightedLines.includes(line)) {
                this.addClassToHast(node, "highlighted-line");
              }
            },
          },
        ],
      });
    };

    generateHighlightedHtml().then(setHighlightedHtml);
  }, [code, selectedLanguage, highlighter, highlightedLines, themeName]);

  // Render the highlighted HTML
  return (
    <div
      className={styles.formatted}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
};
```

**Key Features**:
- Lazy loads languages on demand
- Uses transformers for custom rendering
- Supports line highlighting
- Handles theme switching
- HTML escaping for plaintext
- Performance: Only re-highlights when code/language changes

---

### 6. CSS Strategy

Ray.so uses **CSS modules + CSS variables**:

```css
/* Editor.module.css */
.editor {
  --editor-padding: 16px;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bg-input);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  font-family: 'JetBrains Mono';
}

.textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--editor-padding);
  background: transparent;
  color: transparent;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  border: none;
  z-index: 1;
}

.formatted {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--editor-padding);
  background: var(--bg-input);
  fon
