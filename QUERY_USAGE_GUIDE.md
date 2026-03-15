# Guia de Uso - Queries e Server Actions do DevRoast

Este documento explica como usar as queries do banco de dados e os Server Actions no projeto DevRoast.

## Estrutura

```
src/
├── db/
│   ├── client.ts                 # Conexão com DB
│   ├── schema.ts                 # Definição das tabelas
│   └── seeds/
│       └── languages.ts          # Seed de linguagens
├── lib/db/
│   ├── user-queries.ts           # Queries de usuários
│   ├── roast-queries.ts          # Queries de roasts
│   ├── comment-queries.ts        # Queries de comentários
│   ├── favorite-queries.ts       # Queries de favoritos
│   ├── issue-queries.ts          # Queries de issues
│   ├── language-queries.ts       # Queries de linguagens
│   └── analytics-queries.ts      # Queries de analytics
└── app/actions/
    ├── user-actions.ts           # Server Actions para usuários
    ├── roast-actions.ts          # Server Actions para roasts
    ├── language-actions.ts       # Server Actions para linguagens
    └── analytics-actions.ts      # Server Actions para analytics
```

## Fluxo de Dados

```
UI Component (Client)
        ↓
Server Action (useServerAction ou form submission)
        ↓
Query Function (Raw SQL)
        ↓
PostgreSQL Database
```

## Como Usar

### 1. Em Server Components (Renderização no Servidor)

Server Components podem chamar Query Functions diretamente:

```typescript
// src/components/home/leaderboard-preview-server.tsx
import { getLeaderboardAction } from "@/app/actions/roast-actions";

export async function LeaderboardPreview() {
  const result = await getLeaderboardAction(10);
  
  if (!result.success) {
    return <div>Erro ao carregar</div>;
  }
  
  return (
    <div>
      {result.data.map(roast => (
        <div key={roast.id}>{roast.roastScore}</div>
      ))}
    </div>
  );
}
```

### 2. Em Client Components com useTransition

Para componentes interativos, use `useTransition` (Next.js 13+):

```typescript
"use client";

import { createRoastAction } from "@/app/actions/roast-actions";
import { useTransition } from "react";

export function CreateRoastForm() {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      const result = await createRoastAction(code, null, null);
      
      if (result.success) {
        // Sucesso!
        console.log("Roast criado:", result.data);
        setCode("");
      } else {
        // Erro
        console.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)}
        disabled={isPending}
      />
      <button disabled={isPending}>
        {isPending ? "Criando..." : "Criar Roast"}
      </button>
    </form>
  );
}
```

### 3. Com formulários e form()

Para formulários HTML tradicionais:

```typescript
"use client";

import { createUserAction } from "@/app/actions/user-actions";

export function SignupForm() {
  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    
    const result = await createUserAction(username, email);
    
    if (result.success) {
      // Redirecionar ou mostrar sucesso
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="username" required />
      <input name="email" type="email" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Exemplos Práticos

### Exemplo 1: Exibir Leaderboard

**Server Component:**
```typescript
// src/components/leaderboard/top-roasts.tsx
import { getLeaderboardAction } from "@/app/actions/roast-actions";

