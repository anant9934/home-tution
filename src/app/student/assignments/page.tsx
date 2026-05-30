"use client";

import { useState, useEffect } from "react";
import { ClipboardList, CheckCircle2, Upload, File, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">("pending");
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [submittedItems, setSubmittedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await fetchApi("/students/assignments");
        setPendingItems(data.pending);
        setSubmittedItems(data.submitted);
      } catch (err: any) {
        setError(err.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, []);

  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     if (!file) return;

     setUploading(id);
     try {
        const formData = new FormData();
        formData.append('file', file);

        let token = null;
        const match = document.cookie.match(/(^| )token=([^;]+)/);
        if (match) token = match[2];

        // 1. Upload to Cloudinary via Backend
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/uploads`, {
          method: "POST",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "File upload failed");

        // 2. Submit Assignment with Cloudinary URL
        await fetchApi(`/students/assignments/${id}/submit`, {
          method: "POST",
          body: JSON.stringify({ submissionUrl: uploadData.url })
        });
        
        const assignment = pendingItems.find(a => a.id === id);
        if (assignment) {
          setPendingItems(prev => prev.filter(a => a.id !== id));
          setSubmittedItems(prev => [{
            id: `sub-${id}`,
            title: assignment.title,
            subject: assignment.subject,
            submittedAt: new Date().toISOString().split('T')[0],
            score: 'Pending Grading',
            status: 'Submitted'
          }, ...prev]);
          toast.success("Assignment submitted successfully! +50 XP");
        }
     } catch (err: any) {
        toast.error(err.message || "Failed to submit assignment");
     } finally {
        setUploading(null);
     }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load assignments</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const itemsToShow = activeTab === "pending" ? pendingItems : submittedItems;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold font-heading">Assignments</h1>
            <p className="text-muted-foreground mt-1">Manage your coursework and submissions.</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-muted rounded-xl w-fit">
         <button 
            onClick={() => setActiveTab("pending")} 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "pending" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
         >
            Pending
         </button>
         <button 
            onClick={() => setActiveTab("submitted")} 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "submitted" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
         >
            Submitted
         </button>
      </div>

      <div className="space-y-4">
         {itemsToShow.length === 0 ? (
            <div className="bg-white rounded-3xl border shadow-sm p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold font-heading">All Caught Up!</h3>
               <p className="text-muted-foreground mt-1 max-w-sm">You have no {activeTab} assignments. Take a break!</p>
            </div>
         ) : (
            itemsToShow.map(assignment => (
               <div key={assignment.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all hover:shadow-md">
                  <div className="flex gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'submitted' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {activeTab === "submitted" ? <CheckCircle2 className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="outline" className="border-primary/20 text-primary">{assignment.subject}</Badge>
                        </div>
                        <h3 className="font-bold text-lg">{assignment.title}</h3>
                        <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mt-1">
                           <Clock className="w-3.5 h-3.5" /> 
                           {activeTab === "pending" ? `Due: ${assignment.dueDate}` : `Submitted: ${assignment.submittedAt}`}
                        </div>
                     </div>
                  </div>
                  
                  <div className="shrink-0 w-full sm:w-auto">
                     {activeTab === "submitted" ? (
                        <div className="flex flex-col items-end">
                           <div className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Submitted</div>
                           {assignment.score && <div className="text-xs font-semibold text-muted-foreground mt-1 border px-2 py-1 rounded-md">Score: {assignment.score}</div>}
                        </div>
                     ) : (
                        <div className="relative w-full sm:w-auto">
                           <label htmlFor={`file-upload-${assignment.id}`} className="w-full">
                              <input 
                                 type="file" 
                                 id={`file-upload-${assignment.id}`} 
                                 className="hidden" 
                                 onChange={(e) => handleFileUpload(assignment.id, e)}
                                 disabled={uploading === assignment.id}
                                 accept=".pdf,.png,.jpg,.mp4"
                              />
                              <Button 
                                 type="button"
                                 disabled={uploading === assignment.id}
                                 className={`w-full rounded-xl gap-2 shadow-sm font-bold pointer-events-none ${uploading === assignment.id ? 'opacity-70' : ''}`}
                              >
                                 {uploading === assignment.id ? (
                                    <span className="flex items-center gap-2 animate-pulse"><File className="w-4 h-4" /> Uploading...</span>
                                 ) : (
                                    <><Upload className="w-4 h-4" /> Upload & Submit</>
                                 )}
                              </Button>
                           </label>
                        </div>
                     )}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
