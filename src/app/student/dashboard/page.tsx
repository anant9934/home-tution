import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, Calendar as CalendarIcon, Flame, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      {/* WELCOME BANNER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 max-w-md">
               <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Ready to crush it today?</h2>
               <p className="text-primary-light/80 mb-6 text-sm md:text-base">
                 You have 2 classes and 1 quiz scheduled for today. Keep up the great work!
               </p>
               <Button variant="secondary" className="rounded-xl font-bold border-0 shadow-sm text-primary">
                  Join Next Class
               </Button>
            </div>
         </div>
         
         <div className="bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weekly Goal</div>
              <Flame className="w-5 h-5 text-warning fill-warning/20" />
            </div>
            
            <div className="flex items-end gap-3 mb-4">
              <div className="text-4xl font-bold font-heading">4<span className="text-2xl text-muted-foreground font-normal">/5</span></div>
              <div className="text-sm text-muted-foreground mb-1">days streak</div>
            </div>
            
            <div className="flex justify-between gap-1 mt-auto">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 4 ? 'bg-success text-white shadow-sm shadow-success/30' : (i === 4 ? 'bg-primary-light border-2 border-primary text-primary' : 'bg-muted text-muted-foreground')}`}>
                      {i < 4 ? <CheckCircle2 className="w-4 h-4" /> : day}
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
                 <Card className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                         <PlayCircle className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">12:45 left</div>
                    </div>
                    <CardContent className="p-5">
                      <div className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">Physics</div>
                      <h4 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-primary transition-colors">Kinematics: Projectile Motion</h4>
                      <Progress value={65} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>65% Complete</span>
                        <span>Part 3 of 8</span>
                      </div>
                    </CardContent>
                 </Card>
                 
                 <Card className="rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 bg-success/5 flex items-center justify-center">
                         <PlayCircle className="w-12 h-12 text-success/40 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">45:00 left</div>
                    </div>
                    <CardContent className="p-5">
                      <div className="text-xs text-success font-bold mb-1 uppercase tracking-wider">Mathematics</div>
                      <h4 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-primary transition-colors">Integration & Applications</h4>
                      <Progress value={12} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>12% Complete</span>
                        <span>Part 1 of 12</span>
                      </div>
                    </CardContent>
                 </Card>
              </div>
            </section>
            
            {/* UPCOMING CLASSES */}
            <section>
              <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xl font-bold font-heading">Today's Schedule</h3>
              </div>
              
              <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                <div className="divide-y">
                   {[
                     { time: "10:00 AM", title: "Advanced Calculus Live Session", tutor: "Dr. Sarah J.", type: "Live Class", status: "Completed" },
                     { time: "04:00 PM", title: "Organic Chemistry Revision", tutor: "Prof. Arvind", type: "1-on-1 Tuition", status: "Upcoming" },
                     { time: "07:00 PM", title: "Physics Weekly Quiz", tutor: "System", type: "Test", status: "Pending" }
                   ].map((item, i) => (
                     <div key={i} className="p-5 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                        <div className="w-20 text-center shrink-0">
                           <div className="text-sm font-bold">{item.time.split(' ')[0]}</div>
                           <div className="text-xs text-muted-foreground">{item.time.split(' ')[1]}</div>
                        </div>
                        <div className="w-1 h-12 rounded-full bg-muted shrink-0 relative overflow-hidden">
                           <div className={`absolute inset-0 ${item.status === 'Completed' ? 'bg-success' : (item.status === 'Upcoming' ? 'bg-primary' : 'bg-transparent')}`}></div>
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
                           {item.status === 'Upcoming' && <Button size="sm" className="rounded-full shadow-sm">Join Now</Button>}
                           {item.status === 'Pending' && <Button variant="outline" size="sm" className="rounded-full shadow-sm">Start Test</Button>}
                           {item.status === 'Completed' && <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                        </div>
                     </div>
                   ))}
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
                  {[1, 2, 3, 4, 5].map(rank => (
                    <div key={rank} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${rank === 3 ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50 border border-transparent'}`}>
                       <div className={`w-6 text-center font-bold text-sm ${rank === 1 ? 'text-warning' : (rank === 2 ? 'text-zinc-400' : (rank === 3 ? 'text-primary' : 'text-muted-foreground'))}`}>
                         #{rank}
                       </div>
                       <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                         {rank === 3 ? 'RV' : 'U'}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className={`text-sm font-bold truncate ${rank === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                           {rank === 3 ? 'Rahul Verma (You)' : `Student ${rank}`}
                         </div>
                       </div>
                       <div className="text-xs font-bold text-primary">
                         {1500 - (rank * 100)} XP
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
                  <div className="group border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-sm">Calculus Worksheet #4</h4>
                       <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-2 py-0.5 rounded-full">Due Today</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">Submit the answers in PDF format.</p>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                         <Clock className="w-3 h-3" /> 11:59 PM
                       </span>
                       <Button size="sm" variant="secondary" className="h-7 text-xs rounded-lg font-semibold">Upload</Button>
                    </div>
                  </div>
               </div>
            </div>

         </div>
         
      </div>
    </div>
  );
}
