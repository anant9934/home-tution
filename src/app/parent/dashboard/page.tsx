import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck, CreditCard, LineChart, MessageSquare, AlertCircle, FileText, Download } from "lucide-react";

export default function ParentDashboardPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Overview</h1>
            <p className="text-muted-foreground mt-1">Here is how Rahul is doing this week.</p>
         </div>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Attendance", value: "92%", icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", note: "Good standing" },
           { label: "Overall Grade", value: "A-", icon: LineChart, color: "text-success", bg: "bg-success/10", note: "Top 15% in class" },
           { label: "Pending Fees", value: "₹0", icon: CreditCard, color: "text-muted-foreground", bg: "bg-muted", note: "All cleared" },
           { label: "Teacher Notes", value: "2", icon: MessageSquare, color: "text-warning", bg: "bg-warning/10", note: "Needs review" },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm">
             <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold font-heading mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.note}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* PERFORMANCE & HOMEWORK */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-6">Recent Performance</h3>
               
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm">Mathematics Test #3</div>
                      <div className="text-sm font-bold text-success">85%</div>
                    </div>
                    <Progress value={85} className="h-2 bg-success/20 [&>div]:bg-success" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm">Physics Mid-Term</div>
                      <div className="text-sm font-bold text-warning">72%</div>
                    </div>
                    <Progress value={72} className="h-2 bg-warning/20 [&>div]:bg-warning" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm">Chemistry Quiz</div>
                      <div className="text-sm font-bold text-primary">90%</div>
                    </div>
                    <Progress value={90} className="h-2 bg-primary/20 [&>div]:bg-primary" />
                  </div>
               </div>
               
               <Button variant="outline" className="w-full mt-6 rounded-xl text-sm h-10">View Detailed Report</Button>
            </div>
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                 Homework Status
               </h3>
               
               <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-2xl">
                     <FileText className="w-8 h-8 text-muted-foreground shrink-0" />
                     <div className="flex-1">
                        <h4 className="font-bold text-sm">Trigonometry Assignment</h4>
                        <p className="text-xs text-muted-foreground mt-1">Mathematics</p>
                     </div>
                     <div className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">Completed</div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 border border-warning/30 bg-warning/5 rounded-2xl">
                     <AlertCircle className="w-8 h-8 text-warning shrink-0" />
                     <div className="flex-1">
                        <h4 className="font-bold text-sm text-warning-foreground">Physics Project</h4>
                        <p className="text-xs text-muted-foreground mt-1">Due tomorrow at 10 AM</p>
                     </div>
                     <div className="text-xs font-bold text-warning bg-warning/20 px-2 py-1 rounded-md">Pending</div>
                  </div>
               </div>
            </div>
            
         </div>
         
         {/* FEEDBACK & FEES */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4">Teacher Feedback</h3>
               
               <div className="space-y-4 divide-y">
                  <div className="pt-2 pb-4">
                     <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm">Dr. Sarah J. <span className="text-muted-foreground font-normal text-xs ml-2">Math Tutor</span></div>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                       Rahul has shown great improvement in Calculus over the last few weeks. He is actively participating in live classes. I recommend spending an extra hour on Integration concepts this weekend.
                     </p>
                     <Button variant="link" className="px-0 h-auto text-primary mt-2 text-xs font-semibold">Reply to Dr. Sarah</Button>
                  </div>
               </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
               <h3 className="font-bold font-heading mb-2 relative z-10">Fee Summary</h3>
               <p className="text-xs text-muted-foreground mb-6 relative z-10">Next installment due next month.</p>
               
               <div className="bg-white p-4 rounded-2xl shadow-sm border mb-4 relative z-10 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-1">June 2026 Installment</div>
                    <div className="font-bold text-lg">₹4,500</div>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">Due: Jun 10</div>
               </div>
               
               <div className="flex gap-3 relative z-10">
                  <Button className="flex-1 rounded-xl font-semibold shadow-sm">Pay Now</Button>
                  <Button variant="outline" className="w-12 h-10 rounded-xl p-0 flex items-center justify-center bg-white"><Download className="w-4 h-4" /></Button>
               </div>
            </div>
            
         </div>

      </div>
    </div>
  );
}
