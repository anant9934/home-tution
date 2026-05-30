"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Users, Search, Mail, Phone, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchApi("/tutors/students");
        setStudents(data);
      } catch (err: any) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> My Students
          </h1>
          <p className="text-muted-foreground mt-1">Manage and view progress for {students.length} enrolled students.</p>
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <Input placeholder="Search students..." className="pl-9 rounded-full bg-white shadow-sm" />
        </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Student Name</th>
                     <th className="px-6 py-4 font-semibold">Class / Board</th>
                     <th className="px-6 py-4 font-semibold">Contact</th>
                     <th className="px-6 py-4 font-semibold">Performance</th>
                     <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-base">{s.name}</div>
                          <div className="text-xs text-muted-foreground">Joined {new Date(s.joiningDate).toLocaleDateString()}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{s.class}</div>
                          <div className="text-xs text-muted-foreground">{s.board}</div>
                       </td>
                       <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                             <Mail className="w-3 h-3" /> {s.email}
                          </div>
                          {s.phone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                               <Phone className="w-3 h-3" /> {s.phone}
                            </div>
                          )}
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-primary">{s.totalXp} XP Earned</div>
                          <div className="text-xs text-muted-foreground">{s.completedLessons} Lessons Completed</div>
                       </td>
                       <td className="px-6 py-4">
                          <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
                            View Profile <ExternalLink className="w-3 h-3" />
                          </button>
                       </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No students found.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
