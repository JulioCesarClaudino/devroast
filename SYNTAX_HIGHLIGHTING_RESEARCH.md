# Code Editor with Syntax Highlighting - Research & Analysis

## 1. RAY.SO IMPLEMENTATION ANALYSIS

### Architecture Overview
Ray.so implements a **split-view approach** with:
- **Left side**: Editable textarea (for code input)
- **Right side**: Highlighted code display (read-only)

### Key Components
1. **Editor.tsx** - Textarea wrapper with keyboard shortcuts
   - Handles tab indentation, enter key auto-indent, bracket closing
   - Syncs with textarea value through jotai atoms
   - Uses CSS grid to overlay textarea over highlighted code for perfect alignment
   
2. **HighlightedCode.tsx** - Shiki-powered code renderer
   - Converts code to HTML using Shiki
   - Dynamically loads language grammars on-demand
   - Applies custom transformers for line numbers and highlighting

3. **Shiki Setup (code.tsx)**
   - Uses `getHighlighterCore()` with WASM backend
   - Lazy-loads languages via dynamic imports
   - Preloads only 4 languages on startup: JavaScript, TSX, Swift, Python
   - Other languages load on-demand

### Dependencies
- **shiki** (^1.0.0) - Syntax highlighting engine
- **highlight.js** (^11.7.0) - Fallback/utility (likely for language detection)
- **jotai** - State management for code, language, themes
- **Radix UI, Base UI** - UI components
- **Tailwind CSS** - Styling

### Language Selection UI
- Manual dropdown selector with predefined language list
- Language objects contain `{ name, src }` pairs
- Languages imported as async functions for code splitting

### CSS Styling
- Uses CSS modules with CSS variables for theming
- Font support: JetBrains Mono, Geist Mono, IBM Plex Mono, etc.
- Line number display with `data-line` attributes

---

## 2. SYNTAX HIGHLIGHTING ALTERNATIVES COMPARISON

### A. SHIKI (✅ Used by ray.so - RECOMMENDED)
**Type**: Syntax highlighting engine

**Pros**:
- Modern, TextMate grammar-based (same as VSCode)
- Smallest focused bundle when using fine-grained imports
- Excellent accuracy & theming flexibility
- 50+ built-in themes
- WASM backend for browser support (getHighlighterCore)
- Lazy loads languages on demand
- Transformers API for custom rendering
- High benchmark score (83.09)

**Cons**:
- Larger initial download if not configured for fine-grained imports
- Async operation (must wait for highlighting to complete)
- Requires WASM setup for client-side use

**Bundle Size**: ~200KB (core) + language grammars (10-50KB each)

**Best For**: Production-grade apps where accuracy and theming matter (✓ DevRoast fit)

---

### B. HIGHLIGHT.JS
**Type**: Syntax highlighting library

**Pros**:
- Auto-language detection built-in (reliable, no dependencies)
- Smallest pure JS option for basic needs (~14KB)
- Simple API: `highlightAuto(code)`
- Wide language support (190+ languages)
- Can restrict detection subset for performance
- Highest benchmark score (87.7)
- Zero dependencies

**Cons**:
- Less accurate than Shiki for complex syntax
- Limited theming (basic CSS class output)
- Larger when including many languages
- Manual language selection still requires setup

**Bundle Size**: ~14KB (minified, core) + selected languages (5-20KB each)

**Best For**: Simple code display, quick implementation, bundle-size-critical projects

---

### C. PRISM.JS
**Type**: Syntax highlighting library

**Pros**:
- Lightweight (~2-3KB minified)
- Wide plugin ecosystem
- Simple to integrate

**Cons**:
- Auto-detection less reliable
- Requires separate language pack downloads
- Limited theming support
- Outdated compared to Shiki/Highlight.js
- Lowest benchmark score (26.6)

**Bundle Size**: ~2-3KB (core) + language plugins

**Best For**: Legacy projects, minimal footprint needs

---

### D. CODEMIRROR 6
**Type**: Full-featured code editor

**Pros**:
- Complete editable editor (not just highlighting)
- Excellent syntax highlighting via language extensions
- Live editing with smart indentation
- Extensible architecture
- Good React wrapper available
- High benchmark score (54.65)

**Cons**:
- Much larger bundle (~200-400KB with extensions)
- Overkill for read-only display
- Steeper learning curve
- Memory intensive

**Bundle Size**: ~200-400KB (minimal setup)

**Best For**: Full editable IDE-like experiences (not needed for DevRoast)

---

### E. MONACO EDITOR
**Type**: Full-featured code editor

