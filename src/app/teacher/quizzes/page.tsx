"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PenTool, Plus, Calendar, Clock, BarChart, Settings, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [quizForm, setQuizForm] = useState({ title: '', courseId: '', duration: 30, totalMarks: 100 });
  const [questionsForm, setQuestionsForm] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [quizData, coursesData] = await Promise.all([
          fetchApi("/tutors/quizzes"),
          fetchApi("/courses/mine")
        ]);
        setQuizzes(quizData);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setQuizForm(prev => ({ ...prev, courseId: coursesData[0].id }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/quizzes", {
        method: "POST",
        body: JSON.stringify(quizForm)
      });
      // Ensure we add the arrays so the UI doesn't crash on length checks
      res.questions = [];
      res.attempts = [];
      setQuizzes(prev => [res, ...prev]);
      setIsCreateOpen(false);
      toast.success("Quiz created successfully! Now add some questions.");
    } catch (err: any) {
      toast.error(err.message || "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const openQuestionsModal = (quiz: any) => {
    setSelectedQuiz(quiz);
    if (quiz.questions && quiz.questions.length > 0) {
      setQuestionsForm(quiz.questions);
    } else {
      setQuestionsForm([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 10 }]);
    }
    setIsQuestionsOpen(true);
  };

  const handleSaveQuestions = async () => {
    setSubmitting(true);
    try {
      await fetchApi(`/tutors/quizzes/${selectedQuiz.id}/questions`, {
        method: "POST",
        body: JSON.stringify({ questions: questionsForm })
      });
      setQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, questions: questionsForm } : q));
      setIsQuestionsOpen(false);
      toast.success("Questions saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save questions");
    } finally {
      setSubmitting(false);
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
            <PenTool className="w-8 h-8 text-primary" /> Quizzes & Tests
          </h1>
          <p className="text-muted-foreground mt-1">Create multiple-choice quizzes, assess performance automatically.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button className="rounded-full shadow-sm gap-2">
              <Plus className="w-4 h-4" /> Create New Quiz
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuiz} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} placeholder="e.g. Chapter 1 Test" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={quizForm.courseId} 
                  onChange={e => setQuizForm({...quizForm, courseId: e.target.value})}
                  required
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (mins)</label>
                  <Input type="number" required value={quizForm.duration} onChange={e => setQuizForm({...quizForm, duration: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Marks</label>
                  <Input type="number" required value={quizForm.totalMarks} onChange={e => setQuizForm({...quizForm, totalMarks: parseInt(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={submitting}>
                {submitting ? "Creating..." : "Create Quiz"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {quizzes.map(q => (
            <div key={q.id} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
               {/* Decorative background accent */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="space-y-1">
                     <Badge variant="secondary" className="bg-slate-100 text-xs mb-2 block w-fit">{q.course?.title || 'General'}</Badge>
                     <h3 className="font-bold text-lg font-heading leading-tight">{q.title}</h3>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 my-6 relative z-10">
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</div>
                     <div className="text-sm font-semibold">{q.startTime ? new Date(q.startTime).toLocaleDateString() : 'Draft'}</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</div>
                     <div className="text-sm font-semibold">{q.duration} mins</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5" /> Marks</div>
                     <div className="text-sm font-semibold">{q.totalMarks} Total</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Questions</div>
                     <div className="text-sm font-semibold text-primary underline cursor-pointer" onClick={() => openQuestionsModal(q)}>{q.questions?.length || 0} Qs (Edit)</div>
                  </div>
               </div>
               
               <div className="mt-auto pt-4 border-t flex items-center justify-between relative z-10">
                  <div className="text-sm font-semibold text-primary">{q.attempts?.length || 0} Attempts</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl font-bold"
                    onClick={() => {
                      setSelectedQuiz(q);
                      setIsResultsOpen(true);
                    }}
                  >
                    View Results
                  </Button>
               </div>
            </div>
         ))}
         
         {quizzes.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
               <PenTool className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <h3 className="text-lg font-bold">No Quizzes Yet</h3>
               <p className="text-muted-foreground max-w-sm mx-auto mb-6">You haven't created any quizzes for your students. Create one to test their knowledge!</p>
               <Button className="rounded-full shadow-sm gap-2" onClick={() => setIsCreateOpen(true)}>
                 <Plus className="w-4 h-4" /> Create New Quiz
               </Button>
            </div>
         )}
      </div>

      {/* MANAGE QUESTIONS MODAL */}
      <Dialog open={isQuestionsOpen} onOpenChange={setIsQuestionsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex justify-between items-center pr-4">
              <span>Manage Questions: {selectedQuiz?.title}</span>
              <Button size="sm" onClick={() => setQuestionsForm([...questionsForm, { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 10 }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {questionsForm.map((q, idx) => (
              <div key={idx} className="border rounded-2xl p-4 bg-slate-50 relative">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute -top-3 -right-3 h-8 w-8 rounded-full p-0"
                  onClick={() => setQuestionsForm(questionsForm.filter((_, i) => i !== idx))}
                >
                  &times;
                </Button>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Question {idx + 1}</label>
                    <Input 
                      required 
                      value={q.questionText} 
                      onChange={e => {
                        const newQ = [...questionsForm];
                        newQ[idx].questionText = e.target.value;
                        setQuestionsForm(newQ);
                      }} 
                      placeholder="e.g. What is the powerhouse of the cell?" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {q.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Option {String.fromCharCode(65 + optIdx)}</label>
                        <Input 
                          value={opt}
                          onChange={e => {
                            const newQ = [...questionsForm];
                            newQ[idx].options[optIdx] = e.target.value;
                            setQuestionsForm(newQ);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-success">Correct Answer</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                        value={q.correctAnswer} 
                        onChange={e => {
                          const newQ = [...questionsForm];
                          newQ[idx].correctAnswer = e.target.value;
                          setQuestionsForm(newQ);
                        }}
                        required
                      >
                        <option value="">Select Correct Option...</option>
                        {q.options.map((opt: string, optIdx: number) => (
                          <option key={optIdx} value={opt} disabled={!opt}>{opt || `Option ${optIdx + 1} (Empty)`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Marks for this Q</label>
                      <Input 
                        type="number" 
                        value={q.marks} 
                        onChange={e => {
                          const newQ = [...questionsForm];
                          newQ[idx].marks = parseInt(e.target.value);
                          setQuestionsForm(newQ);
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {questionsForm.length > 0 && (
              <Button className="w-full" size="lg" onClick={handleSaveQuestions} disabled={submitting}>
                {submitting ? "Saving..." : "Save All Questions"}
              </Button>
            )}
            {questionsForm.length === 0 && (
               <div className="text-center p-8 text-muted-foreground bg-slate-100 rounded-2xl">
                 Click "Add Question" to start building your quiz.
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* VIEW RESULTS MODAL */}
      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Results: {selectedQuiz?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedQuiz?.attempts?.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground bg-slate-50 rounded-2xl">
                No students have attempted this quiz yet.
              </div>
            ) : (
              selectedQuiz?.attempts?.map((attempt: any) => (
                <div key={attempt.id} className="border rounded-2xl p-4 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                      {attempt.student.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{attempt.student.user.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-success">{attempt.score}</div>
                    <div className="text-xs text-muted-foreground">out of {selectedQuiz.totalMarks}</div>
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
