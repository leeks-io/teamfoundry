import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Briefcase, ShoppingCart, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const exploreTabs = ["All", "Builders", "Jobs", "Services", "Startups", "Blueprints"];

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Explore() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const { data: builders = [] } = useQuery({
    queryKey: ["explore-builders"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("builder_score", { ascending: false }).limit(8);
      return data || [];
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["explore-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*, profiles!jobs_user_id_fkey(full_name)").eq("status", "open").order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["explore-services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*, profiles!services_user_id_fkey(full_name)").eq("status", "active").order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
  });

  const roleMap: Record<string, string> = { job_seeker: "Talent", freelancer: "Freelancer", founder: "Founder" };

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="border-b border-border p-4">
          <h1 className="mb-4 text-xl font-bold text-foreground">Explore</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search builders, jobs, services..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-border scrollbar-none">
          {exploreTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`shrink-0 flex-1 py-3 text-sm font-medium ${activeTab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-8">
          {(activeTab === "All" || activeTab === "Builders") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Trending Builders</h2>
              </div>
              {builders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No builders yet. Sign up to be the first!</p>
              ) : (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {builders.map((b: any) => (
                    <Link key={b.id} to={`/profile/${b.user_id}`} className="rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                        {getInitials(b.full_name)}
                      </div>
                      <p className="mt-2 font-semibold text-foreground">{b.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{roleMap[b.role] || ""}</p>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{b.builder_score}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {(activeTab === "All" || activeTab === "Jobs") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><Briefcase className="h-5 w-5" /> Hot Jobs</h2>
                <Link to="/jobs" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              {jobs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No jobs posted yet.</p>
              ) : (
                jobs.map((j: any) => (
                  <div key={j.id} className="mb-3 flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                    <div>
                      <h3 className="font-semibold text-foreground">{j.title}</h3>
                      <p className="text-sm text-muted-foreground">{j.company || j.profiles?.full_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {j.budget && <span className="font-semibold text-primary">{j.budget}</span>}
                      <Button variant="outline" size="sm">Apply</Button>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {(activeTab === "All" || activeTab === "Services") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><ShoppingCart className="h-5 w-5" /> Popular Services</h2>
                <Link to="/services" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              {services.length === 0 ? (
                <p className="text-muted-foreground text-sm">No services listed yet.</p>
              ) : (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {services.map((s: any) => (
                    <div key={s.id} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                      <div className="mb-2 h-24 rounded-md bg-secondary" />
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.profiles?.full_name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-primary">{s.price} USDC</span>
                        <span className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 fill-primary text-primary" />{Number(s.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "Startups" && (
            <section>
              <div className="mb-3"><h2 className="text-lg font-bold text-foreground">Trending Startups</h2></div>
              <p className="text-muted-foreground">Visit the <Link to="/startups" className="text-primary hover:underline">Startup Hub</Link> for the full marketplace.</p>
            </section>
          )}

          {activeTab === "Blueprints" && (
            <section>
              <div className="mb-3"><h2 className="text-lg font-bold text-foreground">Blueprint Ideas</h2></div>
              <p className="text-muted-foreground">Visit the <Link to="/startups" className="text-primary hover:underline">Startup Hub</Link> for blueprints.</p>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
