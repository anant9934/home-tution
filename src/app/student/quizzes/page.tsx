"use client";

import { useState } from "react";
import { PenTool, CheckCircle2, ChevronRight, FileText, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quizzesData = [
  { id: "q1", title: "Calculus Derivatives Intro", subject: "Mathematics", duration: "15 mins", questions: 5, status: "pending", score: null },
  { id: "q2", title: "Newton's Laws", subject: "Physics", duration: "20 mins", questions: 10, status: "pending", score: null },
  { id: "q3", title: "Cell Structure", subject: "Biology", duration: "10 mins", questions: 5, status: "completed", score: "5/5" },
];

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState(quizzesData);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleFinishQuiz = (id: string) => {
    setActiveQuiz(null);
    setQuizzes(quizzes.map(q => q.id === id ? { ...q, status: "completed", score: "5/5" } : q));
    setTimeout(() => {
      setQuizStep(0);
      setSelectedAnswer(null);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8 relative">
      <div>
         <h1 className="text-3xl font-bold font-heading">Quizzes</h1>
         <p className="text-muted-foreground mt-1">Test your knowledge and earn XP.</p>
      </div>

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                       <PenTool className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                       <h3 className="font-bold font-heading">{quizzes.find(q => q.id === activeQuiz)?.title}</h3>
                       <p className="text-xs text-muted-foreground">Question {quizStep + 1} of 1</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveQuiz(null)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>

              <div className="p-8">
                 {quizStep === 0 ? (
                    <>
                       <h4 className="text-xl font-bold mb-6">What is the derivative of <code className="bg-muted px-2 py-1 rounded-md text-primary">f(x) = x²</code>?</h4>
                       <div className="space-y-3">
                          {["2x", "x", "x²", "2"].map((ans, i) => (
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
                       <h4 className="text-2xl font-bold font-heading mb-2">Perfect Score!</h4>
                       <p className="text-muted-foreground mb-8">You successfully completed the quiz.</p>
                       <Button onClick={() => handleFinishQuiz(activeQuiz)} className="rounded-full px-8 font-bold w-full sm:w-auto">
                          Finish & Earn XP
                       </Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="grid gap-4">
         {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all hover:shadow-md">
               <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${quiz.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                     {quiz.status === "completed" ? <Trophy className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={quiz.subject === 'Mathematics' ? 'border-blue-200 text-blue-600' : quiz.subject === 'Physics' ? 'border-orange-200 text-orange-600' : 'border-green-200 text-green-600'}>{quiz.subject}</Badge>
                        <span className="text-xs font-semibold text-muted-foreground">{quiz.duration} • {quiz.questions} Qs</span>
                     </div>
                     <h3 className="font-bold text-lg">{quiz.title}</h3>
                  </div>
               </div>
               
               <div className="shrink-0 w-full sm:w-auto">
                  {quiz.status === "completed" ? (
                     <div className="flex flex-col items-end">
                        <div className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Completed</div>
                        <div className="text-xs font-semibold text-muted-foreground mt-1 border px-2 py-1 rounded-md">Score: {quiz.score}</div>
                     </div>
                  ) : (
                     <Button onClick={() => setActiveQuiz(quiz.id)} className="w-full rounded-xl gap-2 shadow-sm font-bold">
                        <PenTool className="w-4 h-4" /> Start Quiz
                     </Button>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
