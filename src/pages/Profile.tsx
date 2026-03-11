import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Link as LinkIcon, Calendar, MessageCircle, Repeat2, Heart, BarChart3, Share, Star, Shield } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const profileTabs = ["Posts", "Services", "Portfolio", "Startups", "Reviews"];

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getRoleLabel(role: string | null) {
  const map: Record<string, string> = { job_seeker: "Talent", freelancer: "Freelancer", founder: "Founder" };
  return role ? map[role] || role : "";
}

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("Posts");

  const targetUserId = userId || currentUser?.id;

  const { data: profile } = useQuery({
    queryKey: ["profile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", targetUserId).single();
      return data;
    },
    enabled: !!targetUserId,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["user-posts", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data } = await supabase.from("posts").select("*").eq("user_id", targetUserId).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!targetUserId,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["user-services", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data } = await supabase.from("services").select("*").eq("user_id", targetUserId).eq("status", "active");
      return data || [];
    },
    enabled: !!targetUserId,
  });

  const { data: startups = [] } = useQuery({
    queryKey: ["user-startups", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data } = await supabase.from("startups").select("*").eq("user_id", targetUserId);
      return data || [];
    },
    enabled: !!targetUserId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["user-reviews", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      const { data } = await supabase.from("reviews").select("*, profiles!reviews_reviewer_id_fkey(full_name)").eq("reviewed_user_id", targetUserId).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!targetUserId,
  });

  const { data: followCounts } = useQuery({
    queryKey: ["follow-counts", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return { followers: 0, following: 0 };
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", targetUserId),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", targetUserId),
      ]);
      return { followers: followers || 0, following: following || 0 };
    },
    enabled: !!targetUserId,
  });

  const isOwnProfile = currentUser?.id === targetUserId;
  const displayProfile = isOwnProfile ? (currentProfile || profile) : profile;

  if (!targetUserId) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-muted-foreground">Sign in to view your profile.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 border-r border-border min-w-0">
          <div className="h-32 sm:h-48 bg-secondary" />
          <div className="border-b border-border px-4 pb-4">
            <div className="-mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-secondary text-xl font-bold text-foreground ring-2 ring-primary">
                {getInitials(displayProfile?.full_name)}
              </div>
              {!isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Message</Button>
                  <Button variant="hero" size="sm">Follow</Button>
                  <Button variant="outline" size="sm">Hire</Button>
                </div>
              )}
              {isOwnProfile && (
                <Button variant="outline" size="sm" asChild><Link to="/settings">Edit Profile</Link></Button>
              )}
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{displayProfile?.full_name || "User"}</h1>
                {displayProfile?.is_premium && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary glow-primary">Premium</span>}
              </div>
              <p className="text-sm text-muted-foreground">@{displayProfile?.username || "user"}</p>
              {displayProfile?.bio && <p className="mt-2 text-foreground">{displayProfile.bio}</p>}
              {displayProfile?.skills && displayProfile.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {displayProfile.skills.map((s: string) => (
                    <span key={s} className="rounded-full border border-primary/30 px-3 py-0.5 text-xs text-primary">{s}</span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {displayProfile?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {displayProfile.location}</span>}
                {displayProfile?.website && <span className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" /> {displayProfile.website}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {displayProfile?.created_at ? new Date(displayProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "?"}</span>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <span><strong className="text-foreground">{followCounts?.following || 0}</strong> <span className="text-muted-foreground">Following</span></span>
                <span><strong className="text-foreground">{followCounts?.followers || 0}</strong> <span className="text-muted-foreground">Followers</span></span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Builder Score</p>
                  <p className="text-2xl font-bold text-primary">{displayProfile?.builder_score || 0}</p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel(displayProfile?.role)}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div><p className="text-lg font-bold text-foreground">{services.length}</p><p className="text-xs text-muted-foreground">Services</p></div>
                  <div><p className="text-lg font-bold text-foreground">{startups.length}</p><p className="text-xs text-muted-foreground">Startups</p></div>
                  <div><p className="text-lg font-bold text-foreground">{posts.length}</p><p className="text-xs text-muted-foreground">Posts</p></div>
                  <div><p className="text-lg font-bold text-foreground">{reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : "0"}★</p><p className="text-xs text-muted-foreground">Rating</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-12 z-30 flex overflow-x-auto border-b border-border bg-background scrollbar-none">
            {profileTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "Posts" && (
              posts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No posts yet.</div>
              ) : (
                posts.map((post: any) => (
                  <div key={post.id} className="border-b border-border p-4 transition-colors hover:bg-secondary/30">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">{getInitials(displayProfile?.full_name)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{displayProfile?.full_name}</span>
                          <span className="text-sm text-muted-foreground">· {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="mt-2 text-foreground break-words">{post.content}</p>
                        <div className="mt-3 flex gap-6 text-muted-foreground">
                          <button className="flex items-center gap-1.5 text-sm hover:text-primary"><MessageCircle className="h-4 w-4" />{post.replies_count}</button>
                          <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Repeat2 className="h-4 w-4" />{post.reposts_count}</button>
                          <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Heart className="h-4 w-4" />{post.likes_count}</button>
                          <button className="hidden sm:flex items-center gap-1.5 text-sm hover:text-primary"><BarChart3 className="h-4 w-4" /></button>
                          <button className="flex items-center gap-1.5 text-sm hover:text-primary"><Share className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === "Services" && (
              services.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No services listed.</div>
              ) : (
                <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2">
                  {services.map((s: any) => (
                    <div key={s.id} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
                      <div className="mb-3 h-28 rounded-md bg-secondary" />
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-foreground">{Number(s.rating).toFixed(1)}</span>
                        <span className="text-muted-foreground">({s.reviews_count})</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-primary">{s.price} USDC</span>
                        <span className="text-xs text-muted-foreground">{s.delivery_days} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "Portfolio" && (
              <div className="p-8 text-center text-muted-foreground">Portfolio feature coming soon.</div>
            )}

            {activeTab === "Startups" && (
              startups.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No startups yet.</div>
              ) : (
                <div className="p-4 space-y-4">
                  {startups.map((s: any) => (
                    <div key={s.id} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                      {s.tagline && <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>}
                      <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                        <span>MRR: <span className="text-foreground">${Number(s.mrr).toLocaleString()}</span></span>
                        <span>Users: <span className="text-foreground">{s.users_count?.toLocaleString()}</span></span>
                        <span>Stage: <span className="text-primary capitalize">{s.stage}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "Reviews" && (
              reviews.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No reviews yet.</div>
              ) : (
                <div className="p-4 space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                          {getInitials(r.profiles?.full_name)}
                        </div>
                        <span className="font-medium text-foreground">{r.profiles?.full_name || "User"}</span>
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="hidden w-[300px] shrink-0 p-4 xl:block">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">On-Chain Reputation</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Services</span><span className="text-foreground">{services.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Posts</span><span className="text-foreground">{posts.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reviews</span><span className="text-foreground">{reviews.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
