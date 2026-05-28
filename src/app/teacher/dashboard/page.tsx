import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, IndianRupee, BookOpen, Clock, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Plus } from "lucide-react";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Here is what's happening with your classes today.</p>
         </div>
         <Button className="hidden sm:flex rounded-xl gap-2 h-10 shadow-sm">
           <Plus className="w-4 h-4" /> Create Class
         </Button>
      </div>
      
      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Students", value: "142", icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Today's Classes", value: "4", icon: BookOpen, color: "text-warning", bg: "bg-warning/10" },
           { label: "Pending Tasks", value: "12", icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
           { label: "Monthly Earnings", value: "₹45k", icon: IndianRupee, color: "text-success", bg: "bg-success/10" },
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
                 {[
                   { time: "09:00 AM", duration: "1.5h", title: "Class 12 - Advanced Calculus", type: "Group Batch", students: 24, status: "Completed" },
                   { time: "11:30 AM", duration: "1h", title: "Class 11 - Trigonometry Basics", type: "1-on-1 Tuition", students: 1, status: "Ongoing" },
                   { time: "04:00 PM", duration: "2h", title: "JEE Mains Revision Batch", type: "Group Batch", students: 45, status: "Upcoming" },
                 ].map((session, i) => (
                   <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-24 shrink-0">
                         <div className="text-sm font-bold text-foreground">{session.time}</div>
                         <div className="text-xs text-muted-foreground">{session.duration}</div>
                      </div>
                      
                      <div className="w-1 h-12 rounded-full hidden sm:block shrink-0 relative overflow-hidden bg-muted">
                         <div className={`absolute inset-0 ${session.status === 'Completed' ? 'bg-success' : (session.status === 'Ongoing' ? 'bg-warning' : 'bg-primary')}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-base">{session.title}</h4>
                           {session.status === 'Ongoing' && <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse"></span>}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span className="bg-muted px-2 py-0.5 rounded-md font-medium">{session.type}</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {session.students} students</span>
                         </div>
                      </div>
                      
                      <div className="shrink-0 mt-3 sm:mt-0">
                         {session.status === 'Upcoming' && <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-lg shadow-sm">Prepare</Button>}
                         {session.status === 'Ongoing' && <Button size="sm" className="w-full sm:w-auto rounded-lg shadow-sm bg-warning hover:bg-warning/90 text-white">Join Session</Button>}
                         {session.status === 'Completed' && <span className="text-xs font-bold text-success flex items-center justify-center sm:justify-start gap-1"><CheckCircle2 className="w-4 h-4" /> Finished</span>}
                      </div>
                   </div>
                 ))}
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
                 {[
                   { title: "Grade Calculus Test", desc: "45 pending submissions", type: "Assignment" },
                   { title: "Approve Demo Request", desc: "Rahul Sharma (Class 10)", type: "Demo" },
                   { title: "Upload Notes", desc: "For yesterday's Physics class", type: "Material" },
                 ].map((action, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 cursor-pointer transition-colors group">
                      <div>
                         <div className="font-bold text-sm group-hover:text-primary transition-colors">{action.title}</div>
                         <div className="text-xs text-muted-foreground">{action.desc}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                         <ChevronRight className="w-4 h-4" />
                      </div>
                   </div>
                 ))}
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
