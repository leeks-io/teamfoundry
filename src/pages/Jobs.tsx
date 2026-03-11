import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const filters = ["All", "Remote", "Full-time", "Part-time", "Contract", "Web3", "AI", "Design", "Dev"];

export default function Jobs() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", company: "", description: "", budget: "", job_type: "full-time", tags: "" as string, is_remote: false });
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, profiles!jobs_user_id_fkey(full_name, username)")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const createJob = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("jobs").insert({
        user_id: user.id,
        title: newJob.title,
        company: newJob.company,
        description: newJob.description,
        budget: newJob.budget,
        job_type: newJob.job_type,
        tags: newJob.tags.split(",").map(t => t.trim()).filter(Boolean),
        is_remote: newJob.is_remote,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setShowCreate(false);
      setNewJob({ title: "", company: "", description: "", budget: "", job_type: "full-time", tags: "", is_remote: false });
      toast.success("Job posted!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleSave = (id: string) => {
    const next = new Set(saved);
    next.has(id) ? next.delete(id) : next.add(id);
    setSaved(next);
  };

  const filtered = jobs.filter((j: any) => {
    if (activeFilter !== "All") {
      const matchType = j.job_type === activeFilter.toLowerCase();
      const matchTag = j.tags?.includes(activeFilter);
      const matchRemote = activeFilter === "Remote" && j.is_remote;
      if (!matchType && !matchTag && !matchRemote) return false;
    }
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 border-r border-border min-w-0">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Jobs</h1>
            {user && (
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> Post a Job</Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border">
                  <DialogHeader><DialogTitle className="text-foreground">Post a Job</DialogTitle></DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Input placeholder="Job title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="bg-input border-border text-foreground" />
                    <Input placeholder="Company name" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} className="bg-input border-border text-foreground" />
                    <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} rows={3} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    <Input placeholder="Budget (e.g. $5,000/mo)" value={newJob.budget} onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })} className="bg-input border-border text-foreground" />
                    <Input placeholder="Tags (comma separated)" value={newJob.tags} onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })} className="bg-input border-border text-foreground" />
                    <div className="flex gap-2">
                      {["full-time", "part-time", "contract", "remote"].map(t => (
                        <button key={t} onClick={() => setNewJob({ ...newJob, job_type: t })} className={`rounded-full px-3 py-1 text-xs ${newJob.job_type === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <Button variant="hero" onClick={() => createJob.mutate()} disabled={createJob.isPending || !newJob.title}>
                      {createJob.isPending ? "Posting..." : "Post Job"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-border p-4 scrollbar-none">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${activeFilter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading jobs...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No jobs found. {user ? "Post the first one!" : "Sign in to post jobs."}</div>
          ) : (
            filtered.map((job: any) => (
              <div key={job.id} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">
                    {(job.company || "?").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company} {job.profiles?.username ? `@${job.profiles.username}` : ""}</p>
                      </div>
                      <button onClick={() => toggleSave(job.id)} className="text-muted-foreground hover:text-primary shrink-0">
                        <Bookmark className={`h-4 w-4 ${saved.has(job.id) ? "fill-primary text-primary" : ""}`} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.tags?.map((t: string) => (
                        <span key={t} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                      <span className="text-xs text-muted-foreground">· {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                    </div>
                    {job.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{job.description}</p>}
                    <div className="mt-3 flex items-center justify-between">
                      {job.budget && <span className="font-semibold text-primary">{job.budget} USDC</span>}
                      <Button variant="outline" size="sm">Apply Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden w-[300px] shrink-0 p-4 xl:block">
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Your Applications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Saved</span><span className="text-foreground">{saved.size}</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
