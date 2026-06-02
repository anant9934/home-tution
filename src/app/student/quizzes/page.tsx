"use client";

import { useState, useEffect } from "react";
import { PenTool, CheckCircle2, ChevronRight, X, Trophy, AlertCircle, Loader2 } from "lucide-react";
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
      
      const res = await fetchApi(`/students/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });

      setActiveQuiz(null);
      setPendingQuizzes(prev => prev.filter(q => q.id !== quizId));
      setCompletedQuizzes(prev => [{
        id: res.attempt.id,
        title: activeData.title,
        subject: activeData.subject,
        score: `${res.attempt.score}/${activeData.questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0)}`,
        date: new Date().toISOString().split('T')[0]
      }, ...prev]);

      toast.success(`Quiz completed! You earned +${res.xpEarned} XP!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setQuizStep(0);
        setAnswers({});
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
  const currentQuestion = activeData?.questions?.[quizStep];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8 relative">
      <div>
         <h1 className="text-3xl font-bold font-heading">Quizzes</h1>
         <p className="text-muted-foreground mt-1">Test your knowledge and earn XP.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h2 className="font-bold text-xl flex items-center gap-2"><PenTool className="w-5 h-5 text-primary" /> Pending Quizzes</h2>
            {pendingQuizzes.map(quiz => (
               <div key={quiz.id} className="bg-white p-5 rounded-3xl border shadow-sm flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-full flex justify-between items-start">
                    <div>
                       <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">{quiz.subject}</Badge>
                       <h3 className="font-bold text-lg">{quiz.title}</h3>
                       {quiz.deadline && <div className="text-xs text-red-500 font-semibold mt-1">Due: {new Date(quiz.deadline).toLocaleString()}</div>}
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <div className="text-sm font-bold text-muted-foreground">{quiz.duration} mins</div>
                       {quiz.allowedAttempts > 1 && (
                         <div className="text-xs font-bold text-primary mt-1">Attempt {quiz.attemptsTaken + 1} of {quiz.allowedAttempts}</div>
                       )}
                    </div>
                  </div>
                  <Button 
                    className="w-full rounded-xl gap-2" 
                    onClick={() => {
                      if (!quiz.questions || quiz.questions.length === 0) {
                        toast.error("This quiz has no questions yet.");
                        return;
                      }
                      setActiveQuiz(quiz.id);
                      setQuizStep(0);
                      setAnswers({});
                    }}
                  >
                    Start Quiz <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>
            ))}
            {pendingQuizzes.length === 0 && (
               <div className="text-center p-8 bg-slate-50 border border-dashed rounded-3xl text-muted-foreground">
                  No pending quizzes. Great job!
               </div>
            )}
         </div>

         <div className="space-y-6">
            <h2 className="font-bold text-xl flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Completed</h2>
            {completedQuizzes.map(quiz => (
               <div key={quiz.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center">
                  <div>
                     <h3 className="font-bold">{quiz.title}</h3>
                     <div className="text-xs text-muted-foreground mt-1">{quiz.date}</div>
                  </div>
                  <div className="text-right">
                     <div className="font-bold text-lg text-success">{quiz.score}</div>
                  </div>
               </div>
            ))}
            {completedQuizzes.length === 0 && (
               <div className="text-center p-8 bg-slate-50 border border-dashed rounded-3xl text-muted-foreground">
                  You haven't completed any quizzes yet.
               </div>
            )}
         </div>
      </div>

      {/* ACTIVE QUIZ OVERLAY */}
      {activeQuiz && activeData && currentQuestion && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] md:h-auto md:max-h-[85vh]">
               <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                  <div className="font-bold">{activeData.title}</div>
                  <div className="flex items-center gap-4">
                     <div className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                        Question {quizStep + 1} of {activeData.questions.length}
                     </div>
                     <button onClick={() => { setActiveQuiz(null); setAnswers({}); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                     </button>
                  </div>
               </div>
               
               <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  <h3 className="text-2xl font-bold font-heading mb-8">
                     {currentQuestion.text}
                  </h3>
                  
                  <div className="space-y-3">
                     {currentQuestion.options.map((option: string, index: number) => {
                        const isSelected = answers[currentQuestion.id] === option;
                        return (
                          <button
                             key={index}
                             onClick={() => setAnswers({...answers, [currentQuestion.id]: option})}
                             className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                                isSelected 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                             }`}
                          >
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                             </div>
                             <span className="font-medium text-lg">{option}</span>
                          </button>
                        );
                     })}
                  </div>
               </div>

               <div className="p-6 border-t bg-slate-50 flex justify-between items-center">
                  <Button 
                     variant="outline" 
                     className="rounded-xl"
                     disabled={quizStep === 0 || submitting}
                     onClick={() => setQuizStep(prev => prev - 1)}
                  >
                     Previous
                  </Button>
                  
                  {quizStep < activeData.questions.length - 1 ? (
                     <Button 
                        className="rounded-xl gap-2"
                        disabled={!answers[currentQuestion.id]}
                        onClick={() => setQuizStep(prev => prev + 1)}
                     >
                        Next <ChevronRight className="w-4 h-4" />
                     </Button>
                  ) : (
                     <Button 
                        className="rounded-xl gap-2 bg-success hover:bg-success/90 text-white"
                        disabled={!answers[currentQuestion.id] || submitting}
                        onClick={() => handleFinishQuiz(activeData.id)}
                     >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />} 
                        {submitting ? "Submitting..." : "Submit Quiz"}
                     </Button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
