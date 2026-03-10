import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon, Link as LinkIcon } from "lucide-react";

const navLinks = ["Explore", "Jobs", "Services", "Startups", "Communities"];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">Foundry</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/auth?signup=true">Join Foundry</Link>
          </Button>
          <Button variant="wallet" size="sm" className="hidden lg:inline-flex">
            <LinkIcon className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
}
