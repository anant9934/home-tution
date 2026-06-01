"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  isOwn: boolean;
  seen: boolean;
  date: string;
}

interface Conversation {
  id: string;
  otherUser: { id: string; name: string; role: string; avatarUrl: string | null } | null;
  lastMessage: { text: string; date: string; isOwn: boolean } | null;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  // Mobile: "list" | "chat"
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const result = await fetchApi("/parents/messages");
      setConversations(result);
      if (result.length > 0 && !selectedConv) {
        setSelectedConv(result[0].id);
      }
      setError(null);
    } catch (err: any) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedConv]);

  useEffect(() => {
    loadMessages();
    // Poll every 15 seconds for new messages
    pollRef.current = setInterval(() => loadMessages(true), 15000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv, conversations]);

  // Mark messages as read when a conversation is selected
  const handleSelectConversation = async (convId: string) => {
    setSelectedConv(convId);
    setMobileView("chat");

    // Optimistically clear unread count
    setConversations(prev =>
      prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c)
    );

    try {
      await fetchApi(`/parents/messages/${convId}/read`, { method: "PATCH" });
    } catch {
      // non-critical — ignore silently
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConv);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversation?.otherUser) return;

    setSending(true);
    try {
      await fetchApi("/parents/messages", {
        method: "POST",
        body: JSON.stringify({
          tutorUserId: selectedConversation.otherUser.id,
          messageText: replyText,
        }),
      });
      setReplyText("");
      await loadMessages(true);
      toast.success("Message sent!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 pb-20 lg:pb-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          <Skeleton className="rounded-3xl" />
          <Skeleton className="lg:col-span-2 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load messages</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4 rounded-xl" onClick={() => loadMessages()}>Try Again</Button>
      </div>
    );
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="pb-20 lg:pb-8 flex flex-col" style={{ height: "calc(100vh - 5rem)" }}>
      {/* Page Header — only visible on desktop or on mobile list view */}
      <div className={`mb-4 flex items-center justify-between ${mobileView === "chat" ? "lg:flex hidden" : "flex"}`}>
        <div>
          <h1 className="text-3xl font-bold font-heading">Messages</h1>
          <p className="text-muted-foreground mt-1">Chat with your child&apos;s tutors.</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => loadMessages(true)} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile chat header (back button) */}
      {mobileView === "chat" && selectedConversation && (
        <div className="lg:hidden flex items-center gap-3 mb-4 p-3 bg-white rounded-2xl border shadow-sm">
          <Button variant="ghost" size="icon" className="rounded-xl shrink-0" onClick={() => setMobileView("list")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {selectedConversation.otherUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-sm">{selectedConversation.otherUser?.name}</h4>
            <p className="text-[10px] text-muted-foreground capitalize">{selectedConversation.otherUser?.role?.toLowerCase()}</p>
          </div>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="bg-white rounded-3xl border shadow-sm p-12 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold font-heading text-lg mb-2">No conversations yet</h3>
          <p className="text-muted-foreground text-sm">Messages from tutors will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Conversation List — always visible on desktop, hidden on mobile when chat is open */}
          <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ${mobileView === "chat" ? "hidden lg:flex" : "flex"}`}>
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">
                Conversations ({conversations.length})
                {totalUnread > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-2 py-0.5">{totalUnread} unread</span>
                )}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left p-4 border-b hover:bg-slate-50 transition-colors ${selectedConv === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {conv.otherUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm truncate">{conv.otherUser?.name || "Unknown"}</span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage?.isOwn ? "You: " : ""}{conv.lastMessage?.text || "No messages"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {conv.lastMessage?.date ? new Date(conv.lastMessage.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Thread — always visible on desktop, visible only in "chat" mode on mobile */}
          <div className={`lg:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}>
            {selectedConversation ? (
              <>
                {/* Header — desktop only (mobile shows the header bar above) */}
                <div className="hidden lg:flex p-4 border-b bg-slate-50 items-center gap-3 shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {selectedConversation.otherUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{selectedConversation.otherUser?.name}</h4>
                    <p className="text-[10px] text-muted-foreground capitalize">{selectedConversation.otherUser?.role?.toLowerCase()}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {selectedConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-slate-100 text-foreground rounded-bl-md"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {new Date(msg.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} •{" "}
                          {new Date(msg.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          {msg.isOwn && msg.seen && " · ✓✓"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <form onSubmit={handleSend} className="p-4 border-t bg-white shrink-0">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 h-11 px-4 rounded-xl border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0" disabled={sending || !replyText.trim()}>
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