export async function TopRoasts() {
  const result = await getLeaderboardAction(10);
  
  if (!result.success) {
    return <p>Erro ao carregar leaderboard</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Score</th>
          <th>Código</th>
          <th>Linguagem</th>
        </tr>
      </thead>
      <tbody>
        {result.data.map((roast, index) => (
          <tr key={roast.id}>
            <td>{index + 1}</td>
            <td>{roast.roastScore}</td>
            <td>{roast.code.substring(0, 50)}...</td>
            <td>{roast.languageDisplayName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Exemplo 2: Criar Roast com Validação

**Client Component:**
```typescript
"use client";

import { createRoastAction } from "@/app/actions/roast-actions";
import { useActionState } from "react";

export function CodeEditorForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const code = formData.get("code") as string;
      const languageId = formData.get("language") as string;
      
      if (!code.trim()) {
        return { error: "Código não pode estar vazio" };
      }
      
      return await createRoastAction(code, languageId, null);
    },
    null
  );

  return (
    <form action={formAction}>
      <textarea 
        name="code"
        placeholder="Cole seu código aqui..."
        required
      />
      
      <select name="language" required>
        <option value="">Selecione a linguagem</option>
        <option value="js">JavaScript</option>
        <option value="py">Python</option>
        <option value="ts">TypeScript</option>
      </select>
      
      <button disabled={isPending} type="submit">
        {isPending ? "Processando..." : "Enviar Roast"}
      </button>
      
      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">Roast criado!</p>}
    </form>
  );
}
```

### Exemplo 3: Favoritar Roast (Interactive)

**Client Component:**
```typescript
"use client";

import { toggleFavoriteAction } from "@/app/actions/roast-actions";
import { useTransition, useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  roastId: string;
  userId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ 
  roastId, 
  userId, 
  initialFavorited = false 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(roastId, userId);
      
      if (result.success) {
        setIsFavorited(result.data.favorited);
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={isFavorited ? "text-red-500" : "text-gray-500"}
    >
      <Heart fill={isFavorited ? "currentColor" : "none"} />
    </button>
  );
}
```

## Padrões Importantes

### 1. Sempre Verificar `success`

```typescript
const result = await getLeaderboardAction();

if (result.success) {
  // Usar result.data
} else {
  // Usar result.error
}
```

### 2. Tratamento de Erros

```typescript
try {
  const result = await getUserAction(userId);
  
  if (!result.success) {
    console.error(result.error);
    return <ErrorComponent message={result.error} />;
  }
  
  return <UserProfile user={result.data} />;
} catch (error) {
  console.error("Erro inesperado:", error);
  return <ErrorComponent message="Erro inesperado" />;
}
```

### 3. Carregamento

Para Server Components, use `Suspense`:

```typescript
import { Suspense } from "react";

export function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LeaderboardPreview />
    </Suspense>
  );
}
```

## Queries Disponíveis

### Usuários (`user-queries.ts`)

- `getUserById(userId)` - Obter usuário por ID
- `getUserByUsername(username)` - Obter usuário por nome
- `createUser(username, email)` - Criar novo usuário
- `updateUserEmail(userId, email)` - Atualizar email
- `updateUsername(userId, username)` - Atualizar username
- `getUserRoastStats(userId)` - Obter estatísticas do usuário
- `getUserRecentRoasts(userId, limit)` - Obter roasts recentes
- `getUserFavorites(userId, limit, offset)` - Obter favoritos

### Roasts (`roast-queries.ts`)

- `getRoastById(roastId)` - Obter roast por ID
- `getRoasts(limit, offset)` - Listar roasts com paginação
- `getLeaderboard(limit)` - Obter leaderboard
- `getRoastsByLanguage(languageId, limit, offset)` - Roasts por linguagem
- `createRoast(code, languageId, userId)` - Criar novo roast
- `incrementRoastViews(roastId)` - Incrementar visualizações
- `getIssuesByRoast(roastId)` - Obter issues do roast
- `getSuggestionsByRoast(roastId)` - Obter sugestões

### Comentários (`comment-queries.ts`)

- `getCommentsByRoast(roastId, limit, offset)` - Comentários do roast
- `createComment(roastId, userId, content)` - Criar comentário
- `updateComment(commentId, content)` - Atualizar comentário
- `deleteComment(commentId)` - Deletar comentário
- `incrementCommentLikes(commentId)` - Dar like
- `decrementCommentLikes(commentId)` - Remover like

### Favoritos (`favorite-queries.ts`)

- `toggleFavorite(roastId, userId)` - Alternar favorito
- `isFavorited(roastId, userId)` - Verificar se favoritado
- `addFavorite(roastId, userId)` - Adicionar aos favoritos
- `removeFavorite(roastId, userId)` - Remover dos favoritos

### Linguagens (`language-queries.ts`)

- `getAllLanguages()` - Obter todas as linguagens
- `getLanguageById(languageId)` - Obter linguagem por ID
- `getPopularLanguages(limit)` - Obter linguagens populares
- `getLanguagesWithCounts()` - Linguagens com contagem de roasts

### Analytics (`analytics-queries.ts`)

- `getGlobalStats()` - Estatísticas globais
- `getTrendingRoasts(limit)` - Roasts em tendência
- `getTopRatedRoasts(limit)` - Melhor classificados
- `getMostViewedRoasts(limit)` - Mais visualizados
- `getScoreDistribution()` - Distribuição de scores
- `getUserEngagementMetrics()` - Métricas de engajamento

## Setup Inicial

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Criar `.env.local`:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Iniciar PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

4. **Gerar e rodar migrações:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Semear dados padrão:**
   ```bash
   npm run db:seed
   ```

6. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## Dicas de Performance

1. **Use Suspense para carregamentos:** Suspense + Server Components é melhor que loading states manuais
2. **Pagine grandes listas:** Use `limit` e `offset` em queries
3. **Cache Server Components:** Server Components são automaticamente cacheados pelo Next.js
4. **Use revalidateTag()** para invalidar cache quando necessário

```typescript
import { revalidatePath } from "next/cache";

async function createRoastWithRevalidate(code: string, languageId: string) {
  const result = await createRoast(code, languageId, null);
  
  if (result) {
    revalidatePath("/leaderboard");
    revalidatePath("/home");
  }
  
  return result;
}
```

## Troubleshooting

### Erro: "Cannot find module 'drizzle-orm'"
- Execute: `npm install`

### Erro: "Database connection failed"
- Verifique se Docker está rodando: `docker-compose ps`
- Verifique `.env.local` tem a URL correta

### Erro: "Relation does not exist"
- Execute: `npm run db:migrate`

### Erro: "INSERT violates unique constraint"
- Verifique dados duplicados (username, email)
- Use `getUserByUsername()` ou `getUserByEmail()` antes de criar

## Próximos Passos

1. ✅ Setup do banco de dados
2. ✅ Queries criadas
3. ✅ Server Actions criados
4. 🔄 Integrar em mais componentes
5. 🔄 Criar páginas dinâmicas (perfil, roast details)
6. 🔄 Adicionar autenticação
7. 🔄 Testes automatizados

## Recursos

- [Documentação do Drizzle ORM](https://orm.drizzle.team/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Configuração do banco
