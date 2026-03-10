import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Plus } from "lucide-react";
import { useState } from "react";

const filters = ["All", "Remote", "Full-time", "Part-time", "Contract", "Web3", "AI", "Design", "Dev"];

const jobs = [
  { title: "Senior Solana Developer", company: "NexPay", handle: "@nexpay", tags: ["Remote", "Solana", "Full-time"], budget: "$5,000/mo", time: "2h ago", desc: "Looking for an experienced Solana developer to help build our staking infrastructure." },
  { title: "UI/UX Designer", company: "BuildDAO", handle: "@builddao", tags: ["Remote", "Design", "Contract"], budget: "$3,000/mo", time: "4h ago", desc: "Need a designer to create a modern dashboard for our DeFi protocol." },
  { title: "Full-Stack Engineer", company: "CryptoFlow", handle: "@cryptoflow", tags: ["Remote", "Web3", "Full-time"], budget: "$6,500/mo", time: "8h ago", desc: "Join our team building the next generation of crypto payment solutions." },
  { title: "Smart Contract Auditor", company: "SecureChain", handle: "@securechain", tags: ["Remote", "Solana", "Contract"], budget: "$4,000/mo", time: "1d ago", desc: "We need a security expert to audit our smart contracts before mainnet launch." },
  { title: "Marketing Lead", company: "WebVerse", handle: "@webverse", tags: ["Remote", "Marketing", "Part-time"], budget: "$2,500/mo", time: "1d ago", desc: "Drive growth and community engagement for our Web3 social platform." },
  { title: "Backend Developer", company: "DataNode", handle: "@datanode", tags: ["Remote", "AI", "Full-time"], budget: "$5,500/mo", time: "2d ago", desc: "Build scalable APIs and data pipelines for our AI-powered analytics platform." },
];

export default function Jobs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (title: string) => {
    const next = new Set(saved);
    next.has(title) ? next.delete(title) : next.add(title);
    setSaved(next);
  };

  const filteredJobs = activeFilter === "All" ? jobs : jobs.filter(j => j.tags.some(t => t === activeFilter));

  return (
    <DashboardLayout>
      <div className="flex">
        <div className="flex-1 border-r border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Jobs</h1>
            <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> Post a Job</Button>
          </div>

          {/* Search */}
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs..." className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div>
            {filteredJobs.map((job) => (
              <div key={job.title} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">
                    {job.company.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company} {job.handle}</p>
                      </div>
                      <button onClick={() => toggleSave(job.title)} className="text-muted-foreground hover:text-primary">
                        <Bookmark className={`h-4 w-4 ${saved.has(job.title) ? "fill-primary text-primary" : ""}`} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                      <span className="text-xs text-muted-foreground">· {job.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{job.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-primary">{job.budget} USDC</span>
                      <Button variant="outline" size="sm">Apply Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden w-[300px] p-4 xl:block">
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Your Applications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Applied</span><span className="text-foreground">2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Interviews</span><span className="text-primary">1</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Saved</span><span className="text-foreground">{saved.size}</span></div>
            </div>
            <Button variant="ghost" size="sm" className="mt-3 w-full text-primary">View All Applications →</Button>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Top Hiring Founders</h3>
            {["Jordan Taylor", "Sara Williams", "Mike Ross"].map((name) => (
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
        </div>
      </div>
    </DashboardLayout>
  );
}
