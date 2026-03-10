import { Button } from "@/components/ui/button";

const ideas = [
  { title: "AI-Powered Resume Builder", tags: ["AI", "SaaS", "B2C"], interested: 34, building: 12 },
  { title: "DeFi Portfolio Tracker", tags: ["Web3", "DeFi", "Dashboard"], interested: 28, building: 8 },
  { title: "Creator Subscription Platform", tags: ["SaaS", "Payments", "B2B"], interested: 19, building: 5 },
];

export function BlueprintSection() {
  return (
    <section className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-foreground">
          Blueprint Ideas
        </h2>
        <div className="flex flex-col gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.title}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              style={{ borderLeftWidth: 3, borderLeftColor: "hsl(147 95% 44%)" }}
            >
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {idea.title}
              </h3>
              <div className="mb-3 flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mb-4 text-sm text-muted-foreground">
                {idea.interested} interested · {idea.building} building
              </div>
              <div className="flex gap-3">
                <Button variant="hero" size="sm">Join Build</Button>
                <Button variant="outline" size="sm">Buy Idea</Button>
                <Button variant="ghost" size="sm">Discuss</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
