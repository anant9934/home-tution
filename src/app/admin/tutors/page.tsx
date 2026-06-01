"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Search, MoreVertical, CheckCircle, XCircle, ShieldAlert, FileText, X } from "lucide-react";
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

export default function AdminTutorsPage() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  useEffect(() => {
    loadTutors();
  }, [searchParams]);

  async function loadTutors() {
    try {
      const data = await fetchApi("/admin/tutors");
      setTutors(data);
      
      // Auto-open modal if profileId is in URL
      const profileId = searchParams.get('profileId');
      if (profileId) {
        const tutor = data.find((t: any) => t.id === profileId);
        if (tutor) setSelectedTutor(tutor);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load tutors");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fetchApi(`/admin/tutors/${id}/${action}`, { method: 'PATCH' });
      toast.success(`Tutor ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      loadTutors(); // Reload the list
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} tutor`);
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

  const filteredTutors = tutors.filter(t => 
    (t.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (t.user?.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" /> Manage Tutors
          </h1>
          <p className="text-muted-foreground mt-1">Approve registrations and manage {tutors.length} tutor accounts.</p>
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
                     <th className="px-6 py-4 font-semibold">Tutor Details</th>
                     <th className="px-6 py-4 font-semibold">Qualifications</th>
                     <th className="px-6 py-4 font-semibold">Hourly Rate</th>
                     <th className="px-6 py-4 font-semibold">Verification</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {filteredTutors.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-base flex items-center gap-1.5">
                             {t.user?.name || 'Unknown'} 
                             {t.isVerified && <CheckCircle className="w-3.5 h-3.5 text-success" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.user?.email || 'No email'}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium truncate max-w-[150px]">{t.qualification || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{t.experienceYears || 0} Years Exp.</div>
                       </td>
                       <td className="px-6 py-4 font-semibold">
                          ₹{t.hourlyRate || 0}
                       </td>
                       <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={
                              t.verificationStatus === 'VERIFIED' ? 'bg-success/10 text-success border-success/20' : 
                              t.verificationStatus === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                              'bg-destructive/10 text-destructive border-destructive/20'
                            }
                          >
                             {t.verificationStatus}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => setSelectedTutor(t)}
                                 className="text-slate-600 hover:bg-slate-100"
                               >
                                 <FileText className="h-4 w-4" />
                               </Button>
                              {t.verificationStatus !== 'VERIFIED' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-success hover:text-success hover:bg-success/10 gap-1.5"
                                  onClick={() => handleStatusUpdate(t.id, 'approve')}
                                >
                                  <CheckCircle className="h-4 w-4" /> Approve
                                </Button>
                              )}
                              
                              {t.verificationStatus !== 'REJECTED' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                                  onClick={() => handleStatusUpdate(t.id, 'reject')}
                                >
                                  <XCircle className="h-4 w-4" /> Reject
                                </Button>
                              )}
                          </div>
                       </td>
                    </tr>
                  ))}
                  {filteredTutors.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No tutors found matching your search.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {selectedTutor && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b flex items-center justify-between bg-slate-50">
               <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                   {selectedTutor.user?.name?.charAt(0) || '?'}
                 </div>
                 {selectedTutor.user?.name || 'Tutor Profile'}
               </h3>
               <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedTutor(null)}>
                 <X className="w-5 h-5" />
               </Button>
             </div>
             
             <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <div className="font-medium mt-1">{selectedTutor.user?.email || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verification Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={selectedTutor.verificationStatus === 'VERIFIED' ? 'bg-success/10 text-success border-success/20' : selectedTutor.verificationStatus === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {selectedTutor.verificationStatus || 'UNKNOWN'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qualifications</label>
                    <div className="font-medium mt-1">{selectedTutor.qualification || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience</label>
                    <div className="font-medium mt-1">{selectedTutor.experienceYears || 0} Years</div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hourly Rate</label>
                    <div className="font-medium mt-1">₹{selectedTutor.hourlyRate || 0} / hr</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teaching Mode</label>
                    <div className="font-medium mt-1">{selectedTutor.teachingMode || 'N/A'}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subjects</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTutor.subjects?.length > 0 ? selectedTutor.subjects.map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      )) : <span className="text-sm text-muted-foreground">None listed</span>}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio / Description</label>
                    <div className="font-medium mt-1 text-sm text-slate-700">{selectedTutor.bio || 'No bio provided'}</div>
                  </div>

                  {/* Assigned Students */}
                  <div className="col-span-2 border-t pt-4">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Assigned Students ({selectedTutor.studentsAssigned?.length || 0})
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedTutor.studentsAssigned?.length > 0 ? (
                        selectedTutor.studentsAssigned.map((s: any) => (
                          <a
                            key={s.id}
                            href={`/admin/students?profileId=${s.id}`}
                            className="flex items-center gap-3 p-2 rounded-xl border bg-slate-50 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {s.user?.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold">{s.user?.name || 'Unknown'}</div>
                              <div className="text-[10px] text-muted-foreground">{s.user?.email} • {s.class} {s.board}</div>
                            </div>
                            <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                          </a>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground p-3 rounded-xl border bg-slate-50">No students assigned yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
             
             <div className="p-4 bg-slate-50 border-t flex justify-end">
               <Button onClick={() => setSelectedTutor(null)} className="font-bold rounded-full">
                 Close Profile
               </Button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
