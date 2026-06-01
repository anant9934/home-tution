"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle2, ChevronRight, Menu, X, Trophy, AlertCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LmsClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [courseTitle, setCourseTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    fetchApi(`/students/courses/${courseId}/curriculum`)
      .then(res => {
         setCurriculum(res.curriculum);
         setCourseTitle(res.courseTitle);
         if (res.curriculum.length > 0) {
            setActiveLessonId(res.curriculum[0].id);
         }
      })
      .catch(err => toast.error("Failed to load curriculum"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const activeLesson = curriculum.find(l => l.id === activeLessonId);
  const isQuizLesson = activeLesson?.type === "quiz";

  // Mock quiz questions since actual schema only maps basic quiz without deep relation in payload yet
  // In a real scenario, this would be fetched from activeLesson.quizId
  const quizQuestions = [
    { q: "What is the derivative of x²?", options: ["2x", "x", "x³", "1"], correct: 0 },
    { q: "What does a derivative represent?", options: ["Area under curve", "Rate of change", "Total volume", "Roots of equation"], correct: 1 },
  ];

  const handleNextLesson = () => {
    if (!activeLessonId) return;
    const nextLesson = curriculum.find(l => l.id === activeLessonId + 1);
    if (nextLesson) {
       setActiveLessonId(nextLesson.id);
    } else {
       toast.success("Course Completed!");
       router.push("/student/dashboard");
    }
  };

  const submitAnswer = async () => {
    if (selectedAnswer === quizQuestions[quizStep].correct) {
       if (quizStep < quizQuestions.length - 1) {
         setQuizStep(s => s + 1);
         setSelectedAnswer(null);
       } else {
         // Submit quiz to backend
         if (activeLesson?.quizId) {
            try {
               const res = await fetchApi(`/students/quizzes/${activeLesson.quizId}/submit`, {
                 method: "POST",
                 body: JSON.stringify({ score: 100 })
               });
               setEarnedXp(res.xpEarned || 50);
            } catch (err) {
               console.error(err);
            }
         }
         
         setCurriculum(prev => prev.map(l => l.id === activeLessonId ? { ...l, completed: true } : l));
         setQuizCompleted(true);
       }
    } else {
       toast.error("Incorrect, try again!");
    }
  };

  const markVideoComplete = async () => {
    if (activeLesson?.lessonId) {
       try {
          await fetchApi(`/students/courses/lessons/${activeLesson.lessonId}/complete`, {
            method: "POST"
          });
          setCurriculum(prev => prev.map(l => l.id === activeLessonId ? { ...l, completed: true } : l));
          handleNextLesson();
       } catch (err: any) {
          toast.error("Failed to mark as complete");
       }
    } else {
       handleNextLesson();
    }
  };

  if (loading) {
     return <div className="p-8 flex justify-center"><Skeleton className="w-full h-[60vh] rounded-3xl" /></div>;
  }

  if (curriculum.length === 0) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
         <div className="text-center bg-white p-10 rounded-3xl border shadow-sm max-w-md w-full">
            <h2 className="text-2xl font-bold font-heading mb-3">Content Coming Soon</h2>
            <p className="text-muted-foreground mb-8 text-sm">The tutor hasn't uploaded any lessons or quizzes for this course yet. Please check back later.</p>
            <Link href="/student/dashboard">
               <Button className="rounded-full w-full font-bold shadow-md h-12">Back to Dashboard</Button>
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`w-80 bg-white border-r flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20 h-full shadow-2xl'}`}>
         <div className="p-4 border-b flex justify-between items-center">
            <div>
               <h3 className="font-bold font-heading line-clamp-1">{courseTitle}</h3>
               <p className="text-xs text-muted-foreground mt-1">
                 {curriculum.filter(l => l.completed).length}/{curriculum.length} completed
               </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></Button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {curriculum.map((lesson) => (
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
            <Link href="/student/dashboard">
               <Button variant="outline" className="rounded-full shadow-sm text-sm h-9">Back to Dashboard</Button>
            </Link>
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
                         <p className="text-muted-foreground text-lg">+{earnedXp || 50} XP Earned</p>
                         <Button onClick={handleNextLesson} className="h-12 px-8 rounded-full shadow-sm text-md font-bold mt-4">Continue to Next Lesson</Button>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="space-y-6">
                   <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-lg relative flex items-center justify-center group">
                     {activeLesson?.videoUrl ? (
                        <video 
                          src={activeLesson.videoUrl} 
                          controls 
                          className="w-full h-full object-cover" 
                          controlsList="nodownload"
                        />
                     ) : (
                        <>
                          <PlayCircle className="w-20 h-20 text-white/50 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                          <div className="absolute bottom-6 left-6 text-white font-bold font-heading text-2xl pointer-events-none">{activeLesson?.title}</div>
                        </>
                     )}
                   </div>
                   
                   <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div>
                         <h4 className="font-bold text-lg">About this lesson</h4>
                         <p className="text-muted-foreground text-sm mt-1 max-w-2xl">This lesson is part of {courseTitle}.</p>
                      </div>
                      <Button onClick={markVideoComplete} className="h-12 px-6 rounded-full shadow-sm font-bold gap-2">
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
