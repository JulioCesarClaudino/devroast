# 🚀 PLANO DE EXECUÇÃO - DevRoast Code Editor Fix

## Objetivo Final
✅ Resolver 100% o problema de duplicação de texto ao fazer scroll no Code Editor
✅ Adicionar detecção automática de linguagem
✅ Limitar altura do editor para não ficar muito grande

---

## FASE 1: Criar `src/lib/utils/detectLanguage.ts`

Arquivo novo que será criado com as funções:
- `detectLanguage(code: string): Language | null` - detecta linguagem e retorna objeto Language
- `detectLanguageId(code: string): string | null` - detecta linguagem e retorna ID

Lógica:
- Analisa padrões comuns de cada linguagem (regex)
- Padrões Python: `def`, `import`, indentação, `class`, `for/while` com `:`
- Padrões TypeScript: `interface`, `type`, type annotations (`: string|number|etc`)
- Padrões JavaScript: `const/let/var`, `=>`, `Promise`, `async/await`
- Sistema de pontuação (Python/TS = 2 pts, JS = 1.5 pts, bônus especiais)
- Mínimo 3 pontos para considerar detectado

---

## FASE 2: Refatorar `src/components/home/highlighted-code.tsx`

### Mudanças principais:

**ANTES:**
```typescript
// position: absolute inset: 0 marginLeft: 48px
// overflow-auto em elemento absolutamente posicionado
// Problema: scroll não sincroniza corretamente
```

**DEPOIS:**
```typescript
// flex-1 para ocupar espaço disponível
// Remover position: absolute
// Remover inset: 0 e marginLeft
// Manter overflow-auto para scroll sincronizado
// padding: 16px (mesmo que textarea)
// pointer-events: none para não interferir
```

Estrutura do JSX:
- `<div>` com `flex-1`, `font-mono text-sm leading-6`, `whitespace-pre-wrap break-words`
- Dentro: `<pre>` com `margin: 0`, `white-space: pre-wrap`, `word-wrap: break-word`
- Dentro da pre: `<code>` com `dangerouslySetInnerHTML`

---

## FASE 3: Refatorar `src/components/home/code-editor.tsx`

### Estado adicional:
```typescript
const [userSelectedLanguage, setUserSelectedLanguage] = useState(false);
```
Para rastrear se usuário selecionou manualmente (não auto-detectar se true)

### Mudanças na estrutura JSX:

**ANTES:**
```
<div className="relative flex overflow-hidden">
  └─ Line Numbers
  └─ HighlightedCode (position: absolute)
  └─ Textarea (relative flex-1)
```

**DEPOIS:**
```
<div className="flex flex-col max-h-96 md:max-h-[500px]">
  └─ Header (status dots)
  └─ <div className="flex overflow-hidden flex-1">
     └─ Line Numbers (flex-shrink-0 w-12)
     └─ <div className="flex flex-1 relative overflow-hidden">
        └─ Textarea (absolute inset-0)
        └─ HighlightedCode (flex-1)
```

### Handlers adicionais:

**`handleLanguageChange`:**
```typescript
const handleLanguageChange = (language: Language) => {
  setSelectedLanguage(language);
  setUserSelectedLanguage(true); // Marcar que foi seleção manual
};
```

**Efeito de detecção automática (useEffect):**
```typescript
// Quando code muda, se userSelectedLanguage === false
// Tentar detectar e atualizar selectedLanguage
useEffect(() => {
  if (userSelectedLanguage) return; // Não detectar se usuário selecionou
  
  const detected = detectLanguage(code);
  if (detected && detected.id !== selectedLanguage.id) {
    setSelectedLanguage(detected);
  }
}, [code, userSelectedLanguage, selectedLanguage]);
```

### Mudanças no Textarea:
- Remover `relative flex-1`
- Adicionar `absolute inset-0`
- Manter todos os estilos de sync de scroll

