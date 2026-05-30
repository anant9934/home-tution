"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { CalendarCheck, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TeacherAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await fetchApi("/tutors/attendance");
        setAttendanceRecords(data);
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
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-primary" /> Attendance Records
          </h1>
          <p className="text-muted-foreground mt-1">View and manage student attendance for past classes.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-9 rounded-full bg-white shadow-sm" />
           </div>
           <Button variant="outline" size="icon" className="rounded-full shrink-0"><Filter className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground text-xs uppercase">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Student Name</th>
                     <th className="px-6 py-4 font-semibold">Class Date</th>
                     <th className="px-6 py-4 font-semibold">Marked At</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {attendanceRecords.map(a => (
                     <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-base">{a.student.user.name}</td>
                        <td className="px-6 py-4">
                           {a.session?.booking?.scheduledAt 
                              ? new Date(a.session.booking.scheduledAt).toLocaleDateString()
                              : 'Unknown Date'}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                           {new Date(a.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-6 py-4">
                           <Badge 
                             variant="outline" 
                             className={
                                a.status === 'PRESENT' ? 'bg-success/10 text-success border-success/20' : 
                                a.status === 'ABSENT' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                                'bg-warning/10 text-warning border-warning/20'
                             }
                           >
                              {a.status}
                           </Badge>
                        </td>
                     </tr>
                  ))}
                  {attendanceRecords.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No attendance records found. You can mark attendance after completing a class.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
