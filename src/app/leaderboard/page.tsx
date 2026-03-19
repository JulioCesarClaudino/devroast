import type { Metadata } from "next";
import { LeaderboardEntry, type LeaderboardEntryData } from "@/components/home/leaderboard-entry";
import { PageHero } from "@/components/home/page-hero";
import { PageContainer } from "@/components/home/page-container";
import { FooterHint } from "@/components/home/footer-hint";

export const metadata: Metadata = {
  title: "Leaderboard - DevRoast",
  description:
    "See the most roasted code on the internet. Check out the worst code snippets ranked by shame.",
};

const LEADERBOARD_DATA: LeaderboardEntryData[] = [
  {
    rank: 1,
    score: "1.2*",
    language: "javascript",
    lines: 3,
    code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
  },
  {
    rank: 2,
    score: "1.8",
    language: "typescript",
    lines: 3,
    code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
  },
  {
    rank: 3,
    score: "2.1",
    language: "sql",
    lines: 1,
    code: `SELECT * FROM users WHERE 1=1`,
  },
  {
    rank: 4,
    score: "2.5",
    language: "python",
    lines: 4,
    code: `import pickle
data = pickle.loads(user_input)
# never validate user input
result = eval(data)`,
  },
  {
    rank: 5,
    score: "3.2",
    language: "php",
    lines: 2,
    code: `$query = "SELECT * FROM users WHERE id=" . $_GET['id'];
$result = mysqli_query($conn, $query);`,
  },
  {
    rank: 6,
    score: "4.1",
    language: "java",
    lines: 5,
    code: `public void login(String user, String pass) {
  if (user.equals("admin") && pass.equals("password123")) {
    authenticated = true;
  }
}`,
  },
  {
    rank: 7,
    score: "4.8",
    language: "rust",
    lines: 3,
    code: `let mut password = String::new();
std::io::stdin().read_line(&mut password).unwrap();
// storing password in plain text`,
  },
  {
    rank: 8,
    score: "5.5",
    language: "go",
    lines: 4,
    code: `func processRequest(data string) error {
  return nil
  // TODO: add error handling
}`,
  },
  {
    rank: 9,
    score: "6.2",
    language: "c",
    lines: 2,
    code: `gets(buffer);
// buffer overflow waiting to happen`,
  },
  {
    rank: 10,
    score: "7.0",
    language: "bash",
    lines: 3,
    code: `#!/bin/bash
rm -rf /$1
# oops`,
  },
];

export default function LeaderboardPage() {
  const avgScore = (
    LEADERBOARD_DATA.reduce((acc, entry) => {
      const score = parseFloat(entry.score.replace("*", ""));
      return acc + score;
    }, 0) / LEADERBOARD_DATA.length
  ).toFixed(1);

  return (
    <main className="w-full bg-bg-page">
      {/* Hero Section */}
      <PageHero
        titlePrefix="#"
        title="shame leaderboard"
        subtitle="// the most roasted code on the internet"
        stats={[
          {
            label: "entries",
            value: LEADERBOARD_DATA.length,
          },
          {
            label: "avg roast",
            value: avgScore,
            highlight: true,
          },
        ]}
      />

      {/* Entries Container */}
      <PageContainer>
        {LEADERBOARD_DATA.map((entry) => (
          <LeaderboardEntry key={entry.rank} entry={entry} />
        ))}
      </PageContainer>

      {/* Footer Stats */}
      <PageContainer>
        <FooterHint
          roastCount={LEADERBOARD_DATA.length}
          avgScore={parseFloat(avgScore)}
        />
      </PageContainer>
    </main>
  );
}
