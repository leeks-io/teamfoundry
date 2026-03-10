import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Image, Lightbulb, Rocket, MapPin, MessageCircle, Repeat2, Heart, BarChart3, Share } from "lucide-react";

const feedPosts = [
  {
    name: "Maria Santos",
    handle: "@mariasantos",
    role: "Designer",
    time: "2h",
    content: "Just shipped a complete redesign for a DeFi dashboard. The dark theme came out 🔥 Building in public is the way.",
    likes: 42,
    replies: 8,
    reposts: 5,
  },
  {
    name: "Dev Patel",
    handle: "@devpatel",
    role: "Developer",
    time: "4h",
    content: "Completed 3 smart contract audits this week. Foundry's escrow system makes getting paid so seamless. Looking for more Solana projects!",
    likes: 67,
    replies: 12,
    reposts: 9,
  },
  {
    name: "Jordan Taylor",
    handle: "@jordant",
    role: "Founder",
    time: "6h",
    content: "We just hit $10k MRR 🚀 Started as a Blueprint idea on Foundry 4 months ago. If you're building, just start.",
    likes: 234,
    replies: 45,
    reposts: 31,
  },
];

const tabs = ["For You", "Following", "Trending"];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex">
        {/* Center Feed */}
        <div className="flex-1 border-r border-border">
          {/* Top bar */}
          <div className="sticky top-12 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="flex">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    i === 0
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="border-b border-border p-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                AC
              </div>
              <div className="flex-1">
                <input
                  placeholder="What are you building?"
                  className="w-full bg-transparent py-2 text-lg text-foreground placeholder:text-muted-foreground outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2 text-primary">
                    <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Image className="h-4 w-4" /></button>
                    <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Lightbulb className="h-4 w-4" /></button>
                    <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Rocket className="h-4 w-4" /></button>
                    <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><MapPin className="h-4 w-4" /></button>
                  </div>
                  <Button variant="hero" size="sm">Post</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          {feedPosts.map((post) => (
            <div key={post.handle + post.time} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {post.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{post.name}</span>
                    <span className="text-sm text-muted-foreground">{post.handle}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{post.role}</span>
                    <span className="text-sm text-muted-foreground">· {post.time}</span>
                  </div>
                  <p className="mt-2 text-foreground">{post.content}</p>
                  <div className="mt-3 flex gap-6 text-muted-foreground">
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <MessageCircle className="h-4 w-4" /> {post.replies}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <Repeat2 className="h-4 w-4" /> {post.reposts}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <Heart className="h-4 w-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <Share className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[300px] p-4 xl:block">
          {/* Builder Score */}
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Builder Score</h3>
            <div className="mb-1 text-3xl font-bold text-primary">842</div>
            <p className="text-sm text-muted-foreground">Top 5% Founder</p>
            <div className="mt-3 h-1.5 rounded-full bg-secondary">
              <div className="h-full w-[84%] rounded-full bg-primary" />
            </div>
          </div>

          {/* Trending Builders */}
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Trending Builders</h3>
            {["Luna Kim", "Dev Patel", "Sara W."].map((name) => (
              <div key={name} className="mb-3 flex items-center justify-between last:mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-sm text-foreground">{name}</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">Follow</Button>
              </div>
            ))}
          </div>

          {/* Premium */}
          <div className="rounded-lg border border-primary bg-card p-4 glow-primary">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Upgrade to Premium</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Unlimited listings, zero fees, premium badge.
            </p>
            <Button variant="hero" size="sm" className="w-full">Get Premium — $5 USDC</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
