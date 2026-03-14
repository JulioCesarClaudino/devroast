# DevRoast 🔥

A humorous code roasting platform where your code gets critiqued with a roast score. Built during **Rocketseat's NLW (Next Level Week)** event.

## About

DevRoast is an interactive web application that allows developers to paste their code and receive funny, constructive feedback with a "roast score" that evaluates code quality in a fun and entertaining way. The platform combines humor with actual code analysis to help developers learn and improve.

Built with modern web technologies during Rocketseat's educational event.

## Features

✨ **Interactive Code Editor**
- Paste and edit your code directly in the browser
- Real-time display with line numbers
- Terminal-like UI for a hacker aesthetic

🎯 **Roast Scoring System**
- Get a "roast score" (0-10) for your code
- Humorous yet constructive feedback
- Learn from your mistakes through entertainment

🏆 **Shame Leaderboard**
- View the worst code submitted to the platform
- Compete to get the lowest (or highest?) scores
- See what other developers got roasted for

🎨 **Modern UI/UX**
- Responsive design for desktop and mobile
- Dark mode support
- Clean, developer-friendly interface

## Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Tailwind Variants](https://www.tailwind-variants.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Code Highlighting**: [Shiki](https://shiki.matsu.io/)
- **Code Quality**: [Biome](https://biomejs.dev/), [ESLint](https://eslint.org/)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/devroast.git
cd devroast

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run formate  # Format code with Biome
npm run lint     # Run ESLint checks
```

## Project Structure

```
src/
├── app/              # Next.js pages and routing
├── components/       # React components
│   ├── home/        # Home page components
│   └── ui/          # Reusable UI components
└── lib/             # Utilities and helpers
```

For detailed development guidelines, see [AGENTS.md](./AGENTS.md).

## How to Use

1. **Visit the Home Page** - You'll see the code editor interface
2. **Paste Your Code** - Click on the editor and paste any code snippet
3. **Click "Roast My Code"** - Submit your code for roasting
4. **Get Your Score** - Receive a funny and constructive roast with a score
5. **Check the Leaderboard** - See how your code stacks up against others

## Built During NLW

This project was built during **Rocketseat's NLW (Next Level Week)** - an intensive, free online event focused on teaching full-stack development with modern technologies.

🎓 [Learn more about Rocketseat](https://www.rocketseat.com.br/)

## Future Roadmap

- [ ] API integration for AI-powered code roasting
- [ ] User authentication and history
- [ ] Code roast sharing and comments
- [ ] Language-specific roasting
- [ ] Dark/Light mode toggle
- [ ] Export roasts as images

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - Feel free to use this project for learning and personal use.

## Connect

- 👤 [Your GitHub Profile](https://github.com/yourusername)
- 🐦 [Follow on Twitter](https://twitter.com/yourhandle)
- 💼 [LinkedIn](https://linkedin.com/in/yourprofile)

---

Made with ❤️ during Rocketseat's NLW
