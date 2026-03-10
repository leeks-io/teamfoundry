import { Hexagon } from "lucide-react";

const columns = [
  { title: "Platform", links: ["Explore", "Jobs", "Services", "Startups", "Communities"] },
  { title: "Resources", links: ["Docs", "API", "Blog", "Changelog"] },
  { title: "Legal", links: ["Terms", "Privacy", "Cookies"] },
  { title: "Community", links: ["Discord", "Twitter", "GitHub"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Hexagon className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              © 2025 Foundry Network · foundrynetwork.space
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
