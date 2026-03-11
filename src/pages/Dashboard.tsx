import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Image, Lightbulb, Rocket, MapPin, MessageCircle, Repeat2, Heart, BarChart3, Share } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const tabs = ["For You", "Following", "Trending"];

type PostWithProfile = {
  id: string;
  content: string;
  likes_count: number;
  replies_count: number;
  reposts_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    username: string | null;
    role: string | null;
    avatar_url: string | null;
  } | null;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getRoleLabel(role: string | null) {
  const map: Record<string, string> = { job_seeker: "Talent", freelancer: "Freelancer", founder: "Founder" };
  return role ? map[role] || role : "";
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles!posts_user_id_fkey(full_name, username, role, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as unknown as PostWithProfile[]) || [];
    },
  });

  const { data: trendingBuilders = [] } = useQuery({
    queryKey: ["trending-builders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("builder_score", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!user || !postContent.trim()) return;
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: postContent.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setPostContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post published!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row">
        {/* Center Feed */}
        <div className="flex-1 border-r border-border min-w-0">
          <div className="sticky top-12 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="flex">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === i
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
          {user && (
            <div className="border-b border-border p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {getInitials(profile?.full_name)}
                </div>
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What are you building?"
                    rows={2}
                    className="w-full resize-none bg-transparent py-2 text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-2 text-primary">
                      <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Image className="h-4 w-4" /></button>
                      <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Lightbulb className="h-4 w-4" /></button>
                      <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><Rocket className="h-4 w-4" /></button>
                      <button className="rounded-full p-2 transition-colors hover:bg-primary/10"><MapPin className="h-4 w-4" /></button>
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      disabled={!postContent.trim() || createPost.isPending}
                      onClick={() => createPost.mutate()}
                    >
                      {createPost.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed */}
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No posts yet. Be the first to share what you're building!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
                <div className="flex gap-3">
                  <Link to={`/profile/${post.user_id}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                    {getInitials(post.profiles?.full_name)}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <Link to={`/profile/${post.user_id}`} className="font-semibold text-foreground hover:underline">
                        {post.profiles?.full_name || "Unknown"}
                      </Link>
                      <span className="text-sm text-muted-foreground">@{post.profiles?.username || "user"}</span>
                      {post.profiles?.role && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{getRoleLabel(post.profiles.role)}</span>
                      )}
                      <span className="text-sm text-muted-foreground">· {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                    <p className="mt-2 text-foreground break-words">{post.content}</p>
                    <div className="mt-3 flex gap-4 sm:gap-6 text-muted-foreground">
                      <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                        <MessageCircle className="h-4 w-4" /> {post.replies_count}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                        <Repeat2 className="h-4 w-4" /> {post.reposts_count}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                        <Heart className="h-4 w-4" /> {post.likes_count}
                      </button>
                      <button className="hidden sm:flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[300px] shrink-0 p-4 xl:block">
          {profile && (
            <div className="mb-4 rounded-lg border border-border bg-card p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Builder Score</h3>
              <div className="mb-1 text-3xl font-bold text-primary">{profile.builder_score}</div>
              <p className="text-sm text-muted-foreground">{getRoleLabel(profile.role)}</p>
              <div className="mt-3 h-1.5 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(profile.builder_score / 10, 100)}%` }} />
              </div>
            </div>
          )}

          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Trending Builders</h3>
            {trendingBuilders.map((b: any) => (
              <div key={b.id} className="mb-3 flex items-center justify-between last:mb-0">
                <Link to={`/profile/${b.user_id}`} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    {getInitials(b.full_name)}
                  </div>
                  <span className="text-sm text-foreground">{b.full_name || "User"}</span>
                </Link>
                <Button variant="outline" size="sm" className="h-7 text-xs">Follow</Button>
              </div>
            ))}
          </div>

          {!profile?.is_premium && (
            <div className="rounded-lg border border-primary bg-card p-4 glow-primary">
              <h3 className="mb-1 text-sm font-semibold text-foreground">Upgrade to Premium</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Unlimited listings, zero fees, premium badge.
              </p>
              <Button variant="hero" size="sm" className="w-full">Get Premium — $5 USDC</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
