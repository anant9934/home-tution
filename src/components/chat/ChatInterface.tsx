"use client";

import { useState, useEffect, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { Send, User, Search, CheckCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatInterface({ currentUserId, currentUserRole }: { currentUserId: string, currentUserRole: string }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for conversations
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for messages in active conversation
  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
      const interval = setInterval(() => loadMessages(activeConversationId), 3000);
      return () => clearInterval(interval);
    }
  }, [activeConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    try {
      const data = await fetchApi("/messages/conversations");
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: string) {
    if (activeConversationId !== conversationId) {
      setLoadingMessages(true);
    }
    try {
      const data = await fetchApi(`/messages/conversations/${conversationId}`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    const text = messageInput;
    setMessageInput(""); // Optimistic clear
    
    // Optimistic UI update
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: currentUserId,
      messageText: text,
      createdAt: new Date().toISOString()
    }]);

    try {
      await fetchApi(`/messages/conversations/${activeConversationId}`, {
        method: "POST",
        body: JSON.stringify({ messageText: text })
      });
      // Force reload to get exact server state
      loadMessages(activeConversationId);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Revert optimistic update? For simplicity, we just reload
      loadMessages(activeConversationId);
    }
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeParticipant = activeConversation?.participant;

  return (
    <div className="bg-white rounded-3xl border shadow-sm flex h-[700px] max-h-[80vh] overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-1/3 border-r flex flex-col bg-slate-50/50">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold font-heading text-lg mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 rounded-full bg-slate-100 border-none" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loadingConversations && conversations.length === 0 ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-sm text-muted-foreground">No conversations yet.</div>
          ) : (
            conversations.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveConversationId(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeConversationId === c.id ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-100 text-slate-900'}`}
              >
                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-lg ${activeConversationId === c.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  {c.participant.avatarUrl ? (
                    <img src={c.participant.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    c.participant.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-semibold truncate">{c.participant.name}</div>
                    {c.latestMessage && (
                       <div className={`text-xs ${activeConversationId === c.id ? 'text-white/70' : 'text-slate-400'}`}>
                         {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    )}
                  </div>
                  <div className={`text-xs truncate ${activeConversationId === c.id ? 'text-white/90 font-medium' : 'text-slate-500'}`}>
                    {c.latestMessage?.messageText || 'Tap to start chatting...'}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50">
        {activeConversationId ? (
          <>
            {/* CHAT HEADER */}
            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {activeParticipant?.avatarUrl ? (
                    <img src={activeParticipant.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    activeParticipant?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold">{activeParticipant?.name}</div>
                  <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{activeParticipant?.role}</div>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : (
                messages.map((m, idx) => {
                  const isMe = m.senderId === currentUserId;
                  const showAvatar = !isMe && (idx === 0 || messages[idx-1].senderId !== m.senderId);
                  
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                          {showAvatar ? (
                             <User className="w-4 h-4 text-slate-500" />
                          ) : null}
                        </div>
                      )}
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary text-white rounded-br-sm shadow-md' : 'bg-white border text-slate-900 rounded-bl-sm shadow-sm'}`}>
                        <div className="text-sm">{m.messageText}</div>
                        <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 rounded-full bg-slate-100 border-none px-6"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <Button type="submit" size="icon" className="rounded-full w-10 h-10 shrink-0 shadow-md">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">Your Messages</h3>
            <p className="max-w-xs">Select a conversation from the sidebar to start chatting securely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
