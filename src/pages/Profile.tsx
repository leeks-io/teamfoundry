import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Link as LinkIcon, Calendar, MessageCircle, Repeat2, Heart, BarChart3, Share, Star, Shield } from "lucide-react";
import { useState } from "react";

const profileTabs = ["Posts", "Services", "Portfolio", "Startups", "Reviews"];

const posts = [
  { content: "Just shipped a complete redesign for a DeFi dashboard. Building in public is the way. 🔥", likes: 42, replies: 8, reposts: 5, time: "2h" },
  { content: "Looking for a Solana dev to help with our new staking protocol. DM me if interested!", likes: 67, replies: 12, reposts: 9, time: "6h" },
  { content: "Hit 100 completed orders on Foundry 🎉 Thank you to everyone who trusted me with their projects.", likes: 234, replies: 45, reposts: 31, time: "1d" },
];

const services = [
  { title: "Web3 Landing Page Design", price: 150, rating: 4.9, reviews: 48, delivery: "3 days" },
  { title: "Smart Contract Audit", price: 300, rating: 5.0, reviews: 31, delivery: "5 days" },
  { title: "Full-Stack DApp Development", price: 500, rating: 4.8, reviews: 22, delivery: "7 days" },
];

const portfolio = [
  { title: "DeFi Dashboard Redesign", tags: ["UI/UX", "React", "Web3"] },
  { title: "NFT Marketplace", tags: ["Solana", "Next.js", "TypeScript"] },
  { title: "DAO Governance Tool", tags: ["Smart Contracts", "React"] },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <DashboardLayout>
      <div className="flex">
        <div className="flex-1 border-r border-border">
          {/* Banner */}
          <div className="h-48 bg-secondary" />

          {/* Profile Info */}
          <div className="border-b border-border px-4 pb-4">
            <div className="-mt-10 flex items-end justify-between">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-secondary text-xl font-bold text-foreground ring-2 ring-primary">
                AC
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Message</Button>
                <Button variant="hero" size="sm">Follow</Button>
                <Button variant="outline" size="sm">Hire</Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Alex Chen</h1>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary glow-primary">Premium</span>
              </div>
              <p className="text-sm text-muted-foreground">@alexchen</p>
              <p className="mt-2 text-foreground">Full-stack builder obsessed with Web3. Building the future of decentralized marketplaces.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["React", "Solana", "UI/UX", "TypeScript", "Node.js"].map((s) => (
                  <span key={s} className="rounded-full border border-primary/30 px-3 py-0.5 text-xs text-primary">{s}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> San Francisco</span>
                <span className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" /> alexchen.dev</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined March 2024</span>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <span><strong className="text-foreground">234</strong> <span className="text-muted-foreground">Following</span></span>
                <span><strong className="text-foreground">1.2k</strong> <span className="text-muted-foreground">Followers</span></span>
              </div>
            </div>

            {/* Builder Score */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Builder Score</p>
                  <p className="text-2xl font-bold text-primary">842</p>
                  <p className="text-xs text-muted-foreground">Top 2% Founder</p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div><p className="text-lg font-bold text-foreground">48</p><p className="text-xs text-muted-foreground">Services</p></div>
                  <div><p className="text-lg font-bold text-foreground">9,450</p><p className="text-xs text-muted-foreground">USDC Earned</p></div>
                  <div><p className="text-lg font-bold text-foreground">18</p><p className="text-xs text-muted-foreground">Projects</p></div>
                  <div><p className="text-lg font-bold text-foreground">4.9★</p><p className="text-xs text-muted-foreground">Rating</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-12 z-30 flex border-b border-border bg-background">
            {profileTabs.map((tab) => (
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

          {/* Tab Content */}
          <div>
            {activeTab === "Posts" && posts.map((post, i) => (
              <div key={i} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">AC</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">Alex Chen</span>
                      <span className="text-sm text-muted-foreground">@alexchen · {post.time}</span>
                    </div>
                    <p className="mt-2 text-foreground">{post.content}</p>
                    <div className="mt-3 flex gap-6 text-muted-foreground">
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary"><MessageCircle className="h-4 w-4" />{post.replies}</button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Repeat2 className="h-4 w-4" />{post.reposts}</button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Heart className="h-4 w-4" />{post.likes}</button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary"><BarChart3 className="h-4 w-4" /></button>
                      <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Share className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === "Services" && (
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                {services.map((s) => (
                  <div key={s.title} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                    <div className="mb-3 h-28 rounded-md bg-secondary" />
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="text-foreground">{s.rating}</span>
                      <span className="text-muted-foreground">({s.reviews})</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">{s.price} USDC</span>
                      <span className="text-xs text-muted-foreground">{s.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Portfolio" && (
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                {portfolio.map((p) => (
                  <div key={p.title} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                    <div className="mb-3 h-32 rounded-md bg-secondary" />
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Startups" && (
              <div className="p-4">
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-lg font-bold text-foreground">NexPay</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Next-gen payment infrastructure for Web3</p>
                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    <span>MRR: <span className="text-foreground">$4,200</span></span>
                    <span>Users: <span className="text-foreground">8.5k</span></span>
                    <span>Stage: <span className="text-primary">Revenue</span></span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="p-4">
                {[
                  { name: "Maria Santos", rating: 5, comment: "Alex delivered an incredible landing page. Fast, professional, and the design was exactly what we needed." },
                  { name: "Dev Patel", rating: 5, comment: "Outstanding smart contract work. Clean code and great communication throughout." },
                  { name: "Luna Kim", rating: 4, comment: "Great UI/UX consultation. Helped us redesign our entire dashboard." },
                ].map((r, i) => (
                  <div key={i} className="mb-4 rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                        {r.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground">{r.name}</span>
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden w-[300px] p-4 xl:block">
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">On-Chain Reputation</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Escrow Deals</span><span className="text-foreground">31</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Success Rate</span><span className="text-primary">98%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Verified on</span><span className="text-foreground">Solana ✓</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