**Pros**:
- Industry-standard (VSCode code editor)
- Powerful feature set
- Best for serious development tasks

**Cons**:
- Largest bundle (~2-4MB uncompressed)
- Overkill for simple display
- Complex setup
- Not recommended for read-only highlighting

**Bundle Size**: ~2-4MB (with language support)

**Best For**: Full IDE experiences (completely overkill for DevRoast)

---

## 3. AUTO LANGUAGE DETECTION SOLUTIONS

### Option A: Highlight.js Auto-Detection (✅ Recommended if using Highlight.js)
```javascript
import hljs from 'highlight.js/lib/core';
const result = hljs.highlightAuto(code, ['javascript', 'python', 'typescript']);
console.log(result.language); // Detected language
```

**Pros**:
- Built-in, zero extra dependencies
- Reliable for common languages
- Can restrict to subset for performance

**Cons**:
- Only works with highlight.js
- Redundant if using Shiki

---

### Option B: Shiki + Heuristic Detection
Create custom detection using keyword patterns:
```typescript
function detectLanguage(code: string): string {
  if (code.includes('def ') && code.includes('import ')) return 'python';
  if (code.includes('function ') || code.includes('=>')) return 'javascript';
  if (code.includes('import ') && code.includes('interface ')) return 'typescript';
  return 'plaintext';
}
```

**Pros**:
- Lightweight, no dependencies
- Works standalone with Shiki
- Fast heuristic matching

**Cons**:
- Basic, not for all languages
- Prone to false positives
- Limited accuracy for edge cases

---

### Option C: Manual Language Selection (ray.so approach - ✅ Recommended)
Let user select from dropdown.

**Pros**:
- Always accurate
- Better UX for developers
- No guessing or false positives
- Aligns with "code roasting" workflow (explicit code analysis)

**Cons**:
- Extra UI element
- User must know language name

---

## 4. BUNDLE SIZE COMPARISON (Production minified + gzip)

| Solution | Core | With 5 Languages | Notes |
|----------|------|------------------|-------|
| Shiki (fine-grained) | ~100KB | ~200-300KB | Lazy loads on demand ✅ |
| Highlight.js | ~14KB | ~80-120KB | Smallest pure JS option ✅ |
| Prism.js | ~3KB | ~50-80KB | Very small but less accurate |
| CodeMirror | ~200KB | ~400KB+ | Includes editing features |
| Monaco Editor | ~500KB+ | ~1.5MB+ | Way too large |

---

## 5. CLIENT-SIDE VS SERVER-SIDE HIGHLIGHTING

### Client-Side (Ray.so approach)
**How it works**: 
- Browser downloads highlighting engine
- Browser performs highlighting in real-time
- Works offline

**Pros**:
- Real-time updates as user types
- No server round trips
- Works offline
- Instant feedback for code roasting

**Cons**:
- Larger JavaScript bundle
- Slower on low-end devices
- Must ship WASM (for Shiki)

**Best for**: Interactive editors with live preview ✅ Perfect for DevRoast

---

### Server-Side
**How it works**:
- Backend does highlighting
- Returns highlighted HTML

**Pros**:
- Smaller client bundle
- Faster on weak devices

**Cons**:
- Network latency
- Can't update in real-time
- Requires API calls
- Not ideal for interactive roasting

**Best for**: Static code display, traditional servers

---

## 6. RECOMMENDED APPROACH FOR DEVROAST

### 🎯 PRIMARY RECOMMENDATION: Shiki + Client-Side + Manual Language Selection

**Rationale**:
1. ✅ **Shiki** offers best accuracy/flexibility trade-off (83.09 score)
2. ✅ **Client-side** enables live highlighting as users paste/type
3. ✅ **Manual selection** ensures accuracy (users know their language)
4. ✅ **Lazy loading** keeps initial bundle small (~200KB total)
5. ✅ **Proven in production** by ray.so at scale
6. ✅ **Next.js optimized** - dynamic imports work seamlessly
7. ✅ **Tailwind compatible** - easy theming with Tailwind

### Implementation Strategy

```typescript
// 1. Setup Shiki with fine-grained imports
import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

// 2. Create hook for lazy initialization
export async function initializeHighlighter() {
  return getHighlighterCore({
    themes: ['github-dark', 'github-light'],
    langs: [
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/python.mjs'),
      import('shiki/langs/typescript.mjs'),
    ],
    loadWasm: getWasm,
  });
}

// 3. Load additional languages on demand
async function loadLanguage(highlighter: Highlighter, lang: string) {
  const loaded = highlighter.getLoadedLanguages() || [];
  if (!loaded.includes(lang)) {
    await highlighter.loadLanguage(
      await import(`shiki/langs/${lang}.mjs`)
    );
  }
}

// 4. Highlight code
const html = highlighter.codeToHtml(code, { 
  lang: 'javascript',
  theme: 'github-dark'
});
```

