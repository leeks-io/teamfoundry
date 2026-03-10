import { Home, Search, Briefcase, ShoppingCart, Rocket, Lightbulb, Users, MessageCircle, Bell, User, Settings, Hexagon, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
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
  { title: "Messages", url: "/messages", icon: MessageCircle, badge: 3 },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 12 },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
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
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                AC
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">Alex Chen</p>
                <p className="truncate text-xs text-muted-foreground">@alexchen</p>
              </div>
            </div>
            <Button variant="wallet" size="sm" className="w-full">
              <Zap className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
