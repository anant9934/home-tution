"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlayCircle, Clock, Trophy, Flame, CheckCircle2, Video, X, Mic, MicOff, Camera, CameraOff, MonitorUp, FileText, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic State
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [showXpToast, setShowXpToast] = useState(false);
  
  // Modals State
  const [activeMeeting, setActiveMeeting] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  // Virtual Classroom State
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await fetchApi("/students/dashboard");
        setData(dashboardData);
        setXp(dashboardData.xp);
        setAchievements(dashboardData.recentAchievements);
        setPendingTasks(dashboardData.pendingTasks);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFinishQuiz = async (taskId: string) => {
    try {
      // In a full implementation, we would send the score to the backend.
      // For this interactive mockup, we just assume 100% score (10 marks)
      const res = await fetchApi(`/students/quizzes/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({ score: 10 }),
      });

      // 1. Close Quiz
      setActiveQuiz(null);
      // 2. Remove from pending tasks
      setPendingTasks(prev => prev.filter(t => t.id !== taskId));
      // 3. Add XP and Achievement
      setXp(prev => prev + (res.xpEarned || 50));
      setAchievements(prev => ["Quiz Master", ...prev]);
      // 4. Show success toast
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 4000);
      
      // Reset Quiz state for next time
      setTimeout(() => {
        setQuizStep(0);
        setSelectedAnswer(null);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-16 w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 relative">
      
      {/* SUCCESS TOAST FOR GAMIFICATION */}
      {showXpToast && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-warning shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center shrink-0">
               <Trophy className="w-6 h-6 text-warning" />
            </div>
            <div>
               <h4 className="font-bold font-heading text-lg text-warning-foreground">+XP Earned!</h4>
               <p className="text-sm font-medium text-muted-foreground">You earned a new badge.</p>
            </div>
         </div>
      )}

      {/* VIRTUAL CLASSROOM MODAL */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-in fade-in duration-200">
           {/* Header */}
           <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 text-white">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold font-heading">{activeMeeting}</span>
                 <Badge variant="outline" className="border-red-500 text-red-500 animate-pulse ml-2 bg-red-500/10">● REC</Badge>
              </div>
              <div className="text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full">00:14:23</div>
           </div>
           
           {/* Video Grid */}
           <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 justify-center items-center">
              {/* Tutor Screen (Large) */}
              <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" alt="Tutor" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 font-medium">
                    Instructor
                 </div>
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/80 p-2 rounded-lg border border-white/10">
                    <Mic className="w-4 h-4" />
                 </div>
              </div>
              
              {/* Student Screen (Small) */}
              <div className="relative w-48 md:w-64 aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-white/20 shadow-xl md:self-end">
                 {camOn ? (
                    <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" alt="You" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                       <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl">{data.studentName.charAt(0)}</div>
                    </div>
                 )}
                 <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md border border-white/10">
                    You
                 </div>
                 {!micOn && (
                    <div className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-md text-white p-1 rounded-md">
                       <MicOff className="w-3 h-3" />
                    </div>
                 )}
              </div>
           </div>
           
           {/* Controls Bottom Bar */}
           <div className="h-24 border-t border-white/10 flex items-center justify-center gap-4">
              <Button 
                variant={micOn ? "secondary" : "destructive"} 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setMicOn(!micOn)}
              >
                 {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button 
                variant={camOn ? "secondary" : "destructive"} 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setCamOn(!camOn)}
              >
                 {camOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </Button>
              <Button variant="secondary" size="icon" className="w-12 h-12 rounded-full">
                 <MonitorUp className="w-5 h-5" />
              </Button>
              <Button variant="destructive" className="h-12 px-8 rounded-full font-bold ml-4 shadow-lg shadow-destructive/20" onClick={() => setActiveMeeting(null)}>
                 Leave Class
              </Button>
           </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                       <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <h3 className="font-bold font-heading">{pendingTasks.find(t => t.id === activeQuiz)?.title}</h3>
                       <p className="text-xs text-muted-foreground">Question {quizStep + 1} of 1</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveQuiz(null)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>

              {/* Body */}
              <div className="p-8">
                 {quizStep === 0 ? (
                    <>
                       <h4 className="text-xl font-bold mb-6">Take the quiz carefully!</h4>
                       
                       <div className="space-y-3">
                          {["Option 1", "Option 2", "Option 3", "Option 4"].map((ans, i) => (
                             <button
                                key={i}
                                onClick={() => setSelectedAnswer(i)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                   selectedAnswer === i 
                                   ? "border-primary bg-primary/5 shadow-sm" 
                                   : "border-border hover:border-primary/30 hover:bg-slate-50"
                                }`}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                      selectedAnswer === i ? "border-primary" : "border-muted-foreground/30"
                                   }`}>
                                      {selectedAnswer === i && <div className="w-3 h-3 bg-primary rounded-full" />}
                                   </div>
                                   <span className={`font-semibold ${selectedAnswer === i ? "text-primary" : "text-foreground"}`}>{ans}</span>
                                </div>
                             </button>
                          ))}
                       </div>
                       
                       <div className="mt-8 pt-6 border-t flex justify-end">
                          <Button 
                             disabled={selectedAnswer === null} 
                             onClick={() => setQuizStep(1)}
                             className="rounded-full px-8 gap-2 font-bold"
                          >
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
                       <p className="text-muted-foreground mb-8">You successfully completed the task.</p>
                       <Button onClick={() => handleFinishQuiz(activeQuiz)} className="rounded-full px-8 font-bold w-full sm:w-auto">
                          Claim Rewards
                       </Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}


      {/* MAIN DASHBOARD CONTENT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Welcome back, {data.studentName.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-1">You're on a {data.streak}-day learning streak. Keep it up!</p>
         </div>
         <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-2">
               <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
               <span className="font-bold">{data.streak} Day Streak</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="flex items-center gap-2 transition-all duration-500" style={{ transform: showXpToast ? "scale(1.1)" : "scale(1)" }}>
               <Trophy className={`w-5 h-5 transition-colors duration-500 ${showXpToast ? "text-primary fill-primary" : "text-warning fill-warning"}`} />
               <span className={`font-bold transition-colors duration-500 ${showXpToast ? "text-primary" : ""}`}>{xp} XP</span>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: COURSES & PENDING TASKS */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* PENDING TASKS SECTION */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Pending Tasks
               </h2>
               
               {pendingTasks.length > 0 ? (
                  <div className="grid gap-4">
                     {pendingTasks.map((task: any) => (
                        <div key={task.id} className="bg-white rounded-2xl border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${task.type === "Quiz" ? "bg-warning/10" : "bg-primary/10"}`}>
                                 <FileText className={`w-6 h-6 ${task.type === "Quiz" ? "text-warning" : "text-primary"}`} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={task.type === "Quiz" ? "border-warning/30 text-warning" : "border-primary/30 text-primary"}>{task.type}</Badge>
                                    <span className="text-xs font-semibold text-destructive">Due: {task.due}</span>
                                 </div>
                                 <h4 className="font-bold">{task.title}</h4>
                                 <p className="text-xs text-muted-foreground mt-0.5">{task.subject}</p>
                              </div>
                           </div>
                           <Button onClick={() => setActiveQuiz(task.id)} className="shrink-0 rounded-xl">
                              Start {task.type}
                           </Button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="bg-white/50 border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                     <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                     </div>
                     <h3 className="font-bold font-heading text-lg">All Caught Up!</h3>
                     <p className="text-muted-foreground text-sm max-w-sm mt-1">You have no pending tasks or assignments. Great job staying on top of your work!</p>
                  </div>
               )}
            </div>

            {/* ENROLLED COURSES */}
            <div className="space-y-4">
               <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Enrolled Courses
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.enrolledCourses.map((course: any) => (
                    <div key={course.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                       <h3 className="font-bold text-lg font-heading mb-1 line-clamp-1">{course.title}</h3>
                       <p className="text-sm text-muted-foreground mb-4">with {course.instructor}</p>
                       
                       <div className="mb-6 mt-auto">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-muted-foreground line-clamp-1">Up next: {course.nextLesson}</span>
                            <span className="text-xs font-bold">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                       </div>
                       
                       <Link href={`/student/courses`}>
                          <Button className="w-full rounded-xl shadow-sm gap-2">
                            <PlayCircle className="w-4 h-4" /> Go to Course
                          </Button>
                       </Link>
                    </div>
                  ))}
               </div>
            </div>
         </div>
         
         {/* RIGHT COLUMN: SCHEDULE & ACHIEVEMENTS */}
         <div className="space-y-8">
            
            {/* UPCOMING CLASSES */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Upcoming Classes
               </h3>
               <div className="space-y-4">
                  {data.upcomingClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming classes</p>
                  ) : (
                    data.upcomingClasses.map((cls: any) => (
                       <div key={cls.id} className="p-4 rounded-2xl border bg-slate-50 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                          <h4 className="font-bold text-sm mb-1">{cls.title}</h4>
                          <div className="text-xs text-muted-foreground mb-3">{cls.time} • {cls.tutor}</div>
                          <Button 
                             size="sm" 
                             onClick={() => setActiveMeeting(cls.title)}
                             className="w-full text-xs h-8 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                             Join Meeting
                          </Button>
                       </div>
                    ))
                  )}
               </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" /> Recent Badges
               </h3>
               <div className="space-y-3">
                  {achievements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Keep learning to earn badges!</p>
                  ) : (
                    achievements.map((badge, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-warning/20 bg-warning/5 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
                          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0">
                             <CheckCircle2 className="w-6 h-6 text-warning" />
                          </div>
                          <div className="font-semibold text-sm">{badge}</div>
                       </div>
                    ))
                  )}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
