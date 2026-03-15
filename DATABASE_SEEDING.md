# Database Seeding Guide

Este guia explica como usar os scripts de seed para popular o banco de dados com dados realistas.

## 📋 Estrutura dos Seeds

```
src/db/seeds/
├── languages.ts    # Seed de 20 linguagens padrão
└── roasts.ts       # Seed de 100 roasts + issues, sugestões e comentários
```

## 🚀 Como Usar

### Passo 1: Instalar Dependências

Certifique-se de que o faker.js está instalado:

```bash
npm install
```

### Passo 2: Preparar o Banco de Dados

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Criar .env.local
cp .env.local.example .env.local

# Gerar migrações
npm run db:generate

# Executar migrações
npm run db:migrate
```

### Passo 3: Executar Seeds

Existem três formas de executar os seeds:

#### Opção A: Seed Completo (Recomendado)

Executa primeiro as linguagens, depois os roasts:

```bash
npm run db:seed
```

Saída esperada:
```
🌱 Iniciando seed do banco de dados...

📝 Etapa 1/5: Criando usuários...
✅ 20 usuários criados

📝 Etapa 2/5: Criando linguagens...
✅ 20 linguagens criadas

📝 Etapa 3/5: Criando 100 roasts...
✅ 100 roasts criados

📝 Etapa 4/5: Criando issues para roasts...
✅ 250 issues criadas

📝 Etapa 5/5: Criando sugestões de melhoria...
✅ 180 sugestões criadas

📝 Etapa 6/6: Criando comentários...
✅ 95 comentários criados

═══════════════════════════════════════════════════════════════
✨ SEED CONCLUÍDO COM SUCESSO!
═══════════════════════════════════════════════════════════════

📊 Resumo dos dados criados:

  👥 Usuários:              20
  📚 Linguagens:            20
  🔥 Roasts:                100
  ⚠️  Issues:                250
  💡 Sugestões:             180
  💬 Comentários:           95

═══════════════════════════════════════════════════════════════
✅ Banco de dados está pronto para uso!
```

#### Opção B: Seed Apenas de Linguagens

Se você já tem dados de roasts e quer só adicionar as linguagens:

```bash
npm run db:seed:languages
```

#### Opção C: Seed Apenas de Roasts

Se você já tem as linguagens e quer adicionar os roasts:

```bash
npm run db:seed:roasts
```

## 📊 O Que é Criado

### Linguagens (20 total)
- JavaScript, TypeScript, Python, Java, C#
- C++, C, Rust, Go, PHP
- Ruby, Swift, Kotlin, Scala, R
- SQL, HTML, CSS, Bash, Dockerfile

### Usuários (20 total)
- Nomes e emails gerados aleatoriamente com faker.js
- 70% dos roasts têm um usuário associado
- 30% dos roasts são anônimos

### Roasts (100 total)
- Código de exemplo (snippets realistas de má prática)
- Score entre 1 e 10
- Verdict automático baseado no score:
  - 1-2: "needs_serious_help"
  - 3-4: "not_great"
  - 5-6: "could_be_better"
  - 7-8: "acceptable"
  - 9-10: "pretty_good"
- Comentário criativo e divertido (20 variações)
- Views: 0-5000
- Favoritos: 0-500
- Comentários: 0-50
- 5% de chance de ser "featured"

### Issues (250+ total)
- 1-5 issues por roast
- Severidades: critical, warning, info
- 10 categorias diferentes (performance, security, readability, etc.)
- Descrições geradas com faker.js

### Sugestões de Melhoria (180+ total)
- 0-3 sugestões por roast
- Prioridades: high, medium, low
- Código original e melhorado
- Explicação detalhada

### Comentários (95+ total)
- 0-5 comentários por roast
- Conteúdo aleatório gerado
- 0-100 likes por comentário
- Datas variadas nos últimos 30 dias

## 🎨 Dados Realistas

O script usa a biblioteca `@faker-js/faker` para gerar:

- **Nomes de usuários**: Nomes reais aleatórios
- **Emails**: Endereços de email válidos e únicos
- **Textos**: Frases, parágrafos e catchphrases significativos
- **Números**: Ranges realistas para views, likes, etc.
- **Datas**: Espalhadas ao longo do último ano
- **Booleans**: Probabilidades configuráveis

## 🔧 Customizar Seeds

### Alterar número de roasts

Abra `src/db/seeds/roasts.ts` e altere:

```typescript
const roastCount = 100; // Mude para o número desejado
```

### Alterar número de usuários

```typescript
const userCount = 20; // Mude para o número desejado
```

### Adicionar novos comentários de roast

No array `ROAST_COMMENTS`, adicione novas strings:

```typescript
const ROAST_COMMENTS = [
  "Seu novo comentário criativo aqui",
  // ... outros
];
```

### Adicionar novos exemplos de código

No array `BAD_CODE_SAMPLES`, adicione novos snippets:

```typescript
const BAD_CODE_SAMPLES = [
  "seu novo código aqui",
  // ... outros
];
```

## ⚠️ Importante

### Usar em Desenvolvimento Apenas

Os seeds são feitos para **desenvolvimento local**. Não execute em produção!

### Limpar dados antes de seed

Se o banco já tem dados e você quer um seed limpo:

```bash
# (Cuidado!) Deletar todas as tabelas e recriar
docker-compose down
docker-compose up -d
npm run db:migrate
npm run db:seed
```

### Conflitos de Constraints

Se encontrar erro "violates unique constraint":

1. Verifique se as linguagens já existem
2. O script usa `ON CONFLICT DO NOTHING` para linguagens
3. Para usuários, nomes são aleatórios então conflitos são raros

## 📈 Performance

- **Tempo de execução**: ~30-60 segundos
- **Dados criados**: ~700+ registros
- **Memória usada**: ~50-100MB

### Progresso

O script mostra progresso a cada 10 registros:

```
  10/100 roasts criados...
  20/100 roasts criados...
  ...
  100/100 roasts criados...
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@faker-js/faker'"

```bash
npm install @faker-js/faker
```

### Erro: "Database connection failed"

```bash
# Verificar se Docker está rodando
docker-compose ps

# Reiniciar
docker-compose restart
```

### Erro: "relation does not exist"

```bash
# Certifique-se de ter rodado as migrações
npm run db:migrate
```

### Erro: "Process exits with code 1"

Verifique o erro completo na saída. Geralmente é:
- Conexão com DB falhou
- Schema não foi criado
- Arquivo de seed contém erro de sintaxe

## 📖 Comandos Rápidos

```bash
# Setup completo (banco + seed)
docker-compose up -d && npm run db:generate && npm run db:migrate && npm run db:seed

# Ver progresso
npm run db:seed

# Seed apenas de linguagens
npm run db:seed:languages

# Seed apenas de roasts
npm run db:seed:roasts

# Abrir Drizzle Studio para ver dados
npm run db:studio
```

## ✅ Próximos Passos

Depois de executar o seed:

1. Abra o Drizzle Studio:
   ```bash
   npm run db:studio
   ```

2. Inicie o servidor dev:
   ```bash
   npm run dev
   ```

3. Teste as queries:
   - Leaderboard deve mostrar 100 roasts
   - Dados de usuários devem ser reais
   - Comentários devem aparecer nos roasts

## 📝 Notas

- Cada execução de seed cria dados novos
- Para limpar dados antigos, delete o volume do Docker: `docker volume rm devroast_postgres_data`
- Faker.js é determinístico com seed se necessário (não usado aqui)
- ON CONFLICT garante linguagens não sejam duplicadas

Divirta-se com seus dados de teste! 🎉
