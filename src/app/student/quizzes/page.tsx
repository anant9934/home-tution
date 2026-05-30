"use client";

import { useState, useEffect } from "react";
import { PenTool, CheckCircle2, ChevronRight, FileText, X, Trophy, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function StudentQuizzesPage() {
  const [pendingQuizzes, setPendingQuizzes] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const data = await fetchApi("/students/quizzes");
        setPendingQuizzes(data.pending);
        setCompletedQuizzes(data.completed);
      } catch (err: any) {
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  const handleFinishQuiz = async (quizId: string) => {
    setSubmitting(true);
    try {
      const activeData = pendingQuizzes.find(q => q.id === quizId);
      // Mock score logic: Assume the student answered correctly and gets full marks.
      const totalMarks = activeData.questions.length || 10;
      
      const res = await fetchApi(`/students/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ score: totalMarks }),
      });

      setActiveQuiz(null);
      setPendingQuizzes(prev => prev.filter(q => q.id !== quizId));
      setCompletedQuizzes(prev => [{
        id: res.attempt.id,
        title: activeData.title,
        subject: activeData.subject,
        score: `${totalMarks}/${totalMarks}`,
        date: new Date().toISOString().split('T')[0]
      }, ...prev]);

      toast.success(`Quiz completed! You earned +${res.xpEarned} XP!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setQuizStep(0);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load quizzes</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const activeData = pendingQuizzes.find(q => q.id === activeQuiz);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8 relative">
      <div>
         <h1 className="text-3xl font-bold font-heading">Quizzes</h1>
         <p className="text-muted-foreground mt-1">Test your knowledge and earn XP.</p>
      </div>

      {/* QUIZ MODAL */}
      {activeQuiz && activeData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                       <PenTool className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                       <h3 className="font-bold font-heading">{activeData.title}</h3>
                       <p className="text-xs text-muted-foreground">Question {quizStep + 1} of {activeData.questions.length || 1}</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveQuiz(null)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>

              <div className="p-8">
                 {quizStep === 0 ? (
                    <>
                       <h4 className="text-xl font-bold mb-6">
                          {activeData.questions[0]?.text || "Take the quiz carefully!"}
                       </h4>
                       <div className="space-y-3">
                          {(activeData.questions[0]?.options || ["Option 1", "Option 2", "Option 3", "Option 4"]).map((ans: string, i: number) => (
                             <button
                                key={i}
                                onClick={() => setSelectedAnswer(i)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                   selectedAnswer === i ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 hover:bg-slate-50"
                                }`}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAnswer === i ? "border-primary" : "border-muted-foreground/30"}`}>
                                      {selectedAnswer === i && <div className="w-3 h-3 bg-primary rounded-full" />}
                                   </div>
                                   <span className={`font-semibold ${selectedAnswer === i ? "text-primary" : "text-foreground"}`}>{ans}</span>
                                </div>
                             </button>
                          ))}
                       </div>
                       <div className="mt-8 pt-6 border-t flex justify-end">
                          <Button disabled={selectedAnswer === null} onClick={() => setQuizStep(1)} className="rounded-full px-8 gap-2 font-bold">
                             Submit Answer <ChevronRight className="w-4 h-4" />
                          </Button>
                       </div>
                    </>
                 ) : (
                    <div className="text-center py-8">
                       <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
                          <CheckCircle2 className="w-10 h-10 text-success" />
                       </div>
                       <h4 className="text-2xl font-bold font-heading mb-2">Quiz Completed!</h4>
                       <p className="text-muted-foreground mb-8">You successfully finished all questions.</p>
                       <Button disabled={submitting} onClick={() => handleFinishQuiz(activeQuiz)} className="rounded-full px-8 font-bold w-full sm:w-auto">
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish & Earn XP"}
                       </Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="grid gap-4">
         {pendingQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all hover:shadow-md">
               <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-warning/10 text-warning`}>
                     <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-primary/20 text-primary">{quiz.subject}</Badge>
                        <span className="text-xs font-semibold text-muted-foreground">{quiz.duration} mins • {quiz.questions.length} Qs</span>
                     </div>
                     <h3 className="font-bold text-lg">{quiz.title}</h3>
                  </div>
               </div>
               
               <div className="shrink-0 w-full sm:w-auto">
                  <Button onClick={() => setActiveQuiz(quiz.id)} className="w-full rounded-xl gap-2 shadow-sm font-bold">
                     <PenTool className="w-4 h-4" /> Start Quiz
                  </Button>
               </div>
            </div>
         ))}

         {completedQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all hover:shadow-md opacity-80">
               <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-success/10 text-success`}>
                     <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-primary/20 text-primary">{quiz.subject}</Badge>
                        <span className="text-xs font-semibold text-muted-foreground">{quiz.date}</span>
                     </div>
                     <h3 className="font-bold text-lg line-through text-muted-foreground">{quiz.title}</h3>
                  </div>
               </div>
               
               <div className="shrink-0 w-full sm:w-auto">
                  <div className="flex flex-col items-end">
                     <div className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Completed</div>
                     <div className="text-xs font-semibold text-muted-foreground mt-1 border px-2 py-1 rounded-md">Score: {quiz.score}</div>
                  </div>
               </div>
            </div>
         ))}

         {pendingQuizzes.length === 0 && completedQuizzes.length === 0 && (
            <div className="bg-white rounded-3xl border shadow-sm p-12 text-center flex flex-col items-center">
               <Trophy className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
               <h3 className="text-xl font-bold font-heading">No Quizzes</h3>
               <p className="text-muted-foreground mt-1">There are no quizzes assigned to you at the moment.</p>
            </div>
         )}
      </div>
    </div>
  );
}
