# DevRoast 🔥

Uma plataforma divertida de crítica de código onde seu código recebe uma avaliação com um "roast score". Construída durante o evento **NLW (Next Level Week)** da Rocketseat.

## Sobre

DevRoast é uma aplicação web interativa que permite aos desenvolvedores colar seu código e receber feedback engraçado e construtivo com um "roast score" que avalia a qualidade do código de forma divertida e entretida. A plataforma combina humor com análise real de código para ajudar desenvolvedores a aprender e melhorar.

Construída com tecnologias web modernas durante o evento educacional da Rocketseat.

## Funcionalidades

✨ **Editor de Código Interativo**

- Cole e edite seu código diretamente no navegador
- Exibição em tempo real com números de linha
- Interface estilo terminal para uma estética hacker

🎯 **Sistema de Roast Score**

- Obtenha um "roast score" (0-10) para seu código
- Feedback engraçado mas construtivo
- Aprenda com seus erros através do entretenimento

🏆 **Placar da Vergonha**

- Veja o pior código enviado para a plataforma
- Compita para conseguir as piores (ou melhores?) pontuações
- Veja pelo que outros desenvolvedores foram criticados

🎨 **Interface Moderna**

- Design responsivo para desktop e mobile
- Suporte a modo escuro
- Interface limpa e amigável para desenvolvedores

## Stack de Tecnologia

- **Framework Frontend**: [Next.js 16](https://nextjs.org/) com React 19
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) + [Tailwind Variants](https://www.tailwind-variants.org/)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/)
- **Componentes**: [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Destaque de Código**: [Shiki](https://shiki.matsu.io/)
- **Qualidade de Código**: [Biome](https://biomejs.dev/), [ESLint](https://eslint.org/)

## Iniciando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seuusuario/devroast.git
cd devroast

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Desenvolvimento

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Inicia o servidor de produção
npm run formate  # Formata código com Biome
npm run lint     # Executa verificações com ESLint
```

## Estrutura do Projeto

```
src/
├── app/              # Páginas e roteamento do Next.js
├── components/       # Componentes React
│   ├── home/        # Componentes da página inicial
│   └── ui/          # Componentes UI reutilizáveis
└── lib/             # Utilitários e helpers
```

Para diretrizes de desenvolvimento detalhadas, veja [AGENTS.md](./AGENTS.md).

## Como Usar

1. **Visite a Página Inicial** - Você verá a interface do editor de código
2. **Cole Seu Código** - Clique no editor e cole qualquer snippet de código
3. **Clique em "Roast My Code"** - Envie seu código para crítica
4. **Obtenha Sua Pontuação** - Receba uma crítica engraçada e construtiva com uma pontuação
5. **Verifique o Placar** - Veja como seu código se compara com outros

## Construído Durante a NLW

Este projeto foi construído durante o **NLW (Next Level Week)** da Rocketseat - um evento online intensivo e gratuito focado em ensinar desenvolvimento full-stack com tecnologias modernas.

🎓 [Saiba mais sobre a Rocketseat](https://www.rocketseat.com.br/)

## Roadmap Futuro

- [ ] Integração com API para crítica de código com IA
- [ ] Autenticação de usuário e histórico
- [ ] Compartilhamento e comentários em roasts
- [ ] Crítica específica por linguagem
- [ ] Toggle de modo escuro/claro
- [ ] Exportar roasts como imagens

## Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## Conectar

- 👤 [Seu Perfil GitHub](https://github.com/JulioCesarClaudino)
- 💼 [LinkedIn](https://linkedin.com/in/julio-claudino-6998ba291)
