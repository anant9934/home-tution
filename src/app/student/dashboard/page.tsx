"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlayCircle, Clock, Trophy, Flame, CheckCircle2, Video, X, Mic, MicOff, Camera, CameraOff, MonitorUp, FileText, ChevronRight, Loader2, AlertCircle, UserSearch, Star } from "lucide-react";
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
  const [activeMeeting, setActiveMeeting] = useState<any | null>(null);

  // Virtual Classroom State
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);

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
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-200">
           {/* Header */}
           <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 text-white shrink-0 bg-slate-900">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold font-heading">{activeMeeting.title || "Class"}</span>
                 <Badge variant="outline" className="border-red-500 text-red-500 animate-pulse ml-2 bg-red-500/10">● LIVE</Badge>
              </div>
              <Button variant="destructive" className="rounded-full font-bold px-6 shadow-lg shadow-destructive/20" onClick={() => setActiveMeeting(null)}>
                 Leave Class
              </Button>
           </div>
           
           {/* Video iframe */}
           <div className="flex-1 w-full bg-black relative">
              {activeMeeting.meetingLink ? (
                <iframe 
                  src={activeMeeting.meetingLink} 
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-0 absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                  <AlertCircle className="w-12 h-12 text-muted-foreground" />
                  <p>No meeting link provided for this class.</p>
                  <Button variant="outline" className="text-black" onClick={() => setActiveMeeting(null)}>Close</Button>
                </div>
              )}
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
                           <Link href={task.type === "Quiz" ? "/student/quizzes" : "/student/assignments"}>
                              <Button className="shrink-0 rounded-xl">
                                 Start {task.type}
                              </Button>
                           </Link>
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
            
             {/* MY TUTOR CARD */}
             <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
               <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 p-4 flex items-center justify-between">
                 <h3 className="font-bold font-heading flex items-center gap-2">
                   <UserSearch className="w-5 h-5 text-primary" /> My Tutor
                 </h3>
               </div>
               {data.assignedTutor ? (
                 <div className="p-5 space-y-3">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                       {data.assignedTutor.name?.charAt(0)}
                     </div>
                     <div>
                       <div className="font-bold text-slate-900">{data.assignedTutor.name}</div>
                       <div className="flex items-center gap-1 mt-0.5">
                         <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                         <span className="text-xs font-semibold">{data.assignedTutor.rating?.toFixed(1) || 'New'}</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-1">
                     {(data.assignedTutor.subjects || []).slice(0,3).map((s: string) => (
                       <Badge key={s} variant="secondary" className="text-[10px] rounded-full">{s}</Badge>
                     ))}
                   </div>
                   <div className="flex items-center justify-between pt-2 border-t">
                     <span className="text-xs text-muted-foreground">{data.assignedTutor.teachingMode} mode</span>
                     <span className="text-sm font-bold text-primary">₹{data.assignedTutor.hourlyRate}/hr</span>
                   </div>
                   <Link href="/student/book-tutor">
                     <button className="w-full text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/5 py-2 rounded-xl transition-colors">
                       Change Tutor
                     </button>
                   </Link>
                 </div>
               ) : (
                 <div className="p-5 text-center">
                   <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                     <UserSearch className="w-7 h-7 text-primary" />
                   </div>
                   <p className="text-sm font-semibold text-slate-700">No tutor assigned yet</p>
                   <p className="text-xs text-muted-foreground mt-1 mb-3">Book a tutor to get started with personalised learning.</p>
                   <Link href="/student/book-tutor">
                     <button className="w-full bg-primary text-white font-bold text-xs py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                       Find a Tutor
                     </button>
                   </Link>
                 </div>
               )}
             </div>

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
                             onClick={() => setActiveMeeting(cls)}
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
