"use client";

import { useState } from "react";
import { CalendarCheck, LineChart, CreditCard, MessageSquare, AlertCircle, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_PARENT_DASHBOARD } from "@/lib/mock-data";

export default function ParentDashboardPage() {
  const data = MOCK_PARENT_DASHBOARD;
  const { childName, stats, performance, homework, feedback } = data;
  
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");

  const handlePayment = () => {
    setPaymentStatus("PROCESSING");
    setTimeout(() => {
      setPaymentStatus("SUCCESS");
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Overview</h1>
            <p className="text-muted-foreground mt-1">Here is how {childName.split(' ')[0]} is doing this week.</p>
         </div>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Attendance", value: stats.attendance, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", note: "Good standing" },
           { label: "Overall Grade", value: stats.overallGrade, icon: LineChart, color: "text-success", bg: "bg-success/10", note: "Top 15% in class" },
           { label: "Pending Fees", value: paymentStatus === "SUCCESS" ? "₹0" : stats.pendingFees, icon: CreditCard, color: "text-muted-foreground", bg: "bg-muted", note: paymentStatus === "SUCCESS" ? "All cleared" : "Due next week" },
           { label: "Teacher Notes", value: stats.teacherNotesCount, icon: MessageSquare, color: "text-warning", bg: "bg-warning/10", note: "Needs review" },
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
                  {performance.map((perf, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                        <div className="font-semibold text-sm">{perf.title}</div>
                        <div className={`text-sm font-bold text-${perf.color}`}>{perf.score}%</div>
                      </div>
                      <Progress value={perf.score} className={`h-2 bg-${perf.color}/20 [&>div]:bg-${perf.color}`} />
                    </div>
                  ))}
               </div>
               
               <Button variant="outline" className="w-full mt-6 rounded-xl text-sm h-10">View Detailed Report</Button>
            </div>
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                 Homework Status
               </h3>
               
               <div className="space-y-4">
                  {homework.map((hw, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 border rounded-2xl ${hw.isWarning ? 'border-warning/30 bg-warning/5' : ''}`}>
                       {hw.isWarning ? <AlertCircle className="w-8 h-8 text-warning shrink-0" /> : <FileText className="w-8 h-8 text-muted-foreground shrink-0" />}
                       <div className="flex-1">
                          <h4 className={`font-bold text-sm ${hw.isWarning ? 'text-warning-foreground' : ''}`}>{hw.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{hw.subject}</p>
                       </div>
                       <div className={`text-xs font-bold px-2 py-1 rounded-md w-fit ${hw.isWarning ? 'text-warning bg-warning/20' : 'text-success bg-success/10'}`}>
                         {hw.status}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
         </div>
         
         {/* FEEDBACK & FEES */}
         <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4">Teacher Feedback</h3>
               
               <div className="space-y-4 divide-y">
                  {feedback.map((fb, i) => (
                    <div key={i} className="pt-2 pb-4">
                       <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-sm">{fb.tutorName} <span className="text-muted-foreground font-normal text-xs ml-2">{fb.subject}</span></div>
                          <span className="text-xs text-muted-foreground">{new Date(fb.date).toLocaleDateString()}</span>
                       </div>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                         "{fb.note}"
                       </p>
                       <Button variant="link" className="px-0 h-auto text-primary mt-2 text-xs font-semibold">Reply to Teacher</Button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
               <h3 className="font-bold font-heading mb-2 relative z-10">Fee Summary</h3>
               
               {paymentStatus === "SUCCESS" ? (
                  <div className="relative z-10 bg-white p-8 rounded-2xl shadow-sm text-center mt-6">
                     <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                     </div>
                     <h4 className="text-xl font-bold font-heading mb-1">Payment Successful</h4>
                     <p className="text-sm text-muted-foreground">Thank you! Your fee of {stats.pendingFees} has been paid.</p>
                     <Button variant="outline" className="mt-6 rounded-xl text-sm" onClick={() => setPaymentStatus("IDLE")}>Download Receipt</Button>
                  </div>
               ) : (
                  <>
                     <p className="text-xs text-muted-foreground mb-6 relative z-10">Next installment due next month.</p>
                     
                     <div className="bg-white p-4 rounded-2xl shadow-sm border mb-4 relative z-10 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">{new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long', year: 'numeric' })} Installment</div>
                          <div className="font-bold text-lg">{stats.pendingFees}</div>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          Due: {new Date(new Date().setDate(10)).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                        </div>
                     </div>
                     
                     <div className="flex gap-3 relative z-10">
                        <Button 
                          onClick={handlePayment} 
                          disabled={paymentStatus === "PROCESSING"}
                          className="flex-1 rounded-xl font-semibold shadow-sm"
                        >
                          {paymentStatus === "PROCESSING" ? "Processing..." : "Pay Now"}
                        </Button>
                        <Button variant="outline" className="w-12 h-10 rounded-xl p-0 flex items-center justify-center bg-white"><Download className="w-4 h-4" /></Button>
                     </div>
                  </>
               )}
            </div>
            
         </div>

      </div>
    </div>
  );
}
