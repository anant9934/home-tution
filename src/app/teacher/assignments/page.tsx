"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { ClipboardList, Plus, FileText, Calendar, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await fetchApi("/tutors/assignments");
        setAssignments(data);
      } catch (err: any) {
        setError(err.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
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
            <ClipboardList className="w-8 h-8 text-primary" /> Assignments
          </h1>
          <p className="text-muted-foreground mt-1">Manage homework, track submissions, and grade assignments.</p>
        </div>
        <Button className="rounded-full shadow-sm gap-2">
          <Plus className="w-4 h-4" /> Create Assignment
        </Button>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="p-6 border-b bg-slate-50">
            <h2 className="font-bold font-heading text-lg">Active Assignments</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-muted-foreground uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Title & Course</th>
                     <th className="px-6 py-4 font-semibold">Deadline</th>
                     <th className="px-6 py-4 font-semibold">Stats</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {assignments.map(a => {
                     const isPastDue = new Date(a.deadline) < new Date();
                     return (
                       <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="font-bold text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> {a.title}
                             </div>
                             <div className="text-xs text-muted-foreground mt-1">{a.course.title}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className={`font-medium flex items-center gap-1.5 ${isPastDue ? 'text-destructive' : ''}`}>
                                <Calendar className="w-4 h-4" /> {new Date(a.deadline).toLocaleDateString()}
                             </div>
                             {isPastDue && <div className="text-[10px] text-destructive font-bold mt-1 uppercase tracking-wide">Past Due</div>}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold">{a.submissions?.length || 0}</span> submissions
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <Badge variant="outline" className={isPastDue ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-success/10 text-success border-success/20'}>
                                {isPastDue ? 'Closed' : 'Active'}
                             </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="sm" className="font-semibold text-primary hover:text-primary">
                                <Eye className="w-4 h-4 mr-1.5" /> View Submissions
                             </Button>
                          </td>
                       </tr>
                     );
                  })}
                  {assignments.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">You haven't created any assignments yet.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
