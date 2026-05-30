"use client";

import { useState, useEffect } from "react";
import { User, Settings, Bell, Shield, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchApi("/students/profile");
        setProfile(data);
        const nameParts = data.name.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi("/students/profile", {
         method: "PATCH",
         body: JSON.stringify({ firstName, lastName, email, phone })
      });
      
      toast.success("Profile updated successfully");
      
      setProfile({
        ...profile,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="md:col-span-2 h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

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
               <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5" /> Sign Out
               </button>
            </div>
         </div>

         {/* Main Form Area */}
         <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border shadow-sm p-6 sm:p-8">
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b">
                  <div className="relative shrink-0">
                     <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-md">
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                           {profile.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <button className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors">
                        <User className="w-4 h-4" />
                     </button>
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold font-heading">{profile.name}</h2>
                     <p className="text-muted-foreground capitalize">Class {profile.class} • {profile.board}</p>
                     <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">Active Student</div>
                     {profile.school && <p className="text-sm mt-2 font-medium text-slate-600">{profile.school}</p>}
                  </div>
               </div>

               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">First Name</label>
                        <Input 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          className="rounded-xl bg-slate-50 border-slate-200" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Last Name</label>
                        <Input 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          className="rounded-xl bg-slate-50 border-slate-200" 
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Email Address</label>
                     <Input 
                       value={email} 
                       onChange={(e) => setEmail(e.target.value)} 
                       type="email" 
                       className="rounded-xl bg-slate-50 border-slate-200" 
                     />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Phone Number</label>
                     <Input 
                       value={phone} 
                       onChange={(e) => setPhone(e.target.value)} 
                       type="tel" 
                       className="rounded-xl bg-slate-50 border-slate-200" 
                     />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-4">
                     <Button type="submit" disabled={saving} className="rounded-xl px-8 font-bold">
                        {saving ? "Saving..." : "Save Changes"}
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
}
