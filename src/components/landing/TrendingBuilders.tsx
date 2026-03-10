import { Button } from "@/components/ui/button";

const builders = [
  { name: "Alex Chen", role: "Full-Stack Dev", score: 920, avatar: "AC" },
  { name: "Maria S.", role: "UI/UX Designer", score: 875, avatar: "MS" },
  { name: "Dev Patel", role: "Smart Contracts", score: 842, avatar: "DP" },
  { name: "Luna Kim", role: "AI Engineer", score: 810, avatar: "LK" },
  { name: "Jordan T.", role: "Founder", score: 795, avatar: "JT" },
  { name: "Sara W.", role: "Marketing", score: 760, avatar: "SW" },
];

export function TrendingBuilders() {
  return (
    <section className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-foreground">
          Trending Builders
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {builders.map((b) => (
            <div
              key={b.name}
              className="flex min-w-[200px] flex-col items-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                {b.avatar}
              </div>
              <span className="font-semibold text-foreground">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.role}</span>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                {b.score}
              </span>
              <Button variant="outline" size="sm" className="w-full">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
