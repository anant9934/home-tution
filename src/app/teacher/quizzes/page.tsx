"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { HelpCircle, Plus, Calendar, Users, Eye, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes]       = useState<any[]>([]);
  const [students, setStudents]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView]     = useState(false);
  const [selected, setSelected]     = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "", studentId: "", duration: 30, totalMarks: 100
  });

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0, marks: 10 }
  ]);

  useEffect(() => {
    Promise.all([fetchApi("/tutors/quizzes"), fetchApi("/tutors/students")])
      .then(([q, s]) => {
        setQuizzes(Array.isArray(q) ? q : []);
        setStudents(Array.isArray(s) ? s : []);
      })
      .catch(err => toast.error(err.message || "Failed to load quizzes"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) return toast.error("Select a student");
    
    // validate questions
    for (const q of questions) {
      if (!q.questionText || q.options.some(o => !o.trim())) {
        return toast.error("Please fill all questions and options");
      }
    }

    setSubmitting(true);
    try {
      // 1. Create Quiz
      const quizRes = await fetchApi("/tutors/quizzes", {
        method: "POST",
        body: JSON.stringify(form), 
      });

      // 2. Add Questions
      await fetchApi(`/tutors/quizzes/${quizRes.id}/questions`, {
        method: "POST",
        body: JSON.stringify({ questions }),
      });

      setQuizzes(prev => [{ ...quizRes, questions, attempts: [] }, ...prev]);
      setShowCreate(false);
      setForm({ title: "", studentId: "", duration: 30, totalMarks: 100 });
      setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: 0, marks: 10 }]);
      toast.success("Quiz created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 pb-20">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" /> Quizzes
          </h1>
          <p className="text-muted-foreground mt-1">Create multiple-choice quizzes to assess your students.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/90 text-sm"
        >
          <Plus className="w-4 h-4" /> Create Quiz
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b bg-slate-50">
          <h2 className="font-bold font-heading">Recent Quizzes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Title & Student</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Attempts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quizzes.map(q => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary" /> {q.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {students.find(s => s.id === q.courseId)?.name || "Assigned Student"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-slate-50">
                      {q.questions?.length || 0} Qs • {q.totalMarks} Marks
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">{q.attempts?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setSelected(q); setShowView(true); }}
                      className="text-primary text-sm font-semibold flex items-center gap-1.5 ml-auto hover:underline"
                    >
                      <Eye className="w-4 h-4" /> View Results
                    </button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No quizzes created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-7 animate-in zoom-in-95 my-auto">
            <h2 className="text-xl font-bold font-heading mb-5">📝 Create New Quiz</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-1.5">Quiz Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm" placeholder="e.g. Physics Chapter 1 Test" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-1.5">Assign To Student *</label>
                  <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm">
                    <option value="">Select student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Duration (mins) *</label>
                  <input type="number" required value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Total Marks *</label>
                  <input type="number" required value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: Number(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                </div>
              </div>

              <div className="border-t pt-4 space-y-6 max-h-[40vh] overflow-y-auto pr-2">
                <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Questions</h3>
                
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-slate-50 border rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">Q{qIndex + 1}</span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                          className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                      )}
                    </div>
                    
                    <input required value={q.questionText} onChange={e => {
                        const newQ = [...questions]; newQ[qIndex].questionText = e.target.value; setQuestions(newQ);
                      }}
                      className="w-full border rounded-lg px-3 py-2 text-sm font-medium" placeholder="Question text..." />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex}
                            onChange={() => {
                              const newQ = [...questions]; newQ[qIndex].correctAnswer = oIndex; setQuestions(newQ);
                            }}
                            className="w-4 h-4 text-primary"
                          />
                          <input required value={opt} onChange={e => {
                              const newQ = [...questions]; newQ[qIndex].options[oIndex] = e.target.value; setQuestions(newQ);
                            }}
                            className="flex-1 border rounded-lg px-3 py-1.5 text-sm" placeholder={`Option ${oIndex + 1}`} />
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mr-2">Marks for this question:</label>
                      <input type="number" value={q.marks} onChange={e => {
                          const newQ = [...questions]; newQ[qIndex].marks = Number(e.target.value); setQuestions(newQ);
                        }}
                        className="w-20 border rounded-md px-2 py-1 text-xs" />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0, marks: 10 }])}
                  className="w-full border-2 border-dashed border-primary/30 text-primary font-bold py-3 rounded-2xl hover:bg-primary/5 transition-colors text-sm">
                  + Add Another Question
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 border text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 text-sm flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Results Modal */}
      {showView && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-7 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold font-heading">Results: {selected.title}</h2>
              <button onClick={() => setShowView(false)} className="text-muted-foreground hover:text-foreground font-bold text-lg">✕</button>
            </div>
            <div className="space-y-4">
              {(selected.attempts || []).length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-2xl">No attempts yet.</div>
              ) : (
                (selected.attempts || []).map((att: any) => (
                  <div key={att.id} className="border rounded-2xl p-4 flex items-center justify-between bg-slate-50 hover:bg-white transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                        {att.student?.user?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <div className="font-bold">{att.student?.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(att.startTime).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{att.score} <span className="text-sm text-muted-foreground font-normal">/ {selected.totalMarks}</span></div>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 mt-1">Completed</Badge>
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
