import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Plus, Lock } from "lucide-react";
import { useState } from "react";

const categories = ["All", "UI/UX Design", "Web Dev", "Smart Contracts", "AI Tools", "Marketing", "Branding"];
const sortOptions = ["Trending", "Newest", "Price ↑", "Price ↓"];

const allServices = [
  { title: "Web3 Landing Page", creator: "Alex Chen", handle: "@alexchen", price: 150, rating: 4.9, reviews: 48, delivery: "3 days", category: "UI/UX Design", premium: true },
  { title: "Smart Contract Audit", creator: "Dev Patel", handle: "@devpatel", price: 300, rating: 5.0, reviews: 31, delivery: "5 days", category: "Smart Contracts", premium: false },
  { title: "Brand Identity Kit", creator: "Luna Kim", handle: "@lunakim", price: 200, rating: 4.8, reviews: 22, delivery: "4 days", category: "Branding", premium: true },
  { title: "DApp Frontend", creator: "Jordan T.", handle: "@jordant", price: 450, rating: 4.7, reviews: 15, delivery: "7 days", category: "Web Dev", premium: false },
  { title: "AI Chatbot Integration", creator: "Sara W.", handle: "@saraw", price: 250, rating: 4.9, reviews: 19, delivery: "4 days", category: "AI Tools", premium: false },
  { title: "Social Media Strategy", creator: "Mike R.", handle: "@miker", price: 100, rating: 4.6, reviews: 35, delivery: "2 days", category: "Marketing", premium: false },
  { title: "NFT Collection Art", creator: "Aria L.", handle: "@arial", price: 350, rating: 4.9, reviews: 27, delivery: "5 days", category: "UI/UX Design", premium: true },
  { title: "Token Economics Design", creator: "Chris B.", handle: "@chrisb", price: 500, rating: 5.0, reviews: 8, delivery: "7 days", category: "Smart Contracts", premium: false },
  { title: "Growth Hacking Package", creator: "Nina T.", handle: "@ninat", price: 180, rating: 4.7, reviews: 41, delivery: "3 days", category: "Marketing", premium: false },
];

export default function Services() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedService, setSelectedService] = useState<typeof allServices[0] | null>(null);

  const filtered = activeCat === "All" ? allServices : allServices.filter(s => s.category === activeCat);

  return (
    <DashboardLayout>
      <div className="flex">
        <div className="flex-1 border-r border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Services</h1>
            <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> List a Service</Button>
          </div>

          {/* Search */}
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search services..." className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  activeCat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2 border-b border-border px-4 py-2">
            {sortOptions.map((s) => (
              <button key={s} className="text-xs text-muted-foreground hover:text-foreground">{s}</button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div
                key={s.title}
                onClick={() => setSelectedService(s)}
                className="cursor-pointer rounded-lg border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="relative h-36 rounded-t-lg bg-secondary">
                  {s.premium && (
                    <span className="absolute right-2 top-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Premium</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground">
                      {s.creator.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs text-muted-foreground">{s.creator}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-foreground">{s.rating}</span>
                    <span className="text-muted-foreground">({s.reviews})</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{s.price} USDC</span>
                    <span className="text-xs text-muted-foreground">{s.delivery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel / Detail */}
        <div className="hidden w-[340px] xl:block">
          {selectedService ? (
            <div className="sticky top-12 border-l border-border p-4">
              <div className="mb-4 h-44 rounded-lg bg-secondary" />
              <h2 className="text-lg font-bold text-foreground">{selectedService.title}</h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                  {selectedService.creator.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedService.creator}</p>
                  <p className="text-xs text-muted-foreground">{selectedService.handle}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-foreground">{selectedService.rating}</span>
                <span className="text-muted-foreground">({selectedService.reviews} reviews)</span>
              </div>

              {/* Pricing tiers */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { tier: "Basic", multiplier: 1 },
                  { tier: "Standard", multiplier: 1.5 },
                  { tier: "Premium", multiplier: 2.5 },
                ].map((t) => (
                  <div key={t.tier} className={`rounded-lg border p-3 text-center text-sm ${t.tier === "Standard" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <p className="font-medium text-foreground">{t.tier}</p>
                    <p className="mt-1 font-bold text-primary">{Math.round(selectedService.price * t.multiplier)} USDC</p>
                  </div>
                ))}
              </div>

              <Button variant="hero" className="mt-4 w-full">
                Order Now — {selectedService.price} USDC
              </Button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Protected by Foundry Escrow
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center p-4 text-sm text-muted-foreground">
              Click a service to see details
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
