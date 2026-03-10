import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { title: "Web3 Landing Page Design", creator: "Alex Chen", price: 150, rating: 4.9, reviews: 48 },
  { title: "Smart Contract Audit", creator: "Dev Patel", price: 300, rating: 5.0, reviews: 31 },
  { title: "Brand Identity Kit", creator: "Luna Kim", price: 200, rating: 4.8, reviews: 22 },
];

export function ServicesPreview() {
  return (
    <section className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-foreground">
          Popular Services
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="mb-4 h-36 rounded-md bg-secondary" />
              <div className="mb-2 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">{s.creator}</span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{s.title}</h3>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-foreground">{s.rating}</span>
                <span className="text-muted-foreground">({s.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{s.price} USDC</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
