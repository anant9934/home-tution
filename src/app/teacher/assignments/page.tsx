"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { ClipboardList, Plus, FileText, Calendar, Users, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ title: '', description: '', courseId: '', deadline: '', maxMarks: 100 });
  const [grading, setGrading] = useState<{[key: string]: { marks: string, feedback: string }}>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [assignData, coursesData] = await Promise.all([
          fetchApi("/tutors/assignments"),
          fetchApi("/courses/mine")
        ]);
        setAssignments(assignData);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setFormData(prev => ({ ...prev, courseId: coursesData[0].id }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/assignments", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setAssignments(prev => [res, ...prev]);
      setIsCreateOpen(false);
      toast.success("Assignment created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (submissionId: string) => {
    const gradeData = grading[submissionId];
    if (!gradeData?.marks) return toast.error("Please enter marks");
    
    try {
      await fetchApi(`/tutors/submissions/${submissionId}/grade`, {
        method: "PATCH",
        body: JSON.stringify({ marks: gradeData.marks, feedback: gradeData.feedback || "" })
      });
      
      // Update local state
      setSelectedAssignment((prev: any) => ({
        ...prev,
        submissions: prev.submissions.map((s: any) => 
          s.id === submissionId ? { ...s, marks: Number(gradeData.marks), feedback: gradeData.feedback } : s
        )
      }));
      toast.success("Grade saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to grade submission");
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
            <ClipboardList className="w-8 h-8 text-primary" /> Assignments
          </h1>
          <p className="text-muted-foreground mt-1">Manage homework, track submissions, and grade assignments.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button className="rounded-full shadow-sm gap-2">
              <Plus className="w-4 h-4" /> Create Assignment
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Algebra Worksheet" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.courseId} 
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                  required
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Instructions..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Marks</label>
                  <Input type="number" required value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: parseInt(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={submitting}>
                {submitting ? "Creating..." : "Create Assignment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                             <div className="text-xs text-muted-foreground mt-1">{a.course?.title || "General"}</div>
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
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="font-semibold text-primary hover:text-primary"
                                onClick={() => {
                                  setSelectedAssignment(a);
                                  setIsViewOpen(true);
                                }}
                             >
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Submissions: {selectedAssignment?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedAssignment?.submissions?.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground bg-slate-50 rounded-2xl">
                No submissions received yet.
              </div>
            ) : (
              selectedAssignment?.submissions?.map((sub: any) => (
                <div key={sub.id} className="border rounded-2xl p-4 bg-white flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                        {sub.student.user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{sub.student.user.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border flex items-center justify-between">
                       <span className="text-sm font-medium">Homework File</span>
                       <a href={sub.submissionUrl} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" variant="outline">Download</Button>
                       </a>
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 p-4 rounded-xl border">
                    {sub.marks ? (
                      <div className="h-full flex flex-col justify-center items-center text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                        <div>
                          <div className="text-2xl font-bold text-success">{sub.marks} / {selectedAssignment.maxMarks}</div>
                          <div className="text-sm text-muted-foreground mt-1">"{sub.feedback}"</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h5 className="text-sm font-bold">Grade Submission</h5>
                        <Input 
                          type="number" 
                          placeholder={`Marks (out of ${selectedAssignment.maxMarks})`} 
                          onChange={e => setGrading({...grading, [sub.id]: { ...grading[sub.id], marks: e.target.value }})}
                        />
                        <Textarea 
                          placeholder="Feedback comments..." 
                          className="h-20"
                          onChange={e => setGrading({...grading, [sub.id]: { ...grading[sub.id], feedback: e.target.value }})}
                        />
                        <Button className="w-full" onClick={() => handleGrade(sub.id)}>Submit Grade</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

