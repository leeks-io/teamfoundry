import { Button } from "@/components/ui/button";

const startups = [
  { name: "NexPay", mrr: "$4,200", users: "8.5k", price: "$45,000" },
  { name: "BuildDAO", mrr: "$1,800", users: "3.2k", price: "$22,000" },
];

export function StartupPreview() {
  return (
    <section className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-foreground">
          Startup Marketplace
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {startups.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <div>
                <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                  <span>MRR: <span className="text-foreground">{s.mrr}</span></span>
                  <span>Users: <span className="text-foreground">{s.users}</span></span>
                  <span>Price: <span className="font-bold text-primary">{s.price} USDC</span></span>
                </div>
              </div>
              <Button variant="hero" size="sm">View Startup</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
