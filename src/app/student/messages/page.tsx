"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contacts = [
  { id: 1, name: "Dr. Sarah Jenkins", role: "Math Teacher", avatar: "SJ", unread: 2, lastMessage: "Don't forget the assignment is due tomorrow." },
  { id: 2, name: "Rohit Verma", role: "Physics Teacher", avatar: "RV", unread: 0, lastMessage: "Great job on the quiz!" },
  { id: 3, name: "Admin Support", role: "Administration", avatar: "AD", unread: 0, lastMessage: "Your fee receipt has been generated." },
];

export default function StudentMessagesPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
     { id: 1, text: "Hello Rahul, how are you preparing for the final?", sender: "them", time: "10:00 AM" },
     { id: 2, text: "I'm going through the practice sheets you provided.", sender: "me", time: "10:05 AM" },
     { id: 3, text: "Don't forget the assignment is due tomorrow. Let me know if you need help.", sender: "them", time: "10:30 AM" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
     e.preventDefault();
     if (!input.trim()) return;
     
     setMessages([...messages, { id: Date.now(), text: input, sender: "me", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
     setInput("");
  };

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
               {contacts.map(contact => (
                  <button 
                     key={contact.id} 
                     onClick={() => setActiveContact(contact)}
                     className={`w-full flex items-center gap-3 p-4 border-b transition-colors text-left ${activeContact.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                  >
                     <Avatar>
                        <AvatarFallback className={activeContact.id === contact.id ? "bg-primary text-white" : "bg-muted"}>{contact.avatar}</AvatarFallback>
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
         </div>

      </div>
    </div>
  );
}