### Props do LanguageSelector:
```typescript
<LanguageSelector
  selectedLanguage={selectedLanguage}
  onLanguageChange={handleLanguageChange}
  isLoading={!isInitialized}
/>
```

---

## FASE 4: Testes (EXECUTAR TODOS ATÉ RESOLVER 100%)

### Teste 1: Scroll sem duplicação
```
1. npm run dev
2. Digitar/colar código pequeno
3. Fazer scroll no editor
4. Verificar: NENHUMA duplicação de texto
5. Resultado: ✅ ou ❌ + debug
```

### Teste 2: Código pequeno, médio, grande
```
1. Testar com 5 linhas
2. Testar com 30 linhas
3. Testar com 100+ linhas
4. Cada um: scroll sem duplicação
5. Resultado: ✅ ou ❌ + debug
```

### Teste 3: 3 linguagens diferentes
```
1. JavaScript:
   const x = 10;
   console.log(x);
   Scroll: SEM duplicação ✅
   
2. Python:
   def hello():
       print("world")
   Scroll: SEM duplicação ✅
   
3. TypeScript:
   interface User {
     name: string;
   }
   Scroll: SEM duplicação ✅
```

### Teste 4: Detecção automática
```
1. Colar código JavaScript
   Verificar: seleção muda para JavaScript ✅
   
2. Colar código Python
   Verificar: seleção muda para Python ✅
   
3. Colar código TypeScript
   Verificar: seleção muda para TypeScript ✅
   
4. Selecionar manualmente Python
5. Digitar código JavaScript
   Verificar: NÃO muda de Python ✅
```

### Teste 5: Responsividade
```
1. Desktop (1920px+): max-h-[500px] ✅
2. Tablet (768px): max-h-96 ✅
3. Mobile (375px): max-h-96 ✅
4. Verificar: Editor não fica muito grande ✅
```

### Teste 6: Nada quebrado
```
1. Página carrega normalmente ✅
2. Hero section aparece ✅
3. Actions bar funciona ✅
4. Footer hint aparece ✅
5. Leaderboard preview aparece ✅
```

### Teste 7: Build sem erros
```
npm run build
✅ Compiled successfully
✅ No TypeScript errors
✅ All pages generated
```

---

## Arquivos a Serem Criados/Modificados

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/lib/utils/detectLanguage.ts` | CRIAR | Funções de detecção de linguagem |
| `src/components/home/code-editor.tsx` | MODIFICAR | Refatorar layout + detecção automática |
| `src/components/home/highlighted-code.tsx` | MODIFICAR | Remover position: absolute |

---

## Ordem de Execução

1. ✅ Criar `detectLanguage.ts`
2. ✅ Refatorar `highlighted-code.tsx`
3. ✅ Refatorar `code-editor.tsx`
4. ✅ Teste 1: Scroll sem duplicação
5. ✅ Teste 2: Código pequeno/médio/grande
6. ✅ Teste 3: 3 linguagens
7. ✅ Teste 4: Detecção automática
8. ✅ Teste 5: Responsividade
9. ✅ Teste 6: Nada quebrado
10. ✅ Teste 7: Build sem erros
11. ✅ Commit e push (se tudo passar)

---

## Decisões Tomadas

✅ **Altura do editor**: `max-h-96` (mobile) / `max-h-[500px]` (desktop)
✅ **Detecção automática**: Apenas se usuário não selecionou manualmente
✅ **Default code**: Manter `// paste your code here...`
✅ **Arquitetura**: Remover dual-layer com position absolute
✅ **Scroll sync**: Via event listener que copia scrollTop/scrollLeft

---

## Status

- [ ] FASE 1: Criar detectLanguage.ts
- [ ] FASE 2: Refatorar highlighted-code.tsx
- [ ] FASE 3: Refatorar code-editor.tsx
- [ ] FASE 4: Testes (até 100% resolvido)
- [ ] ✅ Commit & Push

---

**PRONTO PARA EXECUTAR? Clique em "COMEÇAR EXECUÇÃO" para começar!**
