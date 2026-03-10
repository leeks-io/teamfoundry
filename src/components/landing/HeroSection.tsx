import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["Jobs", "Services", "Startups", "Communities"];

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
      <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-[64px] md:leading-[1.1]">
        The Marketplace for Internet Builders
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">
        Foundry brings founders, freelancers, and job seekers together in one
        builder-first platform. Ship faster, earn in USDC.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Button variant="hero" size="lg" asChild>
          <Link to="/explore">
            Explore <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <Link to="/auth?signup=true">Join Foundry</Link>
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground"
          >
            {cat}
          </span>
        ))}
      </div>
    </section>
  );
}
