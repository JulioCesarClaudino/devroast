# DevRoast Specifications

Este diretório contém as especificações técnicas para features do DevRoast.

## Documentos Disponíveis

### 📋 `EDITOR_SYNTAX_HIGHLIGHT_SPECIFICATION.md` (Principal)

Especificação completa para implementação do editor com syntax highlighting.

**Contém**:
- ✅ Pesquisa de soluções (Shiki, Highlight.js, CodeMirror, Monaco)
- ✅ Arquitetura recomendada (Shiki + Manual Language Selection)
- ✅ Especificações de componentes
- ✅ Plano de implementação em 4 fases (4-6 horas)
- ✅ 6 questões críticas para decisão
- ✅ TODO checklist completo
- ✅ Análise de performance e bundle size

**Informações Chave**:
- **Solução Recomendada**: Shiki v1.0.0
- **Impacto Bundle**: +200KB (~50-60KB gzipped)
- **Tempo Implementação**: 4-6 horas
- **Confiança**: ⭐⭐⭐⭐⭐ (Very High)

## Quick Reference

### Decisão Principal
```
📌 Use Shiki + Manual Language Selection

Por quê?
├─ Production-proven (usado por ray.so)
├─ Melhor acurácia (TextMate grammars)
├─ 50+ themes inclusos
├─ ~200KB bundle (aceitável)
└─ 4-6 horas implementação
```

### Arquitetura
```
┌─────────────────────────────────┐
│  Code Editor Container          │
├─────────────────────────────────┤
│  • Textarea (transparent)       │ ← User edits here
│  • Highlighted Code (colored)   │ ← Shiki renders here
│  • Language Selector (dropdown) │ ← User selects language
└─────────────────────────────────┘
```

### Timeline
- **Phase 1** (3-4h): Core highlighting + integração
- **Phase 2** (1-2h): UI polish + language selector
- **Phase 3** (1-2h): Otimização + performance
- **Phase 4** (2-3h): Features extras (opcional)

## Como Usar Este Documento

### Se você tem 5 minutos ⏱️
1. Leia a seção "Executive Summary"
2. Veja a tabela de comparação de soluções
3. Revise as questions & decisions

### Se você tem 30 minutos 📖
1. Leia o documento todo
2. Revise a arquitetura
3. Entenda as 4 fases
4. Responda as 6 questões

### Se você vai implementar 💻
1. Leia tudo
2. Estude Ray.so Deep Dive (referência)
3. Siga o checklist Phase 1
4. Use SYNTAX_HIGHLIGHTING_IMPLEMENTATION.md para código

## Próximos Passos

### 🔴 Bloqueadores (Esperar resposta)
- [ ] Responder 6 questões de decisão
- [ ] Confirmar linguagens iniciais
- [ ] Definir estratégia de temas

### 🟡 A Fazer (Pronto para começar)
- [ ] Criar branch feature
- [ ] Instalar Shiki
- [ ] Implementar Phase 1

### 🟢 Documentação (Já feita)
- [x] Pesquisa técnica completa
- [x] Especificação de componentes
- [x] Plano de implementação
- [x] Análise de performance

## Documentos de Referência

Outros arquivos na raiz do projeto que servem como referência:

- `SYNTAX_HIGHLIGHTING_RESEARCH.md` - Análise técnica detalhada
- `SYNTAX_HIGHLIGHTING_SUMMARY.md` - Sumário executivo
- `SYNTAX_HIGHLIGHTING_IMPLEMENTATION.md` - Código pronto para usar
- `RAY_SO_DEEP_DIVE.md` - Estudo da implementação do ray.so

## Questões Críticas

Este documento contém 6 questões que precisam ser respondidas antes de começar a implementação:

| Q | Tópico | Prioridade |
|---|--------|-----------|
| 1 | Quantas linguagens suportar inicialmente? | 🔴 Alta |
| 2 | Auto-detect de linguagem? | 🔴 Alta |
| 3 | Suporte de múltiplos temas? | 🟡 Média |
| 4 | Integração com roasting? | 🔴 Alta |
| 5 | Experience móvel? | 🟡 Média |
| 6 | Fallback em caso de erro? | 🟡 Média |

**Veja as seções específicas no documento para detalhes.**

## Componentes a Criar

```
src/
├── lib/
│   └── hooks/
│       └── useHighlighter.ts         ← Nova
├── components/
│   ├── ui/
│   │   └── code-highlighter.tsx      ← Nova
│   └── home/
│       ├── code-editor.tsx           ← Atualizar
│       └── language-selector.tsx     ← Nova
```

## Performance Esperada

```
Bundle Impact:
  Before:  ~100KB (gzipped)
  After:   ~150KB (gzipped)
  Aumento: +40-50% ✅ Aceitável

Highlighting:
  100 linhas: ~50-100ms ⚡
  Language switch: <200ms ⚡
  Memory: 2-5MB 💾
```

## Status

✅ **Pesquisa**: Completa  
✅ **Especificação**: Completa  
⏳ **Decisões**: Aguardando respostas  
❌ **Implementação**: Não iniciada  

---

**Última Atualização**: Março 15, 2026  
**Versão**: 1.0  
**Confiança**: ⭐⭐⭐⭐⭐
