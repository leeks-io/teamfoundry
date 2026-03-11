import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Package, DollarSign, MessageCircle, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const filterTabs = ["All", "Mentions", "Jobs", "Orders", "Payments", "Follows"];
const iconMap: Record<string, any> = { follow: UserPlus, job: Briefcase, order: Package, payment: DollarSign, message: MessageCircle, system: Bell };

export default function Notifications() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const filtered = activeFilter === "All"
    ? notifications
    : notifications.filter((n: any) => {
        const map: Record<string, string> = { Mentions: "message", Jobs: "job", Orders: "order", Payments: "payment", Follows: "follow" };
        return n.type === map[activeFilter];
      });

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-muted-foreground">Sign in to view notifications.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <button onClick={() => markAllRead.mutate()} className="text-sm text-muted-foreground hover:text-foreground">Mark all read</button>
        </div>

        <div className="flex overflow-x-auto border-b border-border scrollbar-none">
          {filterTabs.map((t) => (
            <button key={t} onClick={() => setActiveFilter(t)} className={`shrink-0 flex-1 py-3 text-sm font-medium transition-colors ${activeFilter === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No notifications yet.</div>
        ) : (
          filtered.map((n: any) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div key={n.id} className={`flex items-start gap-3 border-b border-border p-4 transition-colors hover:bg-secondary/30 ${!n.is_read ? "border-l-2 border-l-primary bg-primary/[0.03]" : ""}`}>
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${!n.is_read ? "bg-primary/10" : "bg-secondary"}`}>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.is_read ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</p>
                  {n.description && <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
