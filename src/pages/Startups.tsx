import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Lock, MessageCircle } from "lucide-react";

const tabs = ["Startups For Sale", "Post Your Startup", "Find Cofounders", "Blueprints"];

const startups = [
  { name: "NexPay", industry: "FinTech", mrr: "$4,200", users: "8.5k", founded: "2023", price: "$45,000" },
  { name: "BuildDAO", industry: "Web3", mrr: "$1,800", users: "3.2k", founded: "2024", price: "$22,000" },
  { name: "CryptoFlow", industry: "DeFi", mrr: "$6,100", users: "12k", founded: "2022", price: "$78,000" },
  { name: "DataNode", industry: "AI", mrr: "$3,400", users: "5.1k", founded: "2023", price: "$38,000" },
];

const blueprints = [
  { title: "AI-Powered Resume Builder", desc: "Build a resume tool that uses AI to optimize for ATS systems.", tags: ["AI", "SaaS", "B2C"], price: "FREE", creator: "Alex Chen", interested: 34, building: 12 },
  { title: "DeFi Portfolio Tracker", desc: "Real-time portfolio tracking across multiple chains and protocols.", tags: ["Web3", "DeFi", "Dashboard"], price: "50 USDC", creator: "Dev Patel", interested: 28, building: 8 },
  { title: "Creator Subscription Platform", desc: "Membership platform for creators with crypto payments built in.", tags: ["SaaS", "Payments", "B2B"], price: "FREE", creator: "Luna Kim", interested: 19, building: 5 },
];

const stages = ["Idea", "MVP", "Revenue"];
const lookingFor = ["Cofounder", "Dev", "Designer", "Marketer", "Investor"];

export default function Startups() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [stage, setStage] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set());

  const toggleNeed = (n: string) => {
    const next = new Set(selectedNeeds);
    next.has(n) ? next.delete(n) : next.add(n);
    setSelectedNeeds(next);
  };

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Startup Hub</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "Startups For Sale" && (
            <div className="grid gap-4 md:grid-cols-2">
              {startups.map((s) => (
                <div key={s.name} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">{s.name.slice(0, 2)}</div>
                    <div>
                      <h3 className="font-bold text-foreground">{s.name}</h3>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{s.industry}</span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-muted-foreground">MRR</p><p className="font-semibold text-foreground">{s.mrr}</p></div>
                    <div><p className="text-muted-foreground">Users</p><p className="font-semibold text-foreground">{s.users}</p></div>
                    <div><p className="text-muted-foreground">Founded</p><p className="font-semibold text-foreground">{s.founded}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{s.price} USDC</span>
                    <div className="flex gap-2">
                      <Button variant="hero" size="sm">View Startup</Button>
                      <Button variant="ghost" size="sm"><MessageCircle className="h-4 w-4" /> Offer</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Post Your Startup" && (
            <div className="mx-auto max-w-lg">
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
                <Input placeholder="Startup name" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                <Input placeholder="Tagline" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                <textarea placeholder="Description" rows={4} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <Input placeholder="Industry" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Stage</p>
                  <div className="flex gap-2">
                    {stages.map((s) => (
                      <button key={s} onClick={() => setStage(s)} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${stage === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Looking for</p>
                  <div className="flex flex-wrap gap-2">
                    {lookingFor.map((n) => (
                      <button key={n} onClick={() => toggleNeed(n)} className={`rounded-full px-3 py-1.5 text-sm transition-colors ${selectedNeeds.has(n) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="hero" className="mt-2">Post Startup</Button>
              </div>
            </div>
          )}

          {activeTab === "Find Cofounders" && (
            <div className="space-y-4">
              {["Looking for a technical cofounder for an AI startup", "Designer seeking founder partner for Web3 project", "Backend dev looking to join early-stage startup"].map((text, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-foreground">{text}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">Connect</Button>
                    <Button variant="ghost" size="sm">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Blueprints" && (
            <div className="space-y-4">
              {blueprints.map((bp) => (
                <div key={bp.title} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary" style={{ borderLeftWidth: 3, borderLeftColor: "hsl(147 95% 44%)" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{bp.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{bp.desc}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${bp.price === "FREE" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"}`}>
                      {bp.price}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {bp.tags.map((t) => (<span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{bp.interested} interested · {bp.building} building · by {bp.creator}</div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="hero" size="sm">🔨 Join Build</Button>
                    <Button variant="outline" size="sm">💰 Buy Idea</Button>
                    <Button variant="ghost" size="sm">💬 Discuss</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
