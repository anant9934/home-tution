"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Search, CheckCheck, Loader2, AlertCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function TeacherMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  
  // New conversation modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const data = await fetchApi("/messages/conversations");
      setConversations(data);
      if (data.length > 0 && !activeContact) {
        handleSelectContact(data[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Fetch students for the "New Message" dropdown
    fetchApi("/tutors/students").then(setStudents).catch(console.error);
    
    // Poll every 10 seconds for new messages
    const interval = setInterval(() => {
      if (!loading && !sending) {
        fetchConversations();
        if (activeContact) fetchMessages(activeContact.id);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await fetchApi(`/messages/conversations/${conversationId}`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSelectContact = (contact: any) => {
    setActiveContact(contact);
    fetchMessages(contact.id);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeContact) return;
    
    const messageText = input;
    setInput("");
    setSending(true);

    try {
      await fetchApi(`/messages/conversations/${activeContact.id}`, {
        method: "POST",
        body: JSON.stringify({ messageText })
      });
      await fetchMessages(activeContact.id);
      await fetchConversations();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
      setInput(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleStartNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return toast.error("Please select a student");
    
    try {
      const res = await fetchApi("/messages/conversations", {
        method: "POST",
        body: JSON.stringify({ targetUserId: selectedStudentId })
      });
      setIsNewModalOpen(false);
      await fetchConversations();
      
      // Select the newly created/fetched conversation
      const newConv = { id: res.id, participant: res.participants.find((p: any) => p.id === selectedStudentId) };
      handleSelectContact(newConv);
    } catch (err: any) {
      toast.error(err.message || "Failed to start conversation");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] gap-6">
        <Skeleton className="w-80 h-full rounded-3xl" />
        <Skeleton className="flex-1 h-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load messages</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col sm:flex-row gap-6 animate-in fade-in">
      {/* Sidebar */}
      <div className={`w-full sm:w-80 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col shrink-0 ${activeContact ? 'hidden sm:flex' : 'flex'}`}>
         <div className="p-6 border-b bg-slate-50">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Messages
               </h2>
               <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
                 <DialogTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Plus className="w-4 h-4" /></Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <DialogTitle>Start New Conversation</DialogTitle>
                   </DialogHeader>
                   <form onSubmit={handleStartNewConversation} className="space-y-4 mt-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Select Student</label>
                       <select 
                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                         value={selectedStudentId}
                         onChange={e => setSelectedStudentId(e.target.value)}
                         required
                       >
                         <option value="">Select a student...</option>
                         {students.map(s => (
                           <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                         ))}
                       </select>
                     </div>
                     <Button type="submit" className="w-full">Start Chat</Button>
                   </form>
                 </DialogContent>
               </Dialog>
            </div>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <Input placeholder="Search messages..." className="pl-9 rounded-2xl bg-white" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto divide-y p-2">
            {conversations.map((c) => (
               <div 
                  key={c.id} 
                  onClick={() => handleSelectContact(c)}
                  className={`p-4 flex items-center gap-4 cursor-pointer rounded-2xl transition-all mb-1 ${activeContact?.id === c.id ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
               >
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                     <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {c.participant?.name?.substring(0, 2).toUpperCase() || 'U'}
                     </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-1">
                        <div className={`font-bold truncate ${activeContact?.id === c.id ? 'text-primary' : ''}`}>
                           {c.participant?.name || 'Unknown User'}
                        </div>
                        <div className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                           {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </div>
                     </div>
                     <div className={`text-sm truncate ${!c.latestMessage?.seen ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {c.latestMessage?.messageText || 'No messages yet'}
                     </div>
                  </div>
               </div>
            ))}
            {conversations.length === 0 && (
               <div className="text-center p-8 text-muted-foreground">
                  No conversations yet. Start a new chat!
               </div>
            )}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col ${!activeContact ? 'hidden sm:flex sm:items-center sm:justify-center' : 'flex'}`}>
         {!activeContact ? (
            <div className="text-center p-8">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold mb-2">Your Messages</h3>
               <p className="text-muted-foreground">Select a conversation from the sidebar to start chatting.</p>
            </div>
         ) : (
            <>
               {/* Chat Header */}
               <div className="h-20 border-b flex items-center px-6 bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                  <Button variant="ghost" size="sm" className="sm:hidden mr-4" onClick={() => setActiveContact(null)}>
                     ← Back
                  </Button>
                  <div className="flex items-center gap-4">
                     <Avatar className="w-12 h-12 shadow-sm border-2 border-white">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                           {activeContact.participant?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <div className="font-bold text-lg">{activeContact.participant?.name || 'Unknown User'}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                           <span className="w-2 h-2 bg-success rounded-full"></span> Online
                        </div>
                     </div>
                  </div>
               </div>

               {/* Messages List */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                  {messages.map((m: any, i: number) => {
                     const isMe = m.senderId !== activeContact.participant.id;
                     
                     return (
                        <div key={m.id} className={`flex flex-col gap-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                           <div className={`px-5 py-3 rounded-2xl text-sm max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-sm ${
                              isMe 
                                 ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                 : 'bg-white border text-foreground rounded-tl-sm'
                           }`}>
                              {m.messageText}
                           </div>
                           <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground font-medium">
                                 {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                              {isMe && <CheckCheck className="w-3 h-3 text-primary/70" />}
                           </div>
                        </div>
                     );
                  })}
                  <div ref={messagesEndRef} />
               </div>

               {/* Chat Input */}
               <div className="p-4 bg-white border-t">
                  <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
                     <div className="flex-1 relative">
                        <Input 
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           placeholder="Type a message..." 
                           className="rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-primary/20 py-6 pr-12 text-base shadow-sm" 
                           disabled={sending}
                        />
                     </div>
                     <Button 
                        type="submit" 
                        size="icon" 
                        className="h-12 w-12 rounded-2xl shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95" 
                        disabled={!input.trim() || sending}
                     >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                     </Button>
                  </form>
               </div>
            </>
         )}
      </div>
    </div>
  );
}
