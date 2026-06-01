"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { UsersRound, Search, Ban, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminParentsPage() {
  const searchParams = useSearchParams();
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState<any>(null);

  useEffect(() => {
    async function loadParents() {
      try {
        const data = await fetchApi("/admin/parents");
        setParents(data);
        
        // Auto-open modal if profileId is in URL
        const profileId = searchParams.get('profileId');
        if (profileId) {
          const parent = data.find((p: any) => p.id === profileId);
          if (parent) setSelectedParent(parent);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load parents");
      } finally {
        setLoading(false);
      }
    }
    loadParents();
  }, [searchParams]);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    // Parents don't have a direct status endpoint yet, we use the user's status endpoint from students for now or create a generic one
    // But since the student status endpoint uses studentId and looks up userId... wait, let's just make it optimistic here, 
    // or better yet, we can create a generic user status update if we need to.
    // For now we'll pretend it works or just use a generic endpoint if we had one.
    toast.info("Status update for parents coming soon.");
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

  const filteredParents = parents.filter(p => 
    (p.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (p.user?.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-primary" /> Manage Parents
          </h1>
          <p className="text-muted-foreground mt-1">View all {parents.length} registered parents on the platform.</p>
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
                     <th className="px-6 py-4 font-semibold">Parent Name & Contact</th>
                     <th className="px-6 py-4 font-semibold">Occupation</th>
                     <th className="px-6 py-4 font-semibold">Children</th>
                     <th className="px-6 py-4 font-semibold">Joined At</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {filteredParents.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-base">{p.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{p.user?.email || 'No email'}</div>
                          {p.user?.phone && <div className="text-xs text-muted-foreground">{p.user.phone}</div>}
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{p.occupation || 'N/A'}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {p.children?.length > 0 ? (
                               p.children.map((c: any) => (
                                 <Badge key={c.id} variant="secondary" className="text-[10px]">{c.user?.name || 'Unknown'}</Badge>
                               ))
                            ) : (
                               <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{new Date(p.user?.createdAt).toLocaleDateString()}</div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => setSelectedParent(p)}
                               className="text-slate-600 hover:bg-slate-100"
                             >
                               <FileText className="h-4 w-4" />
                             </Button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {filteredParents.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No parents found matching your search.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {selectedParent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedParent.user?.name?.charAt(0) || '?'}
                </div>
                {selectedParent.user?.name || 'Parent Profile'}
              </h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedParent(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="font-medium mt-1">{selectedParent.user?.email || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={selectedParent.user?.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                      {selectedParent.user?.status || 'UNKNOWN'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupation</label>
                  <div className="font-medium mt-1">{selectedParent.occupation || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined Date</label>
                  <div className="font-medium mt-1">{new Date(selectedParent.user?.createdAt).toLocaleDateString()}</div>
                </div>
                
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</label>
                  <div className="font-medium mt-1">{selectedParent.address || 'Not Provided'}</div>
                </div>

                <div className="col-span-2 border-t pt-4 mt-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Linked Children</label>
                  <div className="space-y-2">
                     {selectedParent.children?.length > 0 ? (
                        selectedParent.children.map((c: any) => (
                           <a 
                             key={c.id}
                             href={`/admin/students?profileId=${c.id}`}
                             className="flex items-center gap-3 p-2 rounded-xl border bg-slate-50 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                           >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                 {c.user?.name?.charAt(0) || '?'}
                              </div>
                              <div className="flex-1">
                                 <div className="text-sm font-bold">{c.user?.name || 'Unknown'}</div>
                                 <div className="text-[10px] text-muted-foreground">{c.class} • {c.board}</div>
                              </div>
                              <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View Profile →</span>
                           </a>
                        ))
                     ) : (
                        <div className="text-sm text-muted-foreground">No children linked to this parent yet.</div>
                     )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <Button onClick={() => setSelectedParent(null)} className="font-bold rounded-full">
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
