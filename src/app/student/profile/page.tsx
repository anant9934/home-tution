"use client";

import { useState } from "react";
import { User, Settings, Bell, Shield, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function StudentProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      <div>
         <h1 className="text-3xl font-bold font-heading">Profile & Settings</h1>
         <p className="text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Sidebar / Nav */}
         <div className="space-y-2">
            {[
               { name: "Personal Info", icon: User, active: true },
               { name: "Account Settings", icon: Settings },
               { name: "Notifications", icon: Bell },
               { name: "Privacy & Security", icon: Shield },
            ].map(tab => (
               <button key={tab.name} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold ${tab.active ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-muted-foreground hover:text-foreground'}`}>
                  <tab.icon className="w-5 h-5" /> {tab.name}
               </button>
            ))}
            
            <div className="pt-8 mt-8 border-t">
               <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5" /> Sign Out
               </button>
            </div>
         </div>

         {/* Main Form Area */}
         <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border shadow-sm p-6 sm:p-8">
               <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                  <div className="relative">
                     <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-md">
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">RV</AvatarFallback>
                     </Avatar>
                     <button className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors">
                        <User className="w-4 h-4" />
                     </button>
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold font-heading">Rahul Verma</h2>
                     <p className="text-muted-foreground">Class 12 • Science Stream</p>
                     <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">Pro Plan Active</div>
                  </div>
               </div>

               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">First Name</label>
                        <Input defaultValue="Rahul" className="rounded-xl bg-slate-50 border-slate-200" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Last Name</label>
                        <Input defaultValue="Verma" className="rounded-xl bg-slate-50 border-slate-200" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Email Address</label>
                     <Input defaultValue="rahul.verma@example.com" type="email" className="rounded-xl bg-slate-50 border-slate-200" />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Phone Number</label>
                     <Input defaultValue="+91 98765 43210" type="tel" className="rounded-xl bg-slate-50 border-slate-200" />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-4">
                     {saved && <span className="text-success text-sm font-bold flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
                     <Button type="submit" className="rounded-xl px-8 font-bold">
                        Save Changes
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
}
