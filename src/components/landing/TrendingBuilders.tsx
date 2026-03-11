import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function TrendingBuilders() {
  const { data: builders = [] } = useQuery({
    queryKey: ["landing-builders"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("builder_score", { ascending: false }).limit(6);
      return data || [];
    },
  });

  const roleMap: Record<string, string> = { job_seeker: "Talent", freelancer: "Freelancer", founder: "Founder" };

  return (
    <section className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-foreground">Trending Builders</h2>
        {builders.length === 0 ? (
          <p className="text-muted-foreground">Be the first to join Foundry and build your reputation!</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {builders.map((b: any) => (
              <Link
                key={b.id}
                to={`/profile/${b.user_id}`}
                className="flex min-w-[200px] flex-col items-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {getInitials(b.full_name)}
                </div>
                <span className="font-semibold text-foreground">{b.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">{roleMap[b.role] || ""}</span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">{b.builder_score}</span>
                <Button variant="outline" size="sm" className="w-full">Follow</Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
