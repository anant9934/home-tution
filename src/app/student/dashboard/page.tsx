import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, Calendar as CalendarIcon, Flame, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/students/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function StudentDashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold font-heading mb-2">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground mb-6">We couldn't load your dashboard data.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const { student, stats, schedule, leaderboard, activeCourses, pendingTasks } = data;

  const todayClassesCount = schedule.filter((s: any) => new Date(s.time).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      {/* WELCOME BANNER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 max-w-md">
               <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Ready to crush it today?</h2>
               <p className="text-primary-light/80 mb-6 text-sm md:text-base">
                 You have {todayClassesCount} classes scheduled for today. Keep up the great work!
               </p>
               {schedule.length > 0 && (
                 <a href={schedule[0]?.meetingLink || "#"} target="_blank" rel="noreferrer">
                   <Button variant="secondary" className="rounded-xl font-bold border-0 shadow-sm text-primary">
                      Join Next Class
                   </Button>
                 </a>
               )}
            </div>
         </div>
         
         <div className="bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weekly Goal</div>
              <Flame className="w-5 h-5 text-warning fill-warning/20" />
            </div>
            
            <div className="flex items-end gap-3 mb-4">
              <div className="text-4xl font-bold font-heading">{stats.currentStreak}<span className="text-2xl text-muted-foreground font-normal">/{stats.weeklyGoal}</span></div>
              <div className="text-sm text-muted-foreground mb-1">days streak</div>
            </div>
            
            <div className="flex justify-between gap-1 mt-auto">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < stats.currentStreak ? 'bg-success text-white shadow-sm shadow-success/30' : (i === stats.currentStreak ? 'bg-primary-light border-2 border-primary text-primary' : 'bg-muted text-muted-foreground')}`}>
                      {i < stats.currentStreak ? <CheckCircle2 className="w-4 h-4" /> : day}
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: MAIN CONTENT */}
         <div className="xl:col-span-2 space-y-8">
            
            {/* CONTINUE LEARNING */}
            <section>
              <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xl font-bold font-heading">Continue Learning</h3>
                 <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View all</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {activeCourses.map((course: any, idx: number) => (
                   <Card key={course.id} className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="aspect-video bg-muted relative">
                        <div className={`absolute inset-0 ${idx % 2 === 0 ? 'bg-primary/5' : 'bg-success/5'} flex items-center justify-center`}>
                           <PlayCircle className={`w-12 h-12 ${idx % 2 === 0 ? 'text-primary/40' : 'text-success/40'} group-hover:scale-110 transition-transform duration-500`} />
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className={`text-xs ${idx % 2 === 0 ? 'text-primary' : 'text-success'} font-bold mb-1 uppercase tracking-wider`}>{course.subject}</div>
                        <h4 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h4>
                        <Progress value={course.progress} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span>{course.progress}% Complete</span>
                          <span>Part {course.completedParts} of {course.totalParts}</span>
                        </div>
                      </CardContent>
                   </Card>
                 ))}
                 
                 {activeCourses.length === 0 && (
                   <div className="col-span-2 p-8 border rounded-2xl border-dashed text-center">
                     <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                     <Button className="mt-4" variant="outline">Browse Courses</Button>
                   </div>
                 )}
              </div>
            </section>
            
            {/* UPCOMING CLASSES */}
            <section>
              <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xl font-bold font-heading">Today's Schedule</h3>
              </div>
              
              <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                <div className="divide-y">
                   {schedule.map((item: any, i: number) => {
                     const date = new Date(item.time);
                     const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                     
                     return (
                       <div key={item.id} className="p-5 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                          <div className="w-20 text-center shrink-0">
                             <div className="text-sm font-bold">{timeString.split(' ')[0]}</div>
                             <div className="text-xs text-muted-foreground">{timeString.split(' ')[1]}</div>
                          </div>
                          <div className="w-1 h-12 rounded-full bg-muted shrink-0 relative overflow-hidden">
                             <div className={`absolute inset-0 ${item.status === 'COMPLETED' ? 'bg-success' : (item.status === 'PENDING' ? 'bg-primary' : 'bg-transparent')}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-base truncate">{item.title}</h4>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                               <span className="font-medium">{item.tutor}</span>
                               <span>•</span>
                               <span>{item.type}</span>
                             </div>
                          </div>
                          <div className="shrink-0 hidden sm:block">
                             {item.status === 'PENDING' && (
                               <a href={item.meetingLink || "#"} target="_blank" rel="noreferrer">
                                 <Button size="sm" className="rounded-full shadow-sm">Join Now</Button>
                               </a>
                             )}
                             {item.status === 'COMPLETED' && <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                          </div>
                       </div>
                     );
                   })}
                   
                   {schedule.length === 0 && (
                     <div className="p-8 text-center">
                       <p className="text-muted-foreground text-sm">No classes scheduled for today.</p>
                     </div>
                   )}
                </div>
              </div>
            </section>
         </div>
         
         {/* RIGHT COLUMN: WIDGETS */}
         <div className="space-y-6">
            
            {/* PERFORMANCE / LEADERBOARD */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold font-heading">Leaderboard</h3>
                  <Trophy className="w-5 h-5 text-warning" />
               </div>
               
               <div className="space-y-4">
                  {leaderboard.map((student: any, idx: number) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${student.isCurrent ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50 border border-transparent'}`}>
                       <div className={`w-6 text-center font-bold text-sm ${student.rank === 1 ? 'text-warning' : (student.rank === 2 ? 'text-zinc-400' : (student.rank === 3 ? 'text-primary' : 'text-muted-foreground'))}`}>
                         #{student.rank}
                       </div>
                       <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold uppercase">
                         {student.isCurrent ? 'You' : student.name.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className={`text-sm font-bold truncate ${student.isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                           {student.name}
                         </div>
                       </div>
                       <div className="text-xs font-bold text-primary">
                         {student.xp} XP
                       </div>
                    </div>
                  ))}
               </div>
               
               <Button variant="outline" className="w-full mt-4 rounded-xl text-sm h-10">View Full Rankings</Button>
            </div>
            
            {/* ASSIGNMENTS TO DO */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4">Pending Tasks</h3>
               
               <div className="space-y-4">
                  {pendingTasks.map((task: any) => {
                    const dueDate = new Date(task.dueAt);
                    const isToday = dueDate.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={task.id} className="group border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-sm">{task.title}</h4>
                           {isToday && <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-2 py-0.5 rounded-full">Due Today</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{task.type}</p>
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                             <Clock className="w-3 h-3" /> {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           <Button size="sm" variant="secondary" className="h-7 text-xs rounded-lg font-semibold">Upload</Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {pendingTasks.length === 0 && (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground text-xs">No pending tasks!</p>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
