import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Zap, Check, X as XIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const settingsNav = ["Account", "Profile", "Notifications", "Privacy", "Workspace", "Billing / Premium", "Web3 / Wallet", "Security", "Help"];

const workspaces = [
  { icon: "🎯", label: "job_seeker", display: "Talent", desc: "Job Seeker" },
  { icon: "💼", label: "freelancer", display: "Freelancer", desc: "Contractor" },
  { icon: "🚀", label: "founder", display: "Founder", desc: "Entrepreneur" },
];

const limitations = ["2 job applications/day", "2 service listings/month", "5 follows max", "Startup Marketplace locked"];
const benefits = ["Unlimited service listings", "Unlimited job applications", "Unlimited job posts", "Startup For Sale marketplace", "Premium profile badge", "Zero platform fees"];

export default function Settings() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Account");
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [activeWorkspace, setActiveWorkspace] = useState(profile?.role || "founder");

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, bio, location, website, username }).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else { await refreshProfile(); toast.success("Profile updated!"); }
    setSaving(false);
  };

  const handleSwitchWorkspace = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ role: activeWorkspace }).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else { await refreshProfile(); toast.success("Workspace switched!"); }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-muted-foreground">Sign in to access settings.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row">
        {/* Settings Nav */}
        <div className="w-full md:w-[200px] shrink-0 border-b md:border-b-0 md:border-r border-border">
          <div className="p-4">
            <h1 className="text-lg font-bold text-foreground">Settings</h1>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-none">
            {settingsNav.map((s) => (
              <button key={s} onClick={() => setActiveSection(s)} className={`shrink-0 px-4 py-2.5 text-left text-sm transition-colors ${activeSection === s ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {activeSection === "Account" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Your Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
                  <Input value={user.email || ""} disabled className="bg-input border-border text-foreground opacity-60" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-input border-border text-foreground" />
                </div>
                <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleSignOut} className="text-destructive">Sign Out</Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Profile" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Edit Profile</h2>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border text-lg font-bold text-foreground">
                    {(profile?.full_name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                </div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Display Name</label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-input border-border text-foreground" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Location</label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-input border-border text-foreground" /></div>
                <div><label className="mb-1.5 block text-sm text-muted-foreground">Website</label><Input value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-input border-border text-foreground" /></div>
                <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
              </div>
            </div>
          )}

          {activeSection === "Workspace" && (
            <div className="max-w-lg">
              <h2 className="mb-2 text-xl font-bold text-foreground">Switch Workspace</h2>
              <p className="mb-6 text-sm text-muted-foreground">Your dashboard adapts to your selected workspace.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {workspaces.map((w) => (
                  <button key={w.label} onClick={() => setActiveWorkspace(w.label)} className={`rounded-xl border p-4 text-center transition-all ${activeWorkspace === w.label ? "border-primary bg-primary/5 glow-primary" : "border-border hover:border-muted-foreground"}`}>
                    <span className="text-2xl">{w.icon}</span>
                    <p className="mt-2 font-semibold text-foreground">{w.display}</p>
                    <p className="text-xs text-muted-foreground">{w.desc}</p>
                  </button>
                ))}
              </div>
              <Button variant="hero" className="mt-4" onClick={handleSwitchWorkspace} disabled={saving}>{saving ? "Switching..." : "Switch"}</Button>
            </div>
          )}

          {activeSection === "Billing / Premium" && (
            <div className="max-w-lg">
              <h2 className="mb-6 text-xl font-bold text-foreground">Billing & Premium</h2>
              {profile?.is_premium ? (
                <div className="rounded-lg border border-primary bg-card p-5">
                  <h3 className="font-semibold text-primary">✅ You're on Premium</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Enjoy unlimited access to all Foundry features.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground">You're on Free Tier</h3>
                    <div className="mt-3 space-y-2">
                      {limitations.map((l) => (
                        <div key={l} className="flex items-center gap-2 text-sm text-muted-foreground"><XIcon className="h-3.5 w-3.5 text-destructive" /> {l}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary bg-card p-6 glow-primary">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">Unlock Your Service Agency</h3>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-primary">$5 <span className="text-sm font-normal text-muted-foreground">/ month · USDC</span></p>
                    <div className="mt-4 space-y-2">
                      {benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2 text-sm text-foreground"><Check className="h-3.5 w-3.5 text-primary" /> {b}</div>
                      ))}
                    </div>
                    <Button variant="hero" size="lg" className="mt-6 w-full"><Zap className="mr-1 h-4 w-4" /> Get Premium — $5 USDC</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {!["Account", "Profile", "Workspace", "Billing / Premium"].includes(activeSection) && (
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
