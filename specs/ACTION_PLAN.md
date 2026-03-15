# Plano de Ação: Syntax Highlighting Editor

**Status**: ✅ Pesquisa Completa + Decisões Confirmadas  
**Data**: Março 15, 2026  
**Timeline Estimado**: 4-6 horas total

---

## 🎯 Decisões Confirmadas

| # | Decisão | Escolha |
|---|---------|---------|
| 1 | Linguagens Iniciais | ✅ 3: JavaScript, Python, TypeScript |
| 2 | Auto-Detect | ✅ Não (Manual selection only) |
| 3 | Temas | ✅ Light + Dark (follow site theme) |
| 4 | Integração Roasting | ✅ Enviar linguagem, destacar output |
| 5 | Mobile | ✅ Responsivo, full-width |
| 6 | Fallback | ✅ Plaintext (sem erro) |

---

## 🚀 Próximos Passos Imediatos

### Antes de Começar a Implementar
1. ✅ Ler `/specs/EDITOR_SYNTAX_HIGHLIGHT_SPECIFICATION.md` completo
2. ✅ Entender arquitetura (textarea overlay + highlighted code)
3. ✅ Revisar ray.so implementation (reference code)
4. ✅ Confirmar decisões (**DONE** ✓)

### Próxima Ação
**Criar feature branch e começar Phase 1**

---

## 📋 Phase 1: Foundation (3-4 horas)

### Dependências
```bash
npm install shiki
```

### Arquivos a Criar

**1. `src/lib/constants/languages.ts`** (Novo)
```typescript
export type Language = {
  id: string;
  name: string;
  fileExtension: string;
};

export const LANGUAGES = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    fileExtension: '.js',
  },
  python: {
    id: 'python',
    name: 'Python',
    fileExtension: '.py',
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    fileExtension: '.ts',
  },
};

export const DEFAULT_LANGUAGE = LANGUAGES.javascript;
```

**2. `src/lib/hooks/useHighlighter.ts`** (Novo)
- Initialize Shiki with WASM
- Preload 3 languages
- Manage highlighter lifecycle
- Handle language loading

**3. `src/components/ui/code-highlighter.tsx`** (Novo)
- Accept code + language props
- Generate highlighted HTML via Shiki
- Handle async rendering
- Plaintext fallback

**4. `src/components/home/code-editor.tsx`** (Atualizar)
- Add language state
- Wrap with CodeHighlighter
- Pass state to children
- Handle textarea changes

### Testes Phase 1
```bash
# Test with sample code snippets
const js = `console.log('Hello');`;
const py = `print("Hello")`;
const ts = `const x: string = 'Hello';`;
```

---

## 📋 Phase 2: UI (1-2 horas)

### Arquivos a Criar

**1. `src/components/home/language-selector.tsx`** (Novo)
- Use Radix UI Select component
- Display 3 languages
- Handle onChange callback
- Show loading state during language load

### Integração
- Add LanguageSelector ao CodeEditor
- Estilizar com Tailwind CSS
- Testar keyboard navigation
- Verificar mobile responsiveness

---

## 📋 Phase 3: Optimization (1-2 horas)

### Tasks
1. Analisar bundle: `npm run build`
2. Implementar lazy-loading para futuras linguagens
3. Adicionar error boundary
4. Testar fallback plaintext
5. Monitorar Core Web Vitals

### Bundle Esperado
```
Before: ~100KB gzipped
After:  ~165KB gzipped
Delta:  +40-50% ✅ Acceptable
```

---

## 🔌 Integração com Roasting

### API Update Necessário
```typescript
// Antes
POST /api/roast
{ code: string }

// Depois
POST /api/roast
{ code: string, language: string }
```

### Output Enhancement
- Mostrar código destacado nos resultados
- Usar linguagem no contexto de feedback
- Melhor apresentação visual

---

## 📊 Arquitetura Visual

```
HomePage
└── CodeEditor
    ├── LanguageSelector (dropdown)
    │   └── onLanguageChange(lang)
    │
    ├── Textarea (transparent, z-10)
    │   └── User edits code here
    │
    └── CodeHighlighter (colored, z-5)
        └── Shiki renders highlighted code
```

---

## 🧪 Checkpoints de Testes

### Phase 1 Checkpoint
- [ ] Syntax highlighting funcionando
- [ ] Real-time updates ao digitar
- [ ] 3 linguagens testadas
- [ ] CSS overlay alinhado perfeitamente

### Phase 2 Checkpoint
- [ ] Language selector visível
- [ ] Language switching funciona
- [ ] UI responsivo no mobile
- [ ] Keyboard navigation OK

### Phase 3 Checkpoint
- [ ] Bundle size dentro do esperado
- [ ] Performance metrics OK
- [ ] Error fallback funciona
- [ ] Web Vitals não degradadas

---

## ⚠️ Riscos & Mitigação

| Risco | Mitigação |
|-------|-----------|
| WASM não carrega em alguns browsers | Fallback plaintext automático |
| Bundle size > 250KB | Lazy-load linguagens futuras |
| Performance em mobile | Testar em devices reais |
| Language grammar muito grande | Usar apenas 3 preloaded |

---

## 📚 Referências Principais

1. **Shiki Docs**: https://shiki.style
2. **Ray.so Code**: https://github.com/raycast/ray-so
3. **Deep Dive Analysis**: Ver `/RAY_SO_DEEP_DIVE.md`
4. **Implementation Examples**: Ver `/SYNTAX_HIGHLIGHTING_IMPLEMENTATION.md`

---

## ✅ Success Criteria

- [x] Decisões confirmadas
- [ ] Phase 1 implementado (3-4h)
- [ ] Phase 2 implementado (1-2h)
- [ ] Phase 3 otimizado (1-2h)
- [ ] Tests passando
- [ ] PR review aprovado
- [ ] Merged to main

---

## 📞 Próximo Passo

**Criar branch e começar implementação**:

```bash
git checkout -b feat/syntax-highlighting-editor
npm install shiki
# Start Phase 1
```

Quer que eu comece a implementação ou tem mais alguma dúvida sobre o plano?

---

**Documento**: Action Plan  
**Status**: Ready for Implementation  
**Last Updated**: March 15, 2026
