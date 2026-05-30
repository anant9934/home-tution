"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Book, Calendar, Video, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await fetchApi("/tutors/classes");
        setClasses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  const upcoming = classes.filter(c => new Date(c.scheduledAt) >= new Date() || c.status === 'PENDING');
  const past = classes.filter(c => new Date(c.scheduledAt) < new Date() && c.status !== 'PENDING');

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" /> My Classes
          </h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and view class recordings.</p>
        </div>
        <Button className="rounded-full shadow-sm gap-2">
          <Plus className="w-4 h-4" /> Schedule New Class
        </Button>
      </div>

      <div className="space-y-6">
         <h2 className="text-xl font-bold font-heading flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Upcoming Classes
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(c => (
              <div key={c.id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    {c.title}
                 </div>
                 <div className="font-bold text-lg mb-1 mt-2">{c.student}</div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" /> {new Date(c.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                 </div>
                 <div className="flex items-center gap-2">
                    <Badge variant="outline" className={c.status === 'CONFIRMED' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                       {c.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">• {c.duration / 60} hour(s)</span>
                 </div>
                 <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button variant="default" size="sm" className="rounded-xl w-full gap-2 font-bold shadow-sm">
                       <Video className="w-4 h-4" /> Join Class
                    </Button>
                 </div>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-muted-foreground text-sm col-span-3">No upcoming classes.</p>}
         </div>
      </div>

      <div className="space-y-6 mt-12">
         <h2 className="text-xl font-bold font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" /> Past Classes
         </h2>
         <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground text-xs uppercase">
                  <tr>
                     <th className="px-6 py-4">Student</th>
                     <th className="px-6 py-4">Date & Time</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Recording</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {past.map(c => (
                     <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold">{c.student}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(c.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                        <td className="px-6 py-4">
                           <Badge variant="secondary" className="bg-slate-100">{c.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {c.recordingUrl ? (
                              <Button variant="link" className="text-primary p-0 h-auto font-semibold">View Video</Button>
                           ) : (
                              <span className="text-xs text-muted-foreground italic">No recording</span>
                           )}
                        </td>
                     </tr>
                  ))}
                  {past.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No past classes found.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
