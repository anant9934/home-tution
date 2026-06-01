"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Bell, Info, AlertTriangle, ShieldCheck, FileText, IndianRupee, Megaphone, Calendar, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSendModal, setShowSendModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("ANNOUNCEMENT");
  const [targetRole, setTargetRole] = useState("ALL");

  const loadNotifications = async () => {
    try {
      const data = await fetchApi("/admin/notifications");
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/admin/notifications", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle,
          message: newMessage,
          type: newType,
          targetRole
        })
      });
      toast.success("Notification sent successfully!");
      setShowSendModal(false);
      setNewTitle("");
      setNewMessage("");
      loadNotifications();
    } catch (err: any) {
      toast.error(err.message || "Failed to send notification");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in max-w-4xl relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" /> System Logs & Broadcast
          </h1>
          <p className="text-muted-foreground mt-1">Monitor recent platform activity and send broadcast alerts.</p>
        </div>
        <Button onClick={() => setShowSendModal(true)} className="rounded-full font-bold shadow-sm gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Send Broadcast
        </Button>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold font-heading text-lg">Send Broadcast Notification</h3>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowSendModal(false)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleSendNotification} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Audience</label>
                    <select 
                       required 
                       value={targetRole}
                       onChange={e => setTargetRole(e.target.value)}
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                       <option value="ALL">Everyone (All Users)</option>
                       <option value="STUDENT">All Students</option>
                       <option value="TUTOR">All Tutors</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Title</label>
                    <Input 
                       required 
                       placeholder="e.g. System Maintenance" 
                       value={newTitle} 
                       onChange={e => setNewTitle(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Message</label>
                    <textarea 
                       required 
                       placeholder="Enter notification content..." 
                       value={newMessage}
                       onChange={e => setNewMessage(e.target.value)}
                       className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Type</label>
                    <select 
                       required 
                       value={newType}
                       onChange={e => setNewType(e.target.value)}
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                       <option value="ANNOUNCEMENT">Announcement</option>
                       <option value="ALERT">Critical Alert</option>
                       <option value="INFO">Information</option>
                    </select>
                 </div>
                 <Button type="submit" className="w-full font-bold mt-4">Send Now</Button>
              </form>
           </div>
        </div>
      )}

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="divide-y">
            {notifications.map((n) => {
               let Icon = Info;
               let iconColorClass = 'text-primary bg-primary/10';
               
               switch (n.type) {
                  case 'ASSIGNMENT':
                  case 'QUIZ':
                     Icon = FileText;
                     iconColorClass = 'text-sky-500 bg-sky-500/10';
                     break;
                  case 'FEE':
                     Icon = IndianRupee;
                     iconColorClass = 'text-emerald-500 bg-emerald-500/10';
                     break;
                  case 'CLASS':
                     Icon = Calendar;
                     iconColorClass = 'text-purple-500 bg-purple-500/10';
                     break;
                  case 'ANNOUNCEMENT':
                     Icon = Megaphone;
                     iconColorClass = 'text-amber-500 bg-amber-500/10';
                     break;
                  case 'ALERT':
                     Icon = AlertTriangle;
                     iconColorClass = 'text-destructive bg-destructive/10';
                     break;
                  case 'SECURITY':
                     Icon = ShieldCheck;
                     iconColorClass = 'text-success bg-success/10';
                     break;
               }
               
               return (
                 <div key={n.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconColorClass}`}>
                       <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-base">{n.title}</h3>
                          <span className="text-xs text-muted-foreground font-medium">
                             {new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                       </div>
                       <p className="text-muted-foreground text-sm mb-2">{n.message}</p>
                       {n.user && (
                          <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="bg-slate-100 text-[10px]">Triggered By</Badge>
                             <span className="text-xs font-semibold">{n.user.name} ({n.user.role})</span>
                          </div>
                       )}
                    </div>
                 </div>
               );
            })}
            {notifications.length === 0 && (
               <div className="p-12 text-center text-muted-foreground">No recent system logs.</div>
            )}
         </div>
      </div>
    </div>
  );
}
