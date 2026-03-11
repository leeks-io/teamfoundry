import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Plus, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categories = ["All", "UI/UX Design", "Web Dev", "Smart Contracts", "AI Tools", "Marketing", "Branding"];

export default function Services() {
  const { user } = useAuth();
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newService, setNewService] = useState({ title: "", description: "", price: "", delivery_days: "3", category: "UI/UX Design" });
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*, profiles!services_user_id_fkey(full_name, username, is_premium)")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const createService = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("services").insert({
        user_id: user.id,
        title: newService.title,
        description: newService.description,
        price: parseFloat(newService.price) || 0,
        delivery_days: parseInt(newService.delivery_days) || 3,
        category: newService.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowCreate(false);
      setNewService({ title: "", description: "", price: "", delivery_days: "3", category: "UI/UX Design" });
      toast.success("Service listed!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = services.filter((s: any) => {
    if (activeCat !== "All" && s.category !== activeCat) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 border-r border-border min-w-0">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Services</h1>
            {user && (
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> List a Service</Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border">
                  <DialogHeader><DialogTitle className="text-foreground">List a Service</DialogTitle></DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Input placeholder="Service title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="bg-input border-border text-foreground" />
                    <textarea placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} rows={3} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
                    <Input placeholder="Price (USDC)" type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="bg-input border-border text-foreground" />
                    <Input placeholder="Delivery days" type="number" value={newService.delivery_days} onChange={(e) => setNewService({ ...newService, delivery_days: e.target.value })} className="bg-input border-border text-foreground" />
                    <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground">
                      {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Button variant="hero" onClick={() => createService.mutate()} disabled={createService.isPending || !newService.title || !newService.price}>
                      {createService.isPending ? "Listing..." : "List Service"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${activeCat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading services...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No services found. {user ? "List your first service!" : "Sign in to list services."}</div>
          ) : (
            <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s: any) => (
                <div key={s.id} onClick={() => setSelectedService(s)} className="cursor-pointer rounded-lg border border-border bg-card transition-colors hover:border-primary">
                  <div className="relative h-36 rounded-t-lg bg-secondary">
                    {s.profiles?.is_premium && (
                      <span className="absolute right-2 top-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Premium</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">
                        {getInitials(s.profiles?.full_name)}
                      </div>
                      <span className="text-xs text-muted-foreground">{s.profiles?.full_name || "Unknown"}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-foreground">{Number(s.rating).toFixed(1)}</span>
                      <span className="text-muted-foreground">({s.reviews_count})</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{s.price} USDC</span>
                      <span className="text-xs text-muted-foreground">{s.delivery_days} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden w-[340px] shrink-0 xl:block">
          {selectedService ? (
            <div className="sticky top-12 border-l border-border p-4">
              <div className="mb-4 h-44 rounded-lg bg-secondary" />
              <h2 className="text-lg font-bold text-foreground">{selectedService.title}</h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                  {getInitials(selectedService.profiles?.full_name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedService.profiles?.full_name}</p>
                  <p className="text-xs text-muted-foreground">@{selectedService.profiles?.username || "user"}</p>
                </div>
              </div>
              {selectedService.description && (
                <p className="mt-3 text-sm text-muted-foreground">{selectedService.description}</p>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ tier: "Basic", m: 1 }, { tier: "Standard", m: 1.5 }, { tier: "Premium", m: 2.5 }].map((t) => (
                  <div key={t.tier} className={`rounded-lg border p-3 text-center text-sm ${t.tier === "Standard" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <p className="font-medium text-foreground">{t.tier}</p>
                    <p className="mt-1 font-bold text-primary">{Math.round(Number(selectedService.price) * t.m)} USDC</p>
                  </div>
                ))}
              </div>
              <Button variant="hero" className="mt-4 w-full">Order Now — {selectedService.price} USDC</Button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Protected by Foundry Escrow
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center p-4 text-sm text-muted-foreground">Click a service to see details</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
