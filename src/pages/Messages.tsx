import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Send, Paperclip, Image, Mic } from "lucide-react";
import { useState } from "react";

const conversations = [
  { name: "Maria Santos", handle: "@mariasantos", lastMsg: "Sounds great! Let's schedule a call.", time: "2m", unread: true },
  { name: "Dev Patel", handle: "@devpatel", lastMsg: "The audit report is ready for review.", time: "1h", unread: true },
  { name: "Luna Kim", handle: "@lunakim", lastMsg: "Thanks for the referral! 🙏", time: "3h", unread: false },
  { name: "Jordan Taylor", handle: "@jordant", lastMsg: "Can you take a look at this wireframe?", time: "1d", unread: false },
  { name: "Sara Williams", handle: "@saraw", lastMsg: "Payment confirmed via escrow.", time: "2d", unread: false },
];

const chatMessages = [
  { from: "them", text: "Hey! I saw your profile on Foundry. Love your work on Web3 landing pages.", time: "10:30 AM" },
  { from: "me", text: "Thanks Maria! Really appreciate it. What are you working on?", time: "10:32 AM" },
  { from: "them", text: "We're building a DeFi protocol and need a complete UI overhaul. Interested?", time: "10:35 AM" },
  { from: "me", text: "Absolutely! I'd love to help. Let me send you my portfolio.", time: "10:36 AM" },
  { from: "them", text: "Perfect! Also, should we use Foundry's escrow for the payment?", time: "10:40 AM" },
  { from: "me", text: "Yes, definitely. It's seamless — I'll create a service order.", time: "10:41 AM" },
  { from: "them", text: "Sounds great! Let's schedule a call.", time: "10:45 AM" },
];

export default function Messages() {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-48px)]">
        {/* Conversations List */}
        <div className="w-[380px] shrink-0 border-r border-border">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <button className="text-muted-foreground hover:text-foreground"><Edit className="h-5 w-5" /></button>
          </div>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((c) => (
              <div
                key={c.handle}
                onClick={() => setActiveConvo(c)}
                className={`flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors ${
                  activeConvo.handle === c.handle ? "bg-secondary" : "hover:bg-secondary/30"
                }`}
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                  {c.name.split(" ").map(n => n[0]).join("")}
                  {c.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${c.unread ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className={`truncate text-sm ${c.unread ? "text-foreground" : "text-muted-foreground"}`}>{c.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {activeConvo.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold text-foreground">{activeConvo.name}</p>
              <p className="text-xs text-muted-foreground">{activeConvo.handle}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">View Profile</Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  msg.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${msg.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Deal Card */}
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl border border-primary bg-card p-4">
                <p className="text-xs font-medium text-primary">Service Order Proposal</p>
                <p className="mt-1 font-semibold text-foreground">DeFi Dashboard UI Redesign</p>
                <p className="mt-1 text-lg font-bold text-primary">500 USDC</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="hero" size="sm">Accept Order</Button>
                  <Button variant="outline" size="sm">Decline</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <button className="text-muted-foreground hover:text-foreground"><Paperclip className="h-5 w-5" /></button>
              <button className="text-muted-foreground hover:text-foreground"><Image className="h-5 w-5" /></button>
              <button className="text-muted-foreground hover:text-foreground"><Mic className="h-5 w-5" /></button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button variant="hero" size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
