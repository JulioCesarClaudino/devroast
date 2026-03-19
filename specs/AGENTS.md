# Specs - AGENTS.md
## Formato de Especificação DevRoast

### O que é uma Spec?
Uma especificação é um documento detalhado criado **antes** de implementar uma feature, documentando pesquisa, arquitetura e decisões técnicas.

### Quando criar uma Spec?
- ✅ Novas features complexas (>4 horas de implementação)
- ✅ Mudanças arquiteturais significativas
- ✅ Integrações com bibliotecas externas
- ✅ Decisões técnicas importantes

### Não precisa de Spec se:
- ❌ Bug fixes simples
- ❌ Refatorações sem mudanças de funcionalidade
- ❌ Atualizações de UI menores
- ❌ Tarefas triviais (<1 hora)

---

## Estrutura Mínima de uma Spec

```markdown
# DevRoast: [Nome da Feature]
## Specification & Implementation Guide

**Status**: ✅ Research Complete - Ready for Implementation  
**Date**: [Data]  
**Estimated Time**: [X-Y horas]  

---

## Executive Summary
[1-2 parágrafos explicando o que será feito e por quê]

### Key Decision: [Decisão Principal]
[Tabela simples com tecnologia escolhida e alternativas]

---

## Problem & Goals
- **Problema**: [O que será resolvido?]
- **Objetivos**: [Bullet points dos objetivos]
- **Sucesso**: [Como saber que funcionou?]

---

## Architecture
- **Overview**: [Diagrama ou descrição da arquitetura]
- **Components**: [Componentes envolvidos]
- **Integration**: [Pontos de integração]

---

## Implementation Plan
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

---

## Questions & Decisions Needed
- [ ] [Decisão 1]
- [ ] [Decisão 2]

---

## Risks & Mitigations
| Risco | Mitigação |
|-------|-----------|
| [Risco] | [Como mitigar] |

---

## TODO Checklist
- [ ] Implementar componente X
- [ ] Integrar com Y
- [ ] Testar Z
```

---

## Seções Essenciais (Sempre incluir)

| Seção | Descrição |
|-------|-----------|
| **Executive Summary** | O quê e por quê (rápido) |
| **Problem & Goals** | Contexto do problema |
| **Architecture** | Como será implementado |
| **Implementation Plan** | Passos numerados |
| **Questions Needed** | Decisões pendentes |
| **TODO Checklist** | Itens para implementação |

---

## Seções Opcionais (Conforme necessário)

- **Research Findings**: Investigação prévia realizada
- **Technology Stack**: Bibliotecas e ferramentas
- **Performance Metrics**: Benchmarks esperados
- **Security Considerations**: Segurança
- **Risks & Mitigations**: Riscos e planos de contingência
- **Testing Strategy**: Como testar

---

## Boas Práticas

✅ **Use Markdown tables** para comparações  
✅ **Mantenha conciso** - uma página ideal  
✅ **Inclua diagrama ASCII** se complexo  
✅ **Liste decisões pendentes** claramente  
✅ **Adicione estimativa de tempo**  
✅ **Reference links** para documentação externa  

❌ Não adicione código completo (só snippets de exemplo)  
❌ Não detalhe implementação trivial  
❌ Não crie specs para bugfixes  

---

## Exemplo Rápido

```markdown
# DevRoast: Roast Result Page
## Specification & Implementation Guide

**Status**: ✅ Research Complete  
**Date**: March 19, 2026  
**Estimated Time**: 3-4 horas  

## Executive Summary
Implementar uma página dinâmica para exibir resultados individuais de roasts com UUID routing, incluindo score, code preview, análise e diff.

### Key Decision: UUID-based Dynamic Routes
Use Next.js `[id]` param com generateStaticParams para SSG.

## Problem & Goals
- **Problema**: Usuários não conseguem visualizar roasts individuais
- **Objetivos**: 
  - Criar rota dinâmica `/roast/[id]`
  - Exibir score com ScoreRing component
  - Mostrar código com syntax highlighting
  - Mostrar análise em grid
- **Sucesso**: Build passa, página gera static HTML, responsive

## Architecture
Componentes: RoastSummary, SubmittedCodeSection, AnalysisSection, DiffSection
Integrações: CodeBlock (syntax), Card (issues), ScoreRing (score)

## Implementation Plan
1. Criar RoastSummary component
2. Criar SubmittedCodeSection com CodeBlock
3. Criar AnalysisSection com grid
4. Criar DiffSection
5. Criar mock data
6. Criar página dinâmica [id]

## TODO Checklist
- [ ] RoastSummary component
- [ ] SubmittedCodeSection component
- [ ] AnalysisSection component
- [ ] DiffSection component
- [ ] Mock data
- [ ] Dynamic page route
- [ ] Test build
```

---

## Fluxo de Trabalho

1. **Pesquisa** → Crie a spec na pasta `@specs/`
2. **Revisão** → Compartilhe com o time (decisões pendentes)
3. **Implementação** → Siga o plano de implementação
4. **Validação** → Verifique contra TODO checklist
5. **Documentação** → Atualize README/docs se necessário

---

## Nomenclatura

```
UPPERCASE_WITH_UNDERSCORES.md

Exemplos:
- ROAST_RESULT_PAGE_SPECIFICATION.md
- DATABASE_SEEDING_SPECIFICATION.md
- API_INTEGRATION_SPECIFICATION.md
```

---

**Última Atualização**: March 19, 2026