### UI Pattern
- Textarea for code input (similar to ray.so)
- Radix UI Select dropdown for language choice
- Live highlighted preview component
- Initial 3 languages preloaded, others lazy-loaded on selection

### Bundle Size Estimate
- Shiki core: ~100KB
- Initial 3 language modules: ~80KB
- Themes: ~20KB
- **Total initial: ~200KB** (will be further reduced in Next.js build)
- Lazy-loaded languages: 10-50KB each on demand

---

## 7. ALTERNATIVE FOR BUNDLE SIZE CONSTRAINTS

### If bundle size is CRITICAL (<150KB total):
Use **Highlight.js + Limited Languages**

```typescript
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);

// Auto-detect or manual selection
const result = hljs.highlight(code, { language: selectedLang });
```

**Total Bundle**: ~80-100KB
**Pros**: Smaller initial payload, still accurate for common languages
**Cons**: Less precise syntax highlighting, fewer language support

---

## 8. INTEGRATION WITH DEVROAST PROJECT

### Current Stack Compatibility
- ✅ **Next.js 16** - Dynamic imports fully supported
- ✅ **React 19** - No SSR constraints needed
- ✅ **Tailwind CSS 4** - Easy theming integration
- ✅ **TypeScript 5** - Full type safety support
- ✅ **Radix UI** - Already using for UI components
- ✅ **jotai** - Atom-based state management (if needed)

### Required Changes
1. Add `shiki` to package.json dependencies
2. Create `useHighlighter` hook for initialization
3. Create `LanguageSelector` UI component (Radix UI Select)
4. Create `CodeHighlighter` component (similar to ray.so's)
5. Integrate into existing CodeEditor component
6. Update CodeEditor textarea styling to support overlay

### Migration Path
1. **Phase 1**: Add syntax highlighting to existing textarea
   - Time: ~2-3 hours
   - Effort: Basic component creation
   
2. **Phase 2**: Add language selector UI
   - Time: ~1-2 hours
   - Effort: UI component with Radix Select
   
3. **Phase 3**: Implement more languages
   - Time: ~1 hour per batch
   - Effort: Add language imports
   
4. **Phase 4**: Optimize bundle with fine-grained imports
   - Time: ~2-3 hours
   - Effort: Setup build analysis, optimize

---

## 9. KEY METRICS & SCORES

### Shiki (Primary Recommendation)
- **Accuracy**: ★★★★★
- **Bundle Size**: ★★★★ (with fine-grained imports)
- **Setup Complexity**: ★★★
- **Client-Side Performance**: ★★★★
- **Theme Flexibility**: ★★★★★
- **Language Support**: ★★★★★
- **Benchmark Score**: 83.09
- **Best for DevRoast**: YES ✅

### Highlight.js (Budget Alternative)
- **Accuracy**: ★★★★
- **Bundle Size**: ★★★★★
- **Setup Complexity**: ★★
- **Client-Side Performance**: ★★★★★
- **Theme Flexibility**: ★★★
- **Language Support**: ★★★★★
- **Benchmark Score**: 87.7
- **Best for DevRoast**: Only if strict bundle limits

### CodeMirror (Not Recommended)
- Not suitable for read-only code display
- Too large for current needs
- Better for full editable experiences

### Monaco Editor (Not Recommended)
- Extremely overkill
- 2-4MB bundle unacceptable
- Enterprise-grade features not needed

---

## 10. FINAL RECOMMENDATION SUMMARY

### What to use: **Shiki + Manual Language Selection**

### Why:
- Proven by ray.so in production
- Best accuracy for "code roasting" use case
- Live highlighting as user pastes code
- Manageable bundle size (~200KB initially)
- Perfect integration with Next.js 16
- Excellent theming with Tailwind CSS

### Next Steps:
1. Add `npm install shiki` to dependencies
2. Review ray.so's implementation in detail
3. Create `CodeHighlighter` component
4. Add `LanguageSelector` UI
5. Test bundle size with Next.js analyzer
6. Optimize language preloading strategy

### ROI:
- Time to implement: ~4-6 hours
- Bundle size impact: +200KB (acceptable)
- UX improvement: Major (color-coded syntax helps roasting)
- Maintenance: Low (Shiki is well-maintained)
