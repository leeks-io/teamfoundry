import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Zap, Check, X as XIcon } from "lucide-react";

const settingsNav = ["Account", "Profile", "Notifications", "Privacy", "Workspace", "Billing / Premium", "Web3 / Wallet", "Security", "Help"];

const workspaces = [
  { icon: "🎯", label: "Talent", desc: "Job Seeker" },
  { icon: "💼", label: "Freelancer", desc: "Contractor" },
  { icon: "🚀", label: "Founder", desc: "Entrepreneur" },
];

const limitations = [
  "2 job applications/day",
  "2 service listings/month",
  "5 follows max",
  "Startup Marketplace locked",
];

const benefits = [
  "Unlimited service listings",
  "Unlimited job applications",
  "Unlimited job posts",
  "Startup For Sale marketplace",
  "Premium profile badge",
  "Zero platform fees",
];

const wallets = [
  { name: "Phantom", icon: "👻" },
  { name: "MetaMask", icon: "🦊" },
  { name: "WalletConnect", icon: "🔗" },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("Account");
  const [activeWorkspace, setActiveWorkspace] = useState("Founder");

  return (
    <DashboardLayout>
      <div className="flex">
        {/* Settings Nav */}
        <div className="hidden w-[200px] shrink-0 border-r border-border md:block">
          <div className="p-4">
            <h1 className="text-lg font-bold text-foreground">Settings</h1>
          </div>
          {settingsNav.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                activeSection === s ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeSection === "Account" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Your Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
                  <Input defaultValue="alex@foundry.dev" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Username</label>
                  <Input defaultValue="@alexchen" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
                  <Input type="password" defaultValue="********" className="bg-input border-border text-foreground" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Connected Wallets</label>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>👻</span>
                        <span className="font-mono text-sm text-foreground">8xKj...4fQm</span>
                      </div>
                      <button className="text-sm text-destructive hover:underline">Disconnect</button>
                    </div>
                  </div>
                </div>
                <Button variant="hero">Save Changes</Button>
              </div>
            </div>
          )}

          {activeSection === "Workspace" && (
            <div className="max-w-lg">
              <h2 className="mb-2 text-xl font-bold text-foreground">Switch Workspace</h2>
              <p className="mb-6 text-sm text-muted-foreground">Your dashboard adapts to your selected workspace.</p>
              <div className="grid grid-cols-3 gap-3">
                {workspaces.map((w) => (
                  <button
                    key={w.label}
                    onClick={() => setActiveWorkspace(w.label)}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      activeWorkspace === w.label ? "border-primary bg-primary/5 glow-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <p className="mt-2 font-semibold text-foreground">{w.label}</p>
                    <p className="text-xs text-muted-foreground">{w.desc}</p>
                  </button>
                ))}
              </div>
              <Button variant="hero" className="mt-4">Switch</Button>
            </div>
          )}

          {activeSection === "Billing / Premium" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Billing & Premium</h2>
              
              {/* Free tier */}
              <div className="mb-6 rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">You're on Free Tier</h3>
                <div className="mt-3 space-y-2">
                  {limitations.map((l) => (
                    <div key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XIcon className="h-3.5 w-3.5 text-destructive" /> {l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium card */}
              <div className="rounded-xl border border-primary bg-card p-6 glow-primary-strong">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Unlock Your Service Agency</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">List services, get orders, earn in USDC.</p>
                <p className="mt-4 text-2xl font-bold text-primary">$5 <span className="text-sm font-normal text-muted-foreground">/ month · USDC · Any network</span></p>
                <div className="mt-4 space-y-2">
                  {benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-3.5 w-3.5 text-primary" /> {b}
                    </div>
                  ))}
                </div>
                <Button variant="hero" size="lg" className="mt-6 w-full glow-primary">
                  <Zap className="mr-1 h-4 w-4" /> Get Premium — $5 USDC
                </Button>
              </div>

              {/* Wallet connect */}
              <div className="mt-6 rounded-lg border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold text-foreground">Connect Wallet to Pay</h3>
                <div className="space-y-2">
                  {wallets.map((w) => (
                    <Button key={w.name} variant="outline" className="w-full justify-start gap-2">
                      <span>{w.icon}</span> {w.name}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>1. Connect wallet → 2. Send 5 USDC → 3. Premium activates instantly</p>
                  <p className="mt-2 font-mono text-foreground">Treasury: 8xKj...4fQm</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Profile" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Edit Profile</h2>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border text-lg font-bold text-foreground transition-colors hover:border-primary">AC</div>
                </div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Display Name</label><Input defaultValue="Alex Chen" className="bg-input border-border text-foreground" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Bio</label><textarea defaultValue="Full-stack builder obsessed with Web3." rows={3} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Location</label><Input defaultValue="San Francisco" className="bg-input border-border text-foreground" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Website</label><Input defaultValue="alexchen.dev" className="bg-input border-border text-foreground" /></div>
                <Button variant="hero">Save Profile</Button>
              </div>
            </div>
          )}

          {(activeSection === "Notifications" || activeSection === "Privacy" || activeSection === "Web3 / Wallet" || activeSection === "Security" || activeSection === "Help") && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">{activeSection}</h2>
              <p className="text-muted-foreground">Settings for {activeSection.toLowerCase()} will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
