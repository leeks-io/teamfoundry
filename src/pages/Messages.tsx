import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Send, Paperclip, Image, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Messages() {
  const { user } = useAuth();
  const [activeConvoUserId, setActiveConvoUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all conversations (unique users the current user has messaged with)
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: sent } = await supabase.from("messages").select("receiver_id, content, created_at, is_read").eq("sender_id", user.id).order("created_at", { ascending: false });
      const { data: received } = await supabase.from("messages").select("sender_id, content, created_at, is_read").eq("receiver_id", user.id).order("created_at", { ascending: false });

      const userMap = new Map<string, { lastMsg: string; time: string; unread: boolean }>();
      received?.forEach((m: any) => {
        if (!userMap.has(m.sender_id)) {
          userMap.set(m.sender_id, { lastMsg: m.content, time: m.created_at, unread: !m.is_read });
        }
      });
      sent?.forEach((m: any) => {
        if (!userMap.has(m.receiver_id)) {
          userMap.set(m.receiver_id, { lastMsg: m.content, time: m.created_at, unread: false });
        }
      });

      const userIds = Array.from(userMap.keys());
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, username, avatar_url").in("user_id", userIds);
      
      return userIds.map(uid => {
        const p = profiles?.find((pr: any) => pr.user_id === uid);
        const msg = userMap.get(uid)!;
        return { user_id: uid, full_name: p?.full_name, username: p?.username, avatar_url: p?.avatar_url, ...msg };
      }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    },
    enabled: !!user,
  });

  // Get messages for active conversation
  const { data: chatMessages = [] } = useQuery({
    queryKey: ["chat-messages", user?.id, activeConvoUserId],
    queryFn: async () => {
      if (!user || !activeConvoUserId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeConvoUserId}),and(sender_id.eq.${activeConvoUserId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeConvoUserId,
    refetchInterval: 5000,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !activeConvoUserId || !message.trim()) return;
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: activeConvoUserId,
        content: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const activeConvo = conversations.find((c: any) => c.user_id === activeConvoUserId);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-48px)] items-center justify-center text-muted-foreground">
          Sign in to view messages.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-48px)]">
        {/* Conversations List */}
        <div className={`${activeConvoUserId ? "hidden md:block" : "block"} w-full md:w-[380px] shrink-0 border-r border-border`}>
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <button className="text-muted-foreground hover:text-foreground"><Edit className="h-5 w-5" /></button>
          </div>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-input border-border pl-10 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet.</div>
            ) : (
              conversations.map((c: any) => (
                <div
                  key={c.user_id}
                  onClick={() => setActiveConvoUserId(c.user_id)}
                  className={`flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors ${activeConvoUserId === c.user_id ? "bg-secondary" : "hover:bg-secondary/30"}`}
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                    {getInitials(c.full_name)}
                    {c.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${c.unread ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{c.full_name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.time), { addSuffix: false })}</span>
                    </div>
                    <p className={`truncate text-sm ${c.unread ? "text-foreground" : "text-muted-foreground"}`}>{c.lastMsg}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${activeConvoUserId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
          {activeConvoUserId ? (
            <>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <button onClick={() => setActiveConvoUserId(null)} className="text-muted-foreground hover:text-foreground md:hidden mr-2">←</button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {getInitials(activeConvo?.full_name)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{activeConvo?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">@{activeConvo?.username || "user"}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.sender_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`mt-1 text-[10px] ${msg.sender_id === user.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-border p-4">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage.mutate(); }} className="flex items-center gap-2">
                  <button type="button" className="hidden sm:block text-muted-foreground hover:text-foreground"><Paperclip className="h-5 w-5" /></button>
                  <button type="button" className="hidden sm:block text-muted-foreground hover:text-foreground"><Image className="h-5 w-5" /></button>
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground" />
                  <Button type="submit" variant="hero" size="icon" className="h-9 w-9 shrink-0" disabled={!message.trim() || sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
              <p>Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
