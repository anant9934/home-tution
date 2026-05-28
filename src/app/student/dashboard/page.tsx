"use client";

import Link from "next/link";
import { BookOpen, PlayCircle, Clock, Trophy, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_STUDENT_DASHBOARD } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const data = MOCK_STUDENT_DASHBOARD;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
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
            <div className="flex items-center gap-2">
               <Trophy className="w-5 h-5 text-warning fill-warning" />
               <span className="font-bold">{data.xp} XP</span>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: COURSES */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-primary" /> My Courses
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {data.enrolledCourses.map((course) => (
                 <div key={course.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                    <h3 className="font-bold text-lg font-heading mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">with {course.instructor}</p>
                    
                    <div className="mb-6 mt-auto">
                       <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-muted-foreground">Up next: {course.nextLesson}</span>
                         <span className="text-xs font-bold">{course.progress}%</span>
                       </div>
                       <Progress value={course.progress} className="h-2" />
                    </div>
                    
                    <Link href={`/student/courses/${course.id}/learn`}>
                       <Button className="w-full rounded-xl shadow-sm gap-2">
                         <PlayCircle className="w-4 h-4" /> Resume Course
                       </Button>
                    </Link>
                 </div>
               ))}
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
                  {data.upcomingClasses.map((cls) => (
                     <div key={cls.id} className="p-4 rounded-2xl border bg-slate-50 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        <h4 className="font-bold text-sm mb-1">{cls.title}</h4>
                        <div className="text-xs text-muted-foreground mb-3">{cls.time} • {cls.tutor}</div>
                        <Button size="sm" variant="outline" className="w-full text-xs h-8 bg-white group-hover:bg-primary group-hover:text-primary-foreground transition-colors">Join Meeting</Button>
                     </div>
                  ))}
               </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" /> Recent Badges
               </h3>
               <div className="space-y-3">
                  {data.recentAchievements.map((badge, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-warning/20 bg-warning/5">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                           <CheckCircle2 className="w-6 h-6 text-warning" />
                        </div>
                        <div className="font-semibold text-sm">{badge}</div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
