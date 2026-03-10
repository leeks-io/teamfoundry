import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Lock, Users, Headphones } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Web3", "AI Builders", "Design", "Founders", "DeFi", "Gaming"];

const featured = [
  { name: "Solana Builders", members: "2.4k", category: "Web3", joined: false },
  { name: "AI Engineers Hub", members: "1.8k", category: "AI Builders", joined: true },
  { name: "Design Masters", members: "950", category: "Design", joined: false },
  { name: "Founder Circle", members: "3.1k", category: "Founders", joined: false },
  { name: "DeFi Degens", members: "4.2k", category: "DeFi", joined: true },
];

const communities = [
  { name: "Solana Builders", members: "2.4k", desc: "A community for builders on the Solana ecosystem. Share projects, find collaborators.", category: "Web3", isLive: true, liveTopic: "How I raised $100k in 30 days", listeners: 245 },
  { name: "AI Engineers Hub", members: "1.8k", desc: "Discuss the latest in AI/ML, share tools, and collaborate on projects.", category: "AI Builders", isLive: false },
  { name: "Design Masters", members: "950", desc: "UI/UX designers sharing work, critiques, and resources.", category: "Design", isLive: false },
  { name: "Founder Circle", members: "3.1k", desc: "Founders helping founders. Share wins, struggles, and advice.", category: "Founders", isLive: true, liveTopic: "Building in public — week 12 update", listeners: 89 },
  { name: "DeFi Degens", members: "4.2k", desc: "All things DeFi — protocols, yield farming, new launches.", category: "DeFi", isLive: false },
  { name: "GameFi Guild", members: "1.2k", desc: "Gaming meets Web3. Discuss GameFi projects and P2E mechanics.", category: "Gaming", isLive: false },
  { name: "Private Alpha", members: "320", desc: "Exclusive community for premium members. Early access to deals.", category: "Web3", isLive: false, isPrivate: true },
];

export default function Communities() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedCommunity, setSelectedCommunity] = useState<typeof communities[0] | null>(null);
  const [communityTab, setCommunityTab] = useState("Posts");

  const filtered = activeCat === "All" ? communities : communities.filter(c => c.category === activeCat);

  return (
    <DashboardLayout>
      <div className="flex">
        <div className="flex-1 border-r border-border">
          {selectedCommunity ? (
            // Community detail view
            <div>
              <button onClick={() => setSelectedCommunity(null)} className="border-b border-border p-4 text-sm text-muted-foreground hover:text-foreground">
                ← Back to Communities
              </button>
              <div className="h-32 bg-secondary" />
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-lg font-bold text-foreground">
                    {selectedCommunity.name.slice(0, 2)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{selectedCommunity.name}</h1>
                    <p className="text-sm text-muted-foreground">{selectedCommunity.members} members</p>
                  </div>
                  <Button variant="hero" size="sm" className="ml-auto">Join</Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{selectedCommunity.desc}</p>
              </div>

              {/* Live Space */}
              {selectedCommunity.isLive && (
                <div className="border-b border-border p-4">
                  <div className="rounded-lg border border-primary bg-primary/5 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      <span className="font-medium text-foreground">Live Space</span>
                    </div>
                    <p className="mt-1 font-semibold text-foreground">{selectedCommunity.liveTopic}</p>
                    <p className="mt-1 text-xs text-muted-foreground">+{selectedCommunity.listeners} listening</p>
                    <Button variant="hero" size="sm" className="mt-3">
                      <Headphones className="mr-1 h-4 w-4" /> Join Space
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex border-b border-border">
                {["Posts", "Members", "Events", "Spaces"].map((t) => (
                  <button key={t} onClick={() => setCommunityTab(t)} className={`flex-1 py-3 text-sm font-medium ${communityTab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">
                {communityTab} content will appear here
              </div>
            </div>
          ) : (
            // Main view
            <>
              <div className="flex items-center justify-between border-b border-border p-4">
                <h1 className="text-xl font-bold text-foreground">Communities</h1>
                <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> Create Community</Button>
              </div>

              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search communities..." className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>

              {/* Featured */}
              <div className="border-b border-border p-4">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Featured Communities</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {featured.map((f) => (
                    <div key={f.name} className="min-w-[200px] rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 h-16 rounded-md bg-secondary" />
                      <h3 className="font-semibold text-foreground">{f.name}</h3>
                      <p className="text-xs text-muted-foreground">{f.members} members</p>
                      <Button variant={f.joined ? "outline" : "hero"} size="sm" className="mt-2 w-full">
                        {f.joined ? "Joined ✓" : "Join"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
                {categories.map((c) => (
                  <button key={c} onClick={() => setActiveCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${activeCat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                    {c}
                  </button>
                ))}
              </div>

              {/* List */}
              {filtered.map((c) => (
                <div
                  key={c.name}
                  onClick={() => !c.isPrivate && setSelectedCommunity(c)}
                  className="flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-secondary/30"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
                    {c.name.slice(0, 2)}
                    {c.isPrivate && <Lock className="absolute -right-1 -top-1 h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{c.name}</h3>
                      <span className="text-xs text-muted-foreground">{c.members} members</span>
                      {c.isLive && <span className="flex items-center gap-1 text-xs text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live</span>}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                  <Button variant={c.isPrivate ? "outline" : "hero"} size="sm" onClick={(e) => e.stopPropagation()}>
                    {c.isPrivate ? "Request" : "Join"}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[300px] p-4 xl:block">
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Your Communities</h3>
            {featured.filter(f => f.joined).map((c) => (
              <div key={c.name} className="mb-3 flex items-center gap-2 last:mb-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">{c.name.slice(0, 2)}</div>
                <span className="text-sm text-foreground">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Suggested for You</h3>
            {featured.filter(f => !f.joined).slice(0, 3).map((c) => (
              <div key={c.name} className="mb-3 flex items-center justify-between last:mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">{c.name.slice(0, 2)}</div>
                  <span className="text-sm text-foreground">{c.name}</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">Join</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
