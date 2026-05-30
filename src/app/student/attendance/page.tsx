"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

export default function StudentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const res = await fetchApi("/students/attendance");
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load attendance</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const { stats, records } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      <div>
         <h1 className="text-3xl font-bold font-heading">Attendance</h1>
         <p className="text-muted-foreground mt-1">Track your class presence and upcoming schedules.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="rounded-3xl border shadow-sm border-success/20 bg-success/5">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-success/20 text-success flex items-center justify-center">
                     <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">Attendance Rate</h3>
               </div>
               <div className="text-4xl font-bold font-heading text-success">{stats.percentage}%</div>
               <p className="text-xs text-muted-foreground mt-2">{stats.percentage >= 80 ? 'Excellent standing' : 'Needs improvement'}</p>
            </CardContent>
         </Card>
         
         <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
               <h3 className="font-semibold text-muted-foreground mb-2">Classes Attended</h3>
               <div className="text-3xl font-bold font-heading">{stats.presentDays} <span className="text-lg text-muted-foreground font-normal">/ {stats.totalDays}</span></div>
               <p className="text-xs text-muted-foreground mt-2">Overall total</p>
            </CardContent>
         </Card>
         
         <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
               <h3 className="font-semibold text-muted-foreground mb-2">Absences</h3>
               <div className="text-3xl font-bold font-heading text-destructive">{stats.absentDays}</div>
               <p className="text-xs text-muted-foreground mt-2">Total missed classes</p>
            </CardContent>
         </Card>
      </div>

      {/* Recent Records List */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
         <h3 className="font-bold font-heading mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Recent Records
         </h3>
         
         {records.length === 0 ? (
           <div className="text-center py-10">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No attendance records found.</p>
           </div>
         ) : (
           <div className="space-y-4">
              {records.map((record: any) => (
                 <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex gap-4">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.status === 'PRESENT' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                          {record.status === "PRESENT" ? <CalendarCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                       </div>
                       <div>
                          <h4 className="font-bold capitalize">{record.subject.replace('_', ' ').toLowerCase()}</h4>
                          <div className="text-sm text-muted-foreground mt-0.5">{record.date} • {record.teacher}</div>
                       </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                       <Badge className={record.status === 'PRESENT' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}>{record.status}</Badge>
                    </div>
                 </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
