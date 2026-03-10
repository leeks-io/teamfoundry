import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Briefcase, ShoppingCart, Users, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const exploreTabs = ["All", "Builders", "Jobs", "Services", "Startups", "Blueprints"];

const trendingBuilders = [
  { name: "Alex Chen", role: "Full-Stack Dev", score: 920 },
  { name: "Maria Santos", role: "UI/UX Designer", score: 875 },
  { name: "Dev Patel", role: "Smart Contracts", score: 842 },
  { name: "Luna Kim", role: "AI Engineer", score: 810 },
];

const trendingJobs = [
  { title: "Senior Solana Developer", company: "NexPay", budget: "$5,000/mo" },
  { title: "UI/UX Designer", company: "BuildDAO", budget: "$3,000/mo" },
];

const trendingServices = [
  { title: "Web3 Landing Page", creator: "Alex Chen", price: 150, rating: 4.9 },
  { title: "Smart Contract Audit", creator: "Dev Patel", price: 300, rating: 5.0 },
];

const trendingBlueprints = [
  { title: "AI-Powered Resume Builder", tags: ["AI", "SaaS"], interested: 34 },
  { title: "DeFi Portfolio Tracker", tags: ["Web3", "DeFi"], interested: 28 },
];

export default function Explore() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="border-b border-border p-4">
          <h1 className="mb-4 text-xl font-bold text-foreground">Explore</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search builders, jobs, services..." className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        <div className="flex border-b border-border">
          {exploreTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-sm font-medium ${activeTab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-8">
          {(activeTab === "All" || activeTab === "Builders") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Trending Builders</h2>
                <Link to="/profile" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trendingBuilders.map((b) => (
                  <div key={b.name} className="rounded-lg border border-border bg-card p-4 text-center transition-colors hover:border-primary">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                      {b.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <p className="mt-2 font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.role}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{b.score}</span>
                    <Button variant="outline" size="sm" className="mt-2 w-full">Follow</Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "All" || activeTab === "Jobs") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><Briefcase className="h-5 w-5" /> Hot Jobs</h2>
                <Link to="/jobs" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              {trendingJobs.map((j) => (
                <div key={j.title} className="mb-3 flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                  <div>
                    <h3 className="font-semibold text-foreground">{j.title}</h3>
                    <p className="text-sm text-muted-foreground">{j.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">{j.budget}</span>
                    <Button variant="outline" size="sm">Apply</Button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {(activeTab === "All" || activeTab === "Services") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><ShoppingCart className="h-5 w-5" /> Popular Services</h2>
                <Link to="/services" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {trendingServices.map((s) => (
                  <div key={s.title} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                    <div className="mb-2 h-24 rounded-md bg-secondary" />
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.creator}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">{s.price} USDC</span>
                      <span className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 fill-primary text-primary" />{s.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === "All" || activeTab === "Blueprints") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground"><Lightbulb className="h-5 w-5" /> Blueprint Ideas</h2>
                <Link to="/startups" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              {trendingBlueprints.map((bp) => (
                <div key={bp.title} className="mb-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary" style={{ borderLeftWidth: 3, borderLeftColor: "hsl(147 95% 44%)" }}>
                  <h3 className="font-semibold text-foreground">{bp.title}</h3>
                  <div className="mt-2 flex gap-2">
                    {bp.tags.map((t) => (<span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{t}</span>))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{bp.interested} interested</p>
                </div>
              ))}
            </section>
          )}

          {activeTab === "Startups" && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Trending Startups</h2>
                <Link to="/startups" className="text-sm text-primary hover:underline">See all</Link>
              </div>
              <p className="text-muted-foreground">Visit the Startup Hub for the full marketplace.</p>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
