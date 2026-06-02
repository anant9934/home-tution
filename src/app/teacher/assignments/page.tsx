"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { ClipboardList, Plus, FileText, Calendar, Users, Eye, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showCreate, setShowCreate]   = useState(false);
  const [showView, setShowView]       = useState(false);
  const [selected, setSelected]       = useState<any>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [grading, setGrading]         = useState<Record<string, { marks: string; feedback: string }>>({});

  const [form, setForm] = useState({
    title: "", description: "", studentId: "", deadline: "", maxMarks: 100
  });

  useEffect(() => {
    Promise.all([fetchApi("/tutors/assignments"), fetchApi("/tutors/students")])
      .then(([a, s]) => {
        setAssignments(Array.isArray(a) ? a : []);
        setStudents(Array.isArray(s) ? s : []);
      })
      .catch(err => toast.error(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/assignments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setAssignments(prev => [res, ...prev]);
      setShowCreate(false);
      setForm({ title: "", description: "", studentId: "", deadline: "", maxMarks: 100 });
      toast.success("Assignment created!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (submissionId: string) => {
    const g = grading[submissionId];
    if (!g?.marks) return toast.error("Enter marks first");
    try {
      await fetchApi(`/tutors/submissions/${submissionId}/grade`, {
        method: "PATCH",
        body: JSON.stringify({ marks: g.marks, feedback: g.feedback || "" }),
      });
      setSelected((prev: any) => ({
        ...prev,
        submissions: prev.submissions.map((s: any) =>
          s.id === submissionId ? { ...s, marks: Number(g.marks), feedback: g.feedback } : s
        ),
      }));
      toast.success("Grade saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to grade");
    }
  };

  if (loading) return (
    <div className="space-y-6 pb-20">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary" /> Assignments
          </h1>
          <p className="text-muted-foreground mt-1">Create homework, track submissions and grade your students.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/90 text-sm"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b bg-slate-50">
          <h2 className="font-bold font-heading">All Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assignments.map(a => {
                const pastDue = new Date(a.deadline) < new Date();
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {a.course?.title || "Direct Assignment"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium flex items-center gap-1.5 ${pastDue ? "text-destructive" : ""}`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(a.deadline).toLocaleDateString("en-IN")}
                      </div>
                      {pastDue && <div className="text-[10px] text-destructive font-bold uppercase mt-0.5">Past Due</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold">{a.submissions?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={pastDue ? "text-slate-500 bg-slate-50" : "text-green-700 bg-green-50 border-green-200"}>
                        {pastDue ? "Closed" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelected(a); setShowView(true); }}
                        className="text-primary text-sm font-semibold flex items-center gap-1.5 ml-auto hover:underline"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {assignments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No assignments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 animate-in zoom-in-95">
            <h2 className="text-xl font-bold font-heading mb-5">📋 Create Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Chapter 5 Worksheet"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Description / Instructions *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Solve questions 1–20 from the textbook..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Assign To (Student) *</label>
                <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Deadline *</label>
                  <input type="date" required value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 border text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {showView && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-7 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold font-heading">Submissions: {selected.title}</h2>
              <button onClick={() => setShowView(false)} className="text-muted-foreground hover:text-foreground font-bold text-lg">✕</button>
            </div>
            <div className="space-y-4">
              {(selected.submissions || []).length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-2xl">No submissions yet.</div>
              ) : (
                (selected.submissions || []).map((sub: any) => (
                  <div key={sub.id} className="border rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                          {sub.student?.user?.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{sub.student?.user?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(sub.submittedAt).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                      {sub.submissionUrl && (
                        <a href={sub.submissionUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5">
                          📎 Download Submission
                        </a>
                      )}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      {sub.marks ? (
                        <div className="text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-green-600">{sub.marks} / {selected.maxMarks}</div>
                          {sub.feedback && <div className="text-xs text-muted-foreground mt-1">"{sub.feedback}"</div>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs font-bold mb-2">Grade</div>
                          <input type="number" placeholder={`Marks / ${selected.maxMarks}`}
                            onChange={e => setGrading({ ...grading, [sub.id]: { ...grading[sub.id], marks: e.target.value } })}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          />
                          <textarea placeholder="Feedback..." rows={2}
                            onChange={e => setGrading({ ...grading, [sub.id]: { ...grading[sub.id], feedback: e.target.value } })}
                            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                          />
                          <button onClick={() => handleGrade(sub.id)}
                            className="w-full bg-primary text-white font-bold py-2 rounded-lg text-sm">
                            Save Grade
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
