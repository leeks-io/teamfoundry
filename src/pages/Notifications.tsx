import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Package, DollarSign, MessageCircle, Bell } from "lucide-react";
import { useState } from "react";

const filterTabs = ["All", "Mentions", "Jobs", "Orders", "Payments", "Follows"];

const notifications = [
  { type: "follow", icon: UserPlus, color: "text-primary", title: "Alex followed you", desc: "", time: "2m ago", unread: true, action: "Follow back" },
  { type: "job", icon: Briefcase, color: "text-primary", title: "New application for Senior Solana Developer", desc: "3 new applicants", time: "15m ago", unread: true, action: "View Apps" },
  { type: "order", icon: Package, color: "text-primary", title: "New order for Web3 Landing Page Design", desc: "From @mariasantos — 150 USDC", time: "1h ago", unread: true, action: "View Order" },
  { type: "payment", icon: DollarSign, color: "text-primary", title: "Payment Received: 300 USDC", desc: "Smart Contract Audit completed for @devpatel", time: "3h ago", unread: false, action: "View Transaction" },
  { type: "follow", icon: UserPlus, color: "text-primary", title: "Luna Kim followed you", desc: "", time: "5h ago", unread: false, action: "Follow back" },
  { type: "message", icon: MessageCircle, color: "text-primary", title: "New message from Jordan Taylor", desc: "\"Can you take a look at this wireframe?\"", time: "1d ago", unread: false, action: "Reply" },
  { type: "order", icon: Package, color: "text-primary", title: "Order completed: Brand Identity Kit", desc: "Client left a 5-star review", time: "1d ago", unread: false, action: "View Review" },
  { type: "system", icon: Bell, color: "text-muted-foreground", title: "Your Builder Score increased to 842", desc: "You're now in the top 2% of founders", time: "2d ago", unread: false },
  { type: "payment", icon: DollarSign, color: "text-primary", title: "Payment Received: 200 USDC", desc: "Brand Identity Kit for @saraw", time: "3d ago", unread: false, action: "View Transaction" },
];

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? notifications
    : notifications.filter(n => {
        const map: Record<string, string> = { Mentions: "message", Jobs: "job", Orders: "order", Payments: "payment", Follows: "follow" };
        return n.type === map[activeFilter];
      });

  return (
    <DashboardLayout>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <button className="text-sm text-muted-foreground hover:text-foreground">Mark all read</button>
        </div>

        <div className="flex border-b border-border">
          {filterTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeFilter === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          {filtered.map((n, i) => {
            const Icon = n.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 border-b border-border p-4 transition-colors hover:bg-secondary/30 ${
                  n.unread ? "border-l-2 border-l-primary bg-primary/[0.03]" : ""
                }`}
              >
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${n.unread ? "bg-primary/10" : "bg-secondary"}`}>
                  <Icon className={`h-4 w-4 ${n.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</p>
                  {n.desc && <p className="mt-0.5 text-sm text-muted-foreground">{n.desc}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
                {n.action && (
                  <Button variant="outline" size="sm" className="shrink-0">{n.action}</Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
