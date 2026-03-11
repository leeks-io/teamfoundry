import { Home, Search, Briefcase, ShoppingCart, Rocket, Lightbulb, Users, MessageCircle, Bell, User, Settings, Hexagon, Zap, LogIn } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Explore", url: "/explore", icon: Search },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Services", url: "/services", icon: ShoppingCart },
  { title: "Startups", url: "/startups", icon: Rocket },
  { title: "Blueprints", url: "/blueprints", icon: Lightbulb },
  { title: "Communities", url: "/communities", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-background pt-4">
        <div className="mb-6 flex items-center gap-2 px-4">
          <Hexagon className="h-6 w-6 shrink-0 text-primary" />
          {!collapsed && <span className="text-lg font-bold text-foreground">Foundry</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      activeClassName="text-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border bg-background p-4">
        {!collapsed && (
          <>
            {user && profile ? (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                    {getInitials(profile.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{profile.full_name || "User"}</p>
                    <p className="truncate text-xs text-muted-foreground">@{profile.username || "user"}</p>
                  </div>
                </div>
                {!profile.is_premium && (
                  <Button variant="wallet" size="sm" className="w-full" asChild>
                    <Link to="/settings"><Zap className="h-4 w-4" /> Upgrade to Premium</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button variant="hero" size="sm" className="w-full" asChild>
                <Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign In</Link>
              </Button>
            )}
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
