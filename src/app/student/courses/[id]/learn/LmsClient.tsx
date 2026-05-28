"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle2, ChevronRight, Menu, X, Trophy, AlertCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const MOCK_CURRICULUM = [
  { id: 1, title: "Introduction to Calculus", type: "video", duration: "12:45", completed: true },
  { id: 2, title: "Limits and Continuity", type: "video", duration: "18:20", completed: true },
  { id: 3, title: "Derivatives Basics", type: "video", duration: "25:10", completed: false },
  { id: 4, title: "Chapter 1 Knowledge Check", type: "quiz", duration: "10 mins", completed: false },
  { id: 5, title: "Applications of Derivatives", type: "video", duration: "22:15", completed: false },
];

export default function LmsClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState(3);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const activeLesson = MOCK_CURRICULUM.find(l => l.id === activeLessonId);
  const isQuizLesson = activeLesson?.type === "quiz";

  const quizQuestions = [
    { q: "What is the derivative of x²?", options: ["2x", "x", "x³", "1"], correct: 0 },
    { q: "What does a derivative represent?", options: ["Area under curve", "Rate of change", "Total volume", "Roots of equation"], correct: 1 },
  ];

  const handleNextLesson = () => {
    const nextLesson = MOCK_CURRICULUM.find(l => l.id === activeLessonId + 1);
    if (nextLesson) setActiveLessonId(nextLesson.id);
  };

  const submitAnswer = () => {
    if (selectedAnswer === quizQuestions[quizStep].correct) {
       if (quizStep < quizQuestions.length - 1) {
         setQuizStep(s => s + 1);
         setSelectedAnswer(null);
       } else {
         setQuizCompleted(true);
       }
    } else {
       alert("Incorrect, try again!");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`w-80 bg-white border-r flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20 h-full shadow-2xl'}`}>
         <div className="p-4 border-b flex justify-between items-center">
            <div>
               <h3 className="font-bold font-heading line-clamp-1">Mastering Advanced Calculus</h3>
               <p className="text-xs text-muted-foreground mt-1">2/15 completed</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></Button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MOCK_CURRICULUM.map((lesson) => (
               <div 
                 key={lesson.id} 
                 onClick={() => {
                   setActiveLessonId(lesson.id);
                   setShowQuiz(false);
                   setQuizCompleted(false);
                   setQuizStep(0);
                 }}
                 className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeLessonId === lesson.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}`}
               >
                  <div className="mt-0.5">
                     {lesson.completed ? (
                       <CheckCircle2 className="w-5 h-5 text-success fill-success/20" />
                     ) : lesson.type === "video" ? (
                       <PlayCircle className="w-5 h-5 text-muted-foreground" />
                     ) : (
                       <AlertCircle className="w-5 h-5 text-warning" />
                     )}
                  </div>
                  <div>
                     <div className={`text-sm font-semibold ${activeLessonId === lesson.id ? 'text-primary' : ''}`}>{lesson.title}</div>
                     <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                       {lesson.type === "video" ? <Video className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                       {lesson.duration}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* MAIN PLAYER AREA */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
         <header className="h-16 bg-white border-b px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
               {!sidebarOpen && <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></Button>}
               <h2 className="font-bold text-lg font-heading">{activeLesson?.title}</h2>
            </div>
            <Button variant="outline" className="rounded-full shadow-sm text-sm h-9">Back to Dashboard</Button>
         </header>
         
         <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center">
            <div className="w-full max-w-5xl space-y-6">
               
               {isQuizLesson ? (
                 <div className="bg-white rounded-3xl border shadow-sm p-8 min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    {!quizCompleted ? (
                      <div className="w-full max-w-xl z-10">
                         <div className="flex justify-between items-center mb-8">
                            <Badge variant="outline" className="text-warning border-warning/30 bg-warning/5 px-3 py-1 text-sm">Question {quizStep + 1} of {quizQuestions.length}</Badge>
                            <span className="text-sm font-bold text-muted-foreground">{Math.round((quizStep / quizQuestions.length) * 100)}%</span>
                         </div>
                         <Progress value={(quizStep / quizQuestions.length) * 100} className="h-2 mb-8 bg-muted [&>div]:bg-warning" />
                         
                         <h3 className="text-2xl font-bold font-heading mb-8 text-center">{quizQuestions[quizStep].q}</h3>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quizQuestions[quizStep].options.map((opt, i) => (
                              <div 
                                key={i}
                                onClick={() => setSelectedAnswer(i)}
                                className={`p-5 rounded-2xl border-2 cursor-pointer font-medium text-center transition-all ${selectedAnswer === i ? 'border-warning bg-warning/10 text-warning' : 'hover:border-warning/50 hover:bg-warning/5'}`}
                              >
                                 {opt}
                              </div>
                            ))}
                         </div>
                         
                         <Button 
                           disabled={selectedAnswer === null} 
                           onClick={submitAnswer}
                           className="w-full mt-10 h-14 rounded-2xl text-lg font-bold shadow-md bg-warning hover:bg-warning/90 text-warning-foreground"
                         >
                            Check Answer
                         </Button>
                      </div>
                    ) : (
                      <div className="text-center z-10 space-y-6">
                         <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-12 h-12 text-success" />
                         </div>
                         <h3 className="text-3xl font-bold font-heading">Quiz Completed!</h3>
                         <p className="text-muted-foreground text-lg">+50 XP Earned</p>
                         <Button onClick={handleNextLesson} className="h-12 px-8 rounded-full shadow-sm text-md font-bold mt-4">Continue to Next Lesson</Button>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="space-y-6">
                   <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-lg relative flex items-center justify-center">
                     <PlayCircle className="w-20 h-20 text-white/50" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-6 left-6 text-white font-bold font-heading text-2xl">{activeLesson?.title}</div>
                   </div>
                   
                   <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                         <h4 className="font-bold text-lg">About this lesson</h4>
                         <p className="text-muted-foreground text-sm mt-1 max-w-2xl">In this lesson, we will cover the fundamental concepts of derivatives and how they apply to real-world physics problems.</p>
                      </div>
                      <Button onClick={handleNextLesson} className="h-12 px-6 rounded-full shadow-sm font-bold gap-2">
                         Mark Complete <ChevronRight className="w-4 h-4" />
                      </Button>
                   </div>
                 </div>
               )}
               
            </div>
         </main>
      </div>
      
    </div>
  );
}
