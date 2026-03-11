import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const tabs = ["Startups For Sale", "Post Your Startup", "Find Cofounders", "Blueprints"];
const stages = ["idea", "mvp", "revenue"];
const lookingForOptions = ["Cofounder", "Dev", "Designer", "Marketer", "Investor"];

export default function Startups() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [newStartup, setNewStartup] = useState({ name: "", tagline: "", description: "", industry: "", stage: "", looking_for: new Set<string>(), price: "" });
  const queryClient = useQueryClient();

  const { data: startups = [], isLoading } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("startups").select("*, profiles!startups_user_id_fkey(full_name, username)").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const createStartup = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("startups").insert({
        user_id: user.id,
        name: newStartup.name,
        tagline: newStartup.tagline,
        description: newStartup.description,
        industry: newStartup.industry,
        stage: newStartup.stage || "idea",
        looking_for: Array.from(newStartup.looking_for),
        price: parseFloat(newStartup.price) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
      setActiveTab(tabs[0]);
      toast.success("Startup posted!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleNeed = (n: string) => {
    const next = new Set(newStartup.looking_for);
    next.has(n) ? next.delete(n) : next.add(n);
    setNewStartup({ ...newStartup, looking_for: next });
  };

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Startup Hub</h1>
        </div>

        <div className="flex overflow-x-auto border-b border-border scrollbar-none">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "Startups For Sale" && (
            isLoading ? (
              <div className="text-center text-muted-foreground">Loading startups...</div>
            ) : startups.length === 0 ? (
              <div className="text-center text-muted-foreground">No startups listed yet.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {startups.map((s: any) => (
                  <div key={s.id} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">{s.name.slice(0, 2)}</div>
                      <div>
                        <h3 className="font-bold text-foreground">{s.name}</h3>
                        {s.industry && <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{s.industry}</span>}
                      </div>
                    </div>
                    {s.tagline && <p className="text-sm text-muted-foreground">{s.tagline}</p>}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div><p className="text-muted-foreground">MRR</p><p className="font-semibold text-foreground">${Number(s.mrr).toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground">Users</p><p className="font-semibold text-foreground">{s.users_count?.toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground">Stage</p><p className="font-semibold text-primary capitalize">{s.stage}</p></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      {Number(s.price) > 0 && <span className="text-lg font-bold text-primary">${Number(s.price).toLocaleString()} USDC</span>}
                      <div className="flex gap-2">
                        <Button variant="hero" size="sm">View Startup</Button>
                        <Button variant="ghost" size="sm"><MessageCircle className="h-4 w-4" /> Offer</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === "Post Your Startup" && (
            <div className="mx-auto max-w-lg">
              {!user ? (
                <div className="text-center text-muted-foreground">Sign in to post a startup.</div>
              ) : (
                <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
                  <Input placeholder="Startup name" value={newStartup.name} onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })} className="bg-input border-border text-foreground" />
                  <Input placeholder="Tagline" value={newStartup.tagline} onChange={(e) => setNewStartup({ ...newStartup, tagline: e.target.value })} className="bg-input border-border text-foreground" />
                  <textarea placeholder="Description" value={newStartup.description} onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })} rows={4} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
                  <Input placeholder="Industry" value={newStartup.industry} onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })} className="bg-input border-border text-foreground" />
                  <Input placeholder="Price (USDC)" type="number" value={newStartup.price} onChange={(e) => setNewStartup({ ...newStartup, price: e.target.value })} className="bg-input border-border text-foreground" />
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Stage</p>
                    <div className="flex gap-2">
                      {stages.map((s) => (
                        <button key={s} onClick={() => setNewStartup({ ...newStartup, stage: s })} className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${newStartup.stage === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Looking for</p>
                    <div className="flex flex-wrap gap-2">
                      {lookingForOptions.map((n) => (
                        <button key={n} onClick={() => toggleNeed(n)} className={`rounded-full px-3 py-1.5 text-sm transition-colors ${newStartup.looking_for.has(n) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button variant="hero" className="mt-2" onClick={() => createStartup.mutate()} disabled={createStartup.isPending || !newStartup.name}>
                    {createStartup.isPending ? "Posting..." : "Post Startup"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Find Cofounders" && (
            <div className="space-y-4">
              {startups.filter((s: any) => s.looking_for?.length > 0).length === 0 ? (
                <div className="text-center text-muted-foreground">No cofounder searches yet.</div>
              ) : (
                startups.filter((s: any) => s.looking_for?.length > 0).map((s: any) => (
                  <div key={s.id} className="rounded-lg border border-border bg-card p-4">
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">Looking for: {s.looking_for?.join(", ")}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm">Connect</Button>
                      <Button variant="ghost" size="sm">View Profile</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Blueprints" && (
            <div className="text-center text-muted-foreground">Blueprint Ideas coming soon.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
