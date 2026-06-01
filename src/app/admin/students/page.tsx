"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Users, Search, MoreVertical, Ban, FileText, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchApi("/admin/students");
        setStudents(data);
      } catch (err: any) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await fetchApi(`/admin/students/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setStudents(prev => prev.map(s => s.id === id ? { ...s, user: { ...s.user, status: newStatus } } : s));
      toast.success(`Student account ${newStatus.toLowerCase()} successfully.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update account status.");
    }
  };

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

  const filteredStudents = students.filter(s => 
    s.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Manage Students
          </h1>
          <p className="text-muted-foreground mt-1">View all {students.length} registered students on the platform.</p>
        </div>
        <div className="relative w-full sm:w-72">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <Input 
             placeholder="Search name or email..." 
             className="pl-9 rounded-full bg-white shadow-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Student Name & Contact</th>
                     <th className="px-6 py-4 font-semibold">Class / Board</th>
                     <th className="px-6 py-4 font-semibold">Joined At</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-base">{s.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{s.user?.email || 'No email'}</div>
                          {s.phone && <div className="text-xs text-muted-foreground">{s.phone}</div>}
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{s.class}</div>
                          <div className="text-xs text-muted-foreground">{s.board}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{new Date(s.joiningDate).toLocaleDateString()}</div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="outline" className={s.user?.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                             {s.user?.status || 'ACTIVE'}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                                <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toast.info('Full profile view coming soon!')}>
                                <FileText className="h-4 w-4" /> View Full Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className={`gap-2 cursor-pointer ${s.user?.status === 'ACTIVE' ? 'text-destructive focus:text-destructive focus:bg-destructive/10' : 'text-success focus:text-success focus:bg-success/10'}`}
                                onClick={() => handleStatusUpdate(s.id, s.user?.status || 'ACTIVE')}
                              >
                                <Ban className="h-4 w-4" /> {s.user?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No students found matching your search.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
