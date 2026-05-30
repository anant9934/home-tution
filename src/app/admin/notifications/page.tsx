"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Bell, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await fetchApi("/admin/notifications");
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

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
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" /> System Logs
        </h1>
        <p className="text-muted-foreground mt-1">Monitor recent platform activity and automated alerts.</p>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="divide-y">
            {notifications.map((n) => {
               const Icon = n.type === 'ALERT' ? AlertTriangle : (n.type === 'SECURITY' ? ShieldCheck : Info);
               const iconColorClass = n.type === 'ALERT' ? 'text-destructive bg-destructive/10' : 
                                     (n.type === 'SECURITY' ? 'text-success bg-success/10' : 'text-primary bg-primary/10');
               
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
