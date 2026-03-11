import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Lock, Headphones } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categoryFilters = ["All", "Web3", "AI Builders", "Design", "Founders", "DeFi", "Gaming"];

export default function Communities() {
  const { user } = useAuth();
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [communityTab, setCommunityTab] = useState("Posts");
  const [showCreate, setShowCreate] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "", category: "Web3" });
  const queryClient = useQueryClient();

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("communities").select("*").order("member_count", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ["my-memberships", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("community_members").select("community_id").eq("user_id", user.id);
      return data?.map((m: any) => m.community_id) || [];
    },
    enabled: !!user,
  });

  const createCommunity = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("communities").insert({ created_by: user.id, name: newCommunity.name, description: newCommunity.description, category: newCommunity.category });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setShowCreate(false);
      toast.success("Community created!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const joinCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!user) return;
      const { error } = await supabase.from("community_members").insert({ community_id: communityId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
      toast.success("Joined community!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = communities.filter((c: any) => {
    if (activeCat !== "All" && c.category !== activeCat) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 border-r border-border min-w-0">
          {selectedCommunity ? (
            <div>
              <button onClick={() => setSelectedCommunity(null)} className="border-b border-border p-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
              <div className="h-32 bg-secondary" />
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-lg font-bold text-foreground">{selectedCommunity.name.slice(0, 2)}</div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{selectedCommunity.name}</h1>
                    <p className="text-sm text-muted-foreground">{selectedCommunity.member_count} members</p>
                  </div>
                </div>
                {selectedCommunity.description && <p className="mt-3 text-sm text-muted-foreground">{selectedCommunity.description}</p>}
              </div>
              <div className="flex border-b border-border">
                {["Posts", "Members", "Events", "Spaces"].map((t) => (
                  <button key={t} onClick={() => setCommunityTab(t)} className={`flex-1 py-3 text-sm font-medium ${communityTab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">{communityTab} content will appear here</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border p-4">
                <h1 className="text-xl font-bold text-foreground">Communities</h1>
                {user && (
                  <Dialog open={showCreate} onOpenChange={setShowCreate}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> Create</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background border-border">
                      <DialogHeader><DialogTitle className="text-foreground">Create Community</DialogTitle></DialogHeader>
                      <div className="flex flex-col gap-3">
                        <Input placeholder="Community name" value={newCommunity.name} onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })} className="bg-input border-border text-foreground" />
                        <textarea placeholder="Description" value={newCommunity.description} onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })} rows={3} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground" />
                        <select value={newCommunity.category} onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })} className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground">
                          {categoryFilters.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Button variant="hero" onClick={() => createCommunity.mutate()} disabled={createCommunity.isPending || !newCommunity.name}>
                          {createCommunity.isPending ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search communities..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
                {categoryFilters.map((c) => (
                  <button key={c} onClick={() => setActiveCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${activeCat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
                ))}
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading communities...</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No communities found.</div>
              ) : (
                filtered.map((c: any) => (
                  <div key={c.id} onClick={() => setSelectedCommunity(c)} className="flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-secondary/30">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
                      {c.name.slice(0, 2)}
                      {c.is_private && <Lock className="absolute -right-1 -top-1 h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        <span className="text-xs text-muted-foreground">{c.member_count} members</span>
                      </div>
                      {c.description && <p className="truncate text-sm text-muted-foreground">{c.description}</p>}
                    </div>
                    <Button
                      variant={myMemberships.includes(c.id) ? "outline" : "hero"}
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); if (!myMemberships.includes(c.id)) joinCommunity.mutate(c.id); }}
                    >
                      {myMemberships.includes(c.id) ? "Joined ✓" : "Join"}
                    </Button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <div className="hidden w-[300px] shrink-0 p-4 xl:block">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Your Communities</h3>
            {communities.filter((c: any) => myMemberships.includes(c.id)).length === 0 ? (
              <p className="text-sm text-muted-foreground">Join a community to see it here.</p>
            ) : (
              communities.filter((c: any) => myMemberships.includes(c.id)).map((c: any) => (
                <div key={c.id} className="mb-3 flex items-center gap-2 last:mb-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">{c.name.slice(0, 2)}</div>
                  <span className="text-sm text-foreground">{c.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
