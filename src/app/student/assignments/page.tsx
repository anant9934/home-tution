"use client";

import { useState } from "react";
import { ClipboardList, CheckCircle2, Upload, File, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const assignments = [
  { id: 1, title: "Calculus Problem Set 4", subject: "Mathematics", due: "Tomorrow, 11:59 PM", status: "pending", type: "Upload" },
  { id: 2, title: "Physics Lab Report", subject: "Physics", due: "In 3 days", status: "pending", type: "Upload" },
  { id: 3, title: "Literature Essay Outline", subject: "English", due: "Past Due", status: "late", type: "Upload" },
  { id: 4, title: "Trigonometry Basics", subject: "Mathematics", due: "Last Week", status: "submitted", score: "9/10" },
];

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">("pending");
  const [items, setItems] = useState(assignments);
  const [uploading, setUploading] = useState<number | null>(null);

  const handleSubmit = (id: number) => {
     setUploading(id);
     setTimeout(() => {
        setItems(items.map(item => item.id === id ? { ...item, status: "submitted" } : item));
        setUploading(null);
     }, 1500);
  };

  const filtered = items.filter(a => activeTab === "pending" ? ["pending", "late"].includes(a.status) : a.status === "submitted");

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
         {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border shadow-sm p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold font-heading">All Caught Up!</h3>
               <p className="text-muted-foreground mt-1 max-w-sm">You have no pending assignments in this category. Take a break!</p>
            </div>
         ) : (
            filtered.map(assignment => (
               <div key={assignment.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all hover:shadow-md">
                  <div className="flex gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${assignment.status === 'submitted' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {assignment.status === "submitted" ? <CheckCircle2 className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="outline" className={assignment.subject === 'Mathematics' ? 'border-blue-200 text-blue-600' : 'border-purple-200 text-purple-600'}>{assignment.subject}</Badge>
                           {assignment.status === "late" && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20">Late</Badge>}
                        </div>
                        <h3 className="font-bold text-lg">{assignment.title}</h3>
                        <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground mt-1">
                           <Clock className="w-3.5 h-3.5" /> Due: {assignment.due}
                        </div>
                     </div>
                  </div>
                  
                  <div className="shrink-0 w-full sm:w-auto">
                     {assignment.status === "submitted" ? (
                        <div className="flex flex-col items-end">
                           <div className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Submitted</div>
                           {assignment.score && <div className="text-xs font-semibold text-muted-foreground mt-1 border px-2 py-1 rounded-md">Score: {assignment.score}</div>}
                        </div>
                     ) : (
                        <Button 
                           onClick={() => handleSubmit(assignment.id)} 
                           disabled={uploading === assignment.id}
                           className="w-full rounded-xl gap-2 shadow-sm font-bold"
                        >
                           {uploading === assignment.id ? (
                              <span className="flex items-center gap-2 animate-pulse"><File className="w-4 h-4" /> Uploading...</span>
                           ) : (
                              <><Upload className="w-4 h-4" /> Submit Work</>
                           )}
                        </Button>
                     )}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
