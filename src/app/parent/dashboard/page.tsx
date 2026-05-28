"use client";

import { useState } from "react";
import { CalendarCheck, LineChart, CreditCard, MessageSquare, AlertCircle, FileText, Download, CheckCircle2, X, Send, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_PARENT_DASHBOARD } from "@/lib/mock-data";

export default function ParentDashboardPage() {
  const data = MOCK_PARENT_DASHBOARD;
  const { childName, stats, performance, homework, feedback } = data;
  
  // Payment State
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");
  const [downloading, setDownloading] = useState(false);

  // Modals State
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReport, setShowReport] = useState(false);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePayment = () => {
    setPaymentStatus("PROCESSING");
    setTimeout(() => {
      setPaymentStatus("SUCCESS");
    }, 1500);
  };

  const handleDownload = () => {
     setDownloading(true);
     setTimeout(() => {
        setDownloading(false);
        setToastMessage("Receipt downloaded successfully.");
        setTimeout(() => setToastMessage(null), 3000);
     }, 1000);
  };

  const handleSendReply = (e: React.FormEvent) => {
     e.preventDefault();
     setReplyingTo(null);
     setReplyText("");
     setToastMessage("Message sent successfully!");
     setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8 relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
         <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">{toastMessage}</span>
         </div>
      )}

      {/* MESSAGE MODAL */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div>
                    <h3 className="font-bold font-heading text-lg">Message Teacher</h3>
                    <p className="text-xs text-muted-foreground">To: {replyingTo}</p>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setReplyingTo(null)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleSendReply} className="p-6">
                 <textarea 
                    autoFocus
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full h-32 p-4 rounded-xl border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none mb-4"
                 />
                 <Button type="submit" className="w-full font-bold gap-2">
                    <Send className="w-4 h-4" /> Send Message
                 </Button>
              </form>
           </div>
        </div>
      )}

      {/* DETAILED REPORT MODAL */}
      {showReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                       <BarChart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <h3 className="font-bold font-heading text-lg">{childName}'s Performance Report</h3>
                       <p className="text-xs text-muted-foreground">Term 2 Analytics</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowReport(false)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              
              <div className="p-8 space-y-8">
                 {/* Overall Score */}
                 <div className="flex items-center gap-6 p-6 border rounded-2xl bg-success/5">
                    <div className="w-24 h-24 rounded-full border-4 border-success flex items-center justify-center shrink-0">
                       <span className="text-3xl font-bold font-heading text-success">91%</span>
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">Excellent Progress</h4>
                       <p className="text-sm text-muted-foreground mt-1">Alex is performing in the top 10% of their cohort. Consistent improvement seen in Science subjects.</p>
                    </div>
                 </div>
                 
                 {/* Subject Breakdown */}
                 <div>
                    <h4 className="font-bold font-heading mb-4">Subject Breakdown</h4>
                    <div className="space-y-6">
                       {performance.map((perf, i) => (
                         <div key={i}>
                           <div className="flex justify-between items-end mb-2">
                             <div className="font-semibold text-sm">{perf.title}</div>
                             <div className={`text-sm font-bold text-${perf.color}`}>{perf.score}%</div>
                           </div>
                           <Progress value={perf.score} className={`h-3 bg-${perf.color}/20 [&>div]:bg-${perf.color}`} />
                         </div>
                       ))}
                       {/* Add a few extra mock subjects for the modal */}
                       <div>
                           <div className="flex justify-between items-end mb-2">
                             <div className="font-semibold text-sm">English Literature</div>
                             <div className={`text-sm font-bold text-warning`}>78%</div>
                           </div>
                           <Progress value={78} className={`h-3 bg-warning/20 [&>div]:bg-warning`} />
                       </div>
                    </div>
                 </div>
                 
                 <Button className="w-full" variant="outline" onClick={() => setShowReport(false)}>Close Report</Button>
              </div>
           </div>
        </div>
      )}


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
           <Card key={i} className="rounded-2xl border shadow-sm transition-all">
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
               
               <Button variant="outline" className="w-full mt-6 rounded-xl text-sm h-10" onClick={() => setShowReport(true)}>
                  View Detailed Report
               </Button>
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
                       <Button 
                          variant="link" 
                          className="px-0 h-auto text-primary mt-2 text-xs font-semibold"
                          onClick={() => setReplyingTo(fb.tutorName)}
                       >
                          Reply to Teacher
                       </Button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden transition-all duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
               <h3 className="font-bold font-heading mb-2 relative z-10">Fee Summary</h3>
               
               {paymentStatus === "SUCCESS" ? (
                  <div className="relative z-10 bg-white p-8 rounded-2xl shadow-sm text-center mt-6 animate-in zoom-in-95 duration-300">
                     <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
                        <CheckCircle2 className="w-8 h-8 text-success relative z-10" />
                     </div>
                     <h4 className="text-xl font-bold font-heading mb-1">Payment Successful</h4>
                     <p className="text-sm text-muted-foreground">Thank you! Your fee of {stats.pendingFees} has been paid.</p>
                     <Button 
                        variant="outline" 
                        className="mt-6 rounded-xl text-sm gap-2" 
                        onClick={handleDownload}
                        disabled={downloading}
                     >
                        {downloading ? "Downloading..." : <><Download className="w-4 h-4" /> Download Receipt</>}
                     </Button>
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
                          className="flex-1 rounded-xl font-semibold shadow-sm transition-all"
                        >
                          {paymentStatus === "PROCESSING" ? "Processing securely..." : "Pay Now"}
                        </Button>
                     </div>
                  </>
               )}
            </div>
            
         </div>

      </div>
    </div>
  );
}
