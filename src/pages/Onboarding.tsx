import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hexagon, ArrowRight, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  { icon: "🎯", title: "Job Seeker / Talent", desc: "Apply for jobs, showcase your resume, get hired." },
  { icon: "💼", title: "Freelancer / Contractor", desc: "Sell your services, manage orders, earn in USDC." },
  { icon: "🚀", title: "Founder / Entrepreneur", desc: "Post jobs, build teams, launch and sell startups." },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[560px]">
        <div className="mb-6 flex justify-center">
          <Hexagon className="h-8 w-8 text-primary" />
        </div>
        <p className="mb-2 text-center text-sm text-muted-foreground">Step {step} of 2</p>
        <div className="mb-8 h-1 rounded-full bg-secondary">
          <div className={`h-full rounded-full bg-primary transition-all ${step === 1 ? "w-1/2" : "w-full"}`} />
        </div>

        {step === 1 ? (
          <>
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
              How do you want to use Foundry?
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              You can switch roles later in settings.
            </p>
            <div className="flex flex-col gap-3">
              {roles.map((r) => (
                <button
                  key={r.title}
                  onClick={() => setSelectedRole(r.title)}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    selectedRole === r.title
                      ? "border-primary bg-primary/5 glow-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <h3 className="mt-2 font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                </button>
              ))}
            </div>
            <Button
              variant="hero"
              className="mt-6 w-full"
              disabled={!selectedRole}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
              Set up your builder profile
            </h1>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border transition-colors hover:border-primary">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <Input placeholder="@username" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
              <div className="relative">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 160))}
                  placeholder="Bio"
                  rows={3}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{bio.length}/160</span>
              </div>
              <div>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add skills (press Enter)"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {s}
                      <button onClick={() => setSkills(skills.filter((sk) => sk !== s))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <Button variant="hero" className="mt-2 w-full" onClick={() => navigate("/dashboard")}>
                Finish Setup <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <button onClick={() => navigate("/dashboard")} className="text-center text-sm text-muted-foreground hover:text-foreground">
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
