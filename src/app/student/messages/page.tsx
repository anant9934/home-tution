"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Search, CheckCheck, Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchApi("/students/messages");
        
        // Transform the conversations to match UI
        const mappedContacts = data.map((conv: any, index: number) => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          // Since it's a student, other participant is usually a Tutor or Admin
          // For simplicity, we just use the first message sender's name if it's not the current user
          const otherParticipant = conv.messages.find((m: any) => m.sender.role !== 'STUDENT')?.sender || { name: 'Support', role: 'ADMIN' };
          
          return {
            id: conv.id,
            name: otherParticipant.name,
            role: otherParticipant.role === 'TUTOR' ? 'Teacher' : 'Administration',
            avatar: otherParticipant.name.substring(0, 2).toUpperCase(),
            unread: 0,
            lastMessage: lastMsg?.messageText || 'No messages yet',
            rawMessages: conv.messages
          };
        });

        if (mappedContacts.length === 0) {
          // If no conversations, provide a default support channel
          mappedContacts.push({
            id: 'support',
            name: 'Admin Support',
            role: 'Administration',
            avatar: 'AD',
            unread: 0,
            lastMessage: 'Welcome to Home Tuition!',
            rawMessages: [{ id: '1', text: 'Welcome! Let us know if you need help.', sender: 'them', time: new Date().toLocaleTimeString() }]
          });
        }

        setConversations(mappedContacts);
        setActiveContact(mappedContacts[0]);
        setMessages(mappedContacts[0].rawMessages.map((m: any) => ({
          id: m.id,
          text: m.messageText || m.text,
          sender: m.sender?.role === 'STUDENT' ? 'me' : 'them',
          time: new Date(m.createdAt || new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        })));
      } catch (err: any) {
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, []);

  const handleSelectContact = (contact: any) => {
    setActiveContact(contact);
    setMessages(contact.rawMessages.map((m: any) => ({
      id: m.id,
      text: m.messageText || m.text,
      sender: m.sender?.role === 'STUDENT' || m.sender === 'me' ? 'me' : 'them',
      time: new Date(m.createdAt || new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })));
  };

  const handleSend = (e: React.FormEvent) => {
     e.preventDefault();
     if (!input.trim() || !activeContact) return;
     
     // In a real implementation, this would POST to /students/messages
     const newMsg = { 
       id: Date.now().toString(), 
       text: input, 
       sender: "me", 
       time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
     };
     
     setMessages([...messages, newMsg]);
     
     // Update last message in sidebar
     setConversations(conversations.map(c => 
       c.id === activeContact.id ? { ...c, lastMessage: input, rawMessages: [...c.rawMessages, { ...newMsg, messageText: input, sender: 'me' }] } : c
     ));
     
     setInput("");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-20 lg:pb-0">
        <Skeleton className="h-12 w-48 mb-6 shrink-0" />
        <Skeleton className="flex-1 w-full rounded-3xl" />
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-20 lg:pb-0">
      <div className="mb-6 shrink-0">
         <h1 className="text-3xl font-bold font-heading">Messages</h1>
         <p className="text-muted-foreground mt-1">Communicate with your teachers and administration.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border shadow-sm flex overflow-hidden min-h-[400px]">
         
         {/* Sidebar */}
         <div className="w-full sm:w-80 border-r flex flex-col shrink-0 hidden sm:flex">
            <div className="p-4 border-b">
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9 rounded-full bg-slate-50 border-transparent focus-visible:ring-primary/20" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               {conversations.map(contact => (
                  <button 
                     key={contact.id} 
                     onClick={() => handleSelectContact(contact)}
                     className={`w-full flex items-center gap-3 p-4 border-b transition-colors text-left ${activeContact?.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                  >
                     <Avatar>
                        <AvatarFallback className={activeContact?.id === contact.id ? "bg-primary text-white" : "bg-muted"}>{contact.avatar}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                           <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                           {contact.unread > 0 && <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{contact.unread}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 flex flex-col">
            {activeContact ? (
              <>
                <div className="h-16 border-b flex items-center px-6 shrink-0 bg-slate-50/50">
                   <Avatar className="w-10 h-10 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{activeContact.avatar}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="font-bold">{activeContact.name}</h3>
                      <p className="text-xs text-muted-foreground">{activeContact.role}</p>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                   {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                         <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'me' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>
                            {msg.text}
                         </div>
                         <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-medium">
                            {msg.time}
                            {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-primary ml-1" />}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-4 border-t bg-white shrink-0">
                   <form onSubmit={handleSend} className="flex gap-2">
                      <Input 
                         value={input} 
                         onChange={e => setInput(e.target.value)} 
                         placeholder="Type your message..." 
                         className="rounded-full bg-slate-50 border-slate-200"
                      />
                      <Button type="submit" size="icon" className="rounded-full shrink-0 h-10 w-10">
                         <Send className="w-4 h-4 ml-0.5" />
                      </Button>
                   </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                 Select a conversation to start messaging
              </div>
            )}
         </div>

      </div>
    </div>
  );
}
