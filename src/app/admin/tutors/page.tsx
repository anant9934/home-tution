"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { GraduationCap, Search, MoreVertical, CheckCircle, XCircle, ShieldAlert } from "lucide-react";
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
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTutors();
  }, []);

  async function loadTutors() {
    try {
      const data = await fetchApi("/admin/tutors");
      setTutors(data);
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
    t.user.name.toLowerCase().includes(search.toLowerCase()) || 
    t.user.email.toLowerCase().includes(search.toLowerCase())
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
                             {t.user.name} 
                             {t.isVerified && <CheckCircle className="w-3.5 h-3.5 text-success" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.user.email}</div>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                                <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              {t.verificationStatus !== 'VERIFIED' && (
                                <DropdownMenuItem className="gap-2 cursor-pointer text-success" onClick={() => handleStatusUpdate(t.id, 'approve')}>
                                  <CheckCircle className="h-4 w-4" /> Approve KYC
                                </DropdownMenuItem>
                              )}
                              
                              {t.verificationStatus !== 'REJECTED' && (
                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleStatusUpdate(t.id, 'reject')}>
                                  <XCircle className="h-4 w-4" /> Reject/Suspend
                                </DropdownMenuItem>
                              )}
                              
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </div>
  );
}
