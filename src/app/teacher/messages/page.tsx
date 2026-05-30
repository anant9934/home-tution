"use client";

import { MessageSquare, Search, Send, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TeacherMessagesPage() {
  // Simple static UI for messages as dynamic chat involves WebSockets usually.
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col sm:flex-row gap-6 animate-in fade-in">
      
      {/* Sidebar: Chats List */}
      <div className="w-full sm:w-80 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col shrink-0">
         <div className="p-4 border-b">
            <h2 className="font-bold font-heading flex items-center gap-2 mb-4">
               <MessageSquare className="w-5 h-5 text-primary" /> Messages
            </h2>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <Input placeholder="Search students..." className="pl-9 rounded-full bg-slate-50" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto divide-y">
            {[1, 2, 3].map(i => (
               <div key={i} className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${i === 1 ? 'bg-primary/5' : 'hover:bg-slate-50'}`}>
                  <div className="relative">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                        {['AN', 'ST', 'RV'][i-1]}
                     </div>
                     {i === 1 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-1">
                        <div className={`font-semibold text-sm truncate ${i === 1 ? 'text-primary' : ''}`}>
                           {['Ananya Sharma', 'Rahul Verma', 'Sneha Patel'][i-1]}
                        </div>
                        <div className="text-[10px] text-muted-foreground">10:42 AM</div>
                     </div>
                     <div className={`text-xs truncate ${i === 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {['Sir, I had a doubt regarding the last assignment...', 'Okay got it, thank you!', 'When is the next class scheduled?'][i-1]}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col hidden sm:flex relative">
         {/* Chat Header */}
         <div className="h-16 border-b flex items-center justify-between px-6 bg-slate-50/50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">AN</div>
               <div>
                  <div className="font-bold text-sm">Ananya Sharma</div>
                  <div className="text-xs text-success flex items-center gap-1">
                     <span className="w-2 h-2 bg-success rounded-full"></span> Online
                  </div>
               </div>
            </div>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            <div className="flex flex-col gap-1 items-start">
               <div className="bg-slate-100 text-foreground px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                  Good morning sir! I had a doubt regarding the last calculus assignment.
               </div>
               <div className="text-[10px] text-muted-foreground ml-1">10:40 AM</div>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
               <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-sm">
                  Good morning Ananya. Sure, which question number is giving you trouble?
               </div>
               <div className="text-[10px] text-muted-foreground mr-1">10:42 AM</div>
            </div>
         </div>

         {/* Chat Input */}
         <div className="p-4 bg-white border-t flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0 rounded-full hover:bg-slate-100">
               <ImageIcon className="w-5 h-5" />
            </Button>
            <Input placeholder="Type your message here..." className="rounded-full bg-slate-50 border-transparent focus-visible:ring-primary/20 flex-1" />
            <Button size="icon" className="shrink-0 rounded-full shadow-sm">
               <Send className="w-4 h-4" />
            </Button>
         </div>
      </div>

    </div>
  );
}
