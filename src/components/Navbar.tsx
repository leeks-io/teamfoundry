import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, Link as LinkIcon, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const navLinks = ["Explore", "Jobs", "Services", "Startups", "Communities"];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">Foundry</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link} to={`/${link.toLowerCase()}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <Button variant="hero" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth?signup=true">Join Foundry</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden text-muted-foreground hover:text-foreground">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-border bg-background p-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link} to={`/${link.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              {link}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth?signup=true" onClick={() => setMobileOpen(false)}>Join Foundry</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
