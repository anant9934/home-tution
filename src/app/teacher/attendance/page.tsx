"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { CalendarCheck, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TeacherAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ bookingId: '', status: 'PRESENT' });

  useEffect(() => {
    async function loadData() {
      try {
        const [attData, classesData] = await Promise.all([
          fetchApi("/tutors/attendance"),
          fetchApi("/tutors/classes")
        ]);
        setAttendanceRecords(attData);
        setClasses(classesData.filter((c: any) => c.status === 'CONFIRMED'));
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookingId) return toast.error("Please select a class");
    
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/attendance", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      
      // Reload records to get the fully populated relations
      const updatedRecords = await fetchApi("/tutors/attendance");
      setAttendanceRecords(updatedRecords);
      
      setIsModalOpen(false);
      toast.success("Attendance marked successfully! +20 XP awarded if present.");
    } catch (err: any) {
      toast.error(err.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

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
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
           <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-9 rounded-full bg-white shadow-sm" />
           </div>
           
           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
             <DialogTrigger asChild>
               <Button className="rounded-full shadow-sm gap-2 whitespace-nowrap">
                 <Plus className="w-4 h-4" /> Mark Attendance
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                 <DialogTitle>Mark Student Attendance</DialogTitle>
               </DialogHeader>
               <form onSubmit={handleMarkAttendance} className="space-y-4 mt-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Select Class / Student</label>
                   <select 
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                     value={formData.bookingId}
                     onChange={e => setFormData({...formData, bookingId: e.target.value})}
                     required
                   >
                     <option value="">Select a confirmed class...</option>
                     {classes.map(c => (
                       <option key={c.id} value={c.id}>
                         {c.student} - {new Date(c.scheduledAt).toLocaleString()}
                       </option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Status</label>
                   <div className="grid grid-cols-3 gap-2">
                     <button
                       type="button"
                       onClick={() => setFormData({...formData, status: 'PRESENT'})}
                       className={`py-2 text-sm rounded-lg font-bold border-2 transition-all ${
                         formData.status === 'PRESENT' ? 'bg-success/10 border-success text-success' : 'border-slate-100 hover:border-success/50'
                       }`}
                     >
                       Present
                     </button>
                     <button
                       type="button"
                       onClick={() => setFormData({...formData, status: 'ABSENT'})}
                       className={`py-2 text-sm rounded-lg font-bold border-2 transition-all ${
                         formData.status === 'ABSENT' ? 'bg-destructive/10 border-destructive text-destructive' : 'border-slate-100 hover:border-destructive/50'
                       }`}
                     >
                       Absent
                     </button>
                     <button
                       type="button"
                       onClick={() => setFormData({...formData, status: 'LATE'})}
                       className={`py-2 text-sm rounded-lg font-bold border-2 transition-all ${
                         formData.status === 'LATE' ? 'bg-warning/10 border-warning text-warning' : 'border-slate-100 hover:border-warning/50'
                       }`}
                     >
                       Late
                     </button>
                   </div>
                 </div>
                 <Button type="submit" className="w-full mt-2" disabled={submitting}>
                   {submitting ? "Saving..." : "Save Record"}
                 </Button>
               </form>
             </DialogContent>
           </Dialog>
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
