import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Clock, IndianRupee, ChevronRight, Plus, ClipboardList, Calendar as CalendarIcon, MessageSquare, CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tutors/dashboard`, {
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

export default async function TeacherDashboardPage() {
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

  const { tutor, stats, schedule, actionRequired } = data;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold font-heading">Welcome back, {tutor.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-1">Here is what's happening with your classes today.</p>
         </div>
         <Button className="rounded-full font-bold shadow-sm flex items-center gap-2">
           <Plus className="w-4 h-4" /> Create Class
         </Button>
      </div>
      
      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Today's Classes", value: stats.todaysClasses, icon: BookOpen, color: "text-warning", bg: "bg-warning/10" },
           { label: "Pending Tasks", value: stats.pendingTasksCount, icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
           { label: "Monthly Earnings", value: stats.monthlyEarnings, icon: IndianRupee, color: "text-success", bg: "bg-success/10" },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm">
             <CardContent className="p-5 flex flex-col justify-center">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold font-heading">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* TODAY'S SCHEDULE */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold font-heading">Today's Schedule</h2>
               <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View Calendar</Button>
            </div>
            
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
               <div className="divide-y">
                 {schedule.map((session: any) => {
                   const timeString = new Date(session.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                   return (
                     <div key={session.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-24 shrink-0">
                           <div className="text-sm font-bold text-foreground">{timeString}</div>
                           <div className="text-xs text-muted-foreground">{session.duration}</div>
                        </div>
                        
                        <div className="w-1 h-12 rounded-full hidden sm:block shrink-0 relative overflow-hidden bg-muted">
                           <div className={`absolute inset-0 ${session.status === 'COMPLETED' ? 'bg-success' : (session.status === 'ONGOING' ? 'bg-warning' : 'bg-primary')}`}></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-base">{session.title}</h4>
                             {session.status === 'ONGOING' && <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse"></span>}
                           </div>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                             <span className="bg-muted px-2 py-0.5 rounded-md font-medium">{session.type}</span>
                             <span>•</span>
                             <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {session.students} students</span>
                           </div>
                        </div>
                        
                        <div className="shrink-0 mt-3 sm:mt-0">
                           {session.status === 'PENDING' && (
                             <a href={session.meetingLink || "#"} target="_blank" rel="noreferrer">
                               <Button size="sm" className="w-full sm:w-auto rounded-lg shadow-sm bg-primary hover:bg-primary-hover text-white">Join Session</Button>
                             </a>
                           )}
                           {session.status === 'COMPLETED' && <span className="text-xs font-bold text-success flex items-center justify-center sm:justify-start gap-1"><CheckCircle2 className="w-4 h-4" /> Finished</span>}
                        </div>
                     </div>
                   );
                 })}

                 {schedule.length === 0 && (
                   <div className="p-8 text-center text-muted-foreground text-sm">
                     You have no classes scheduled for today. Enjoy your break!
                   </div>
                 )}
               </div>
            </div>
         </div>
         
         {/* RIGHT COLUMN */}
         <div className="space-y-8">
            
            {/* ACTION REQUIRED */}
            <div>
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold font-heading">Action Required</h2>
               </div>
               
               <div className="bg-white rounded-3xl border shadow-sm p-2">
                 {actionRequired.map((action: any) => (
                   <div key={action.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors group">
                      <div>
                         <div className="font-bold text-sm group-hover:text-primary transition-colors">{action.title}</div>
                         <div className="text-xs text-muted-foreground">{action.desc}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                         <ChevronRight className="w-4 h-4" />
                      </div>
                   </div>
                 ))}

                 {actionRequired.length === 0 && (
                   <div className="text-center p-4 text-xs text-muted-foreground">
                     All caught up! No actions required.
                   </div>
                 )}
               </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-gradient-to-br from-primary-light to-white p-6 rounded-3xl border border-primary/10 shadow-sm">
               <h3 className="font-bold font-heading mb-4">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl bg-white border-border/50 shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                     <Plus className="w-5 h-5" />
                     <span className="text-xs">New Quiz</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl bg-white border-border/50 shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                     <ClipboardList className="w-5 h-5" />
                     <span className="text-xs">Assignment</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl bg-white border-border/50 shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                     <CalendarIcon className="w-5 h-5" />
                     <span className="text-xs">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 rounded-2xl bg-white border-border/50 shadow-sm hover:border-primary/50 hover:text-primary transition-all">
                     <MessageSquare className="w-5 h-5" />
                     <span className="text-xs">Broadcast</span>
                  </Button>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
