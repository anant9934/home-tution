"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Users, Search, MoreVertical, Ban, FileText, CheckCircle2, X } from "lucide-react";
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
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchApi("/admin/students");
        setStudents(data);
        
        // Auto-open modal if profileId is in URL
        const profileId = searchParams.get('profileId');
        if (profileId) {
          const student = data.find((s: any) => s.id === profileId);
          if (student) setSelectedStudent(student);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [searchParams]);

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
    (s.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (s.user?.email?.toLowerCase() || "").includes(search.toLowerCase())
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
                          <div className="flex justify-end gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => setSelectedStudent(s)}
                               className="text-slate-600 hover:bg-slate-100"
                             >
                               <FileText className="h-4 w-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => handleStatusUpdate(s.id, s.user?.status || 'ACTIVE')}
                               className={`gap-1.5 ${s.user?.status === 'ACTIVE' ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : 'text-success hover:bg-success/10 hover:text-success'}`}
                             >
                               <Ban className="h-4 w-4" />
                               {s.user?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                             </Button>
                          </div>
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

      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedStudent.user?.name?.charAt(0) || '?'}
                </div>
                {selectedStudent.user?.name || 'Student Profile'}
              </h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedStudent(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="font-medium mt-1">{selectedStudent.user?.email || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={selectedStudent.user?.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                      {selectedStudent.user?.status || 'UNKNOWN'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class / Grade</label>
                  <div className="font-medium mt-1">{selectedStudent.class || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Board</label>
                  <div className="font-medium mt-1">{selectedStudent.board || 'N/A'}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">School Name</label>
                  <div className="font-medium mt-1">{selectedStudent.schoolName || 'Not Provided'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined Date</label>
                  <div className="font-medium mt-1">{new Date(selectedStudent.joiningDate).toLocaleDateString()}</div>
                </div>
                
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</label>
                  <div className="font-medium mt-1">{selectedStudent.address || 'Not Provided'}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <Button onClick={() => setSelectedStudent(null)} className="font-bold rounded-full">
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
