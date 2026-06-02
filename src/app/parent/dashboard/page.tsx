"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, LineChart, CreditCard, MessageSquare, AlertCircle, FileText, CheckCircle2, X, Send, BarChart, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChildSelector } from "@/components/ChildSelector";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface DashboardData {
  childName: string;
  children: { id: string; name: string; class: string; board: string }[];
  stats: { attendance: string; overallGrade: string; pendingFees: string; teacherNotesCount: number };
  performance: { title: string; score: number; color: string }[];
  homework: { title: string; subject: string; status: string; isWarning: boolean; marks?: number | null; maxMarks?: number }[];
  feedback: { tutorUserId: string | null; tutorName: string; subject: string; date: string; note: string }[];
  upcomingClasses: { id: string; title: string; time: string; tutor: string; meetingLink?: string }[];
}

export default function ParentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");

  // Modals State
  const [replyingTo, setReplyingTo] = useState<{ name: string; tutorUserId: string | null } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [selectedChildId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const query = selectedChildId ? `?childId=${selectedChildId}` : "";
      const result = await fetchApi(`/parents/dashboard${query}`);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentStatus("PROCESSING");
    try {
      const feesData = await fetchApi(`/parents/fees${selectedChildId ? `?childId=${selectedChildId}` : ""}`);
      const pendingFee = feesData?.fees?.find((f: any) => f.status === "PENDING");
      if (!pendingFee) {
        toast.error("No pending fees found");
        setPaymentStatus("IDLE");
        return;
      }
      const result = await fetchApi(`/parents/fees/${pendingFee.id}/pay`, { method: "POST" });
      setPaymentStatus("SUCCESS");
      toast.success(`Payment successful! Transaction: ${result.transactionId}`);
      setTimeout(() => {
        setPaymentStatus("IDLE");
        loadDashboard();
      }, 3000);
    } catch (err: any) {
      toast.error(err.message);
      setPaymentStatus("IDLE");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;

    if (!replyingTo.tutorUserId) {
      toast.error("Cannot identify the teacher. Please use the Messages page to send a message.");
      return;
    }

    setSendingReply(true);
    try {
      await fetchApi("/parents/messages", {
        method: "POST",
        body: JSON.stringify({
          tutorUserId: replyingTo.tutorUserId,
          messageText: replyText,
        }),
      });
      toast.success("Message sent successfully!");
      setReplyingTo(null);
      setReplyText("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSendingReply(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="rounded-2xl"><CardContent className="p-5 space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-24" />
            </CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold font-heading mb-2">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{error || "Something went wrong. Please try again."}</p>
        <Button onClick={loadDashboard} className="rounded-xl">Try Again</Button>
      </div>
    );
  }

  const { childName, stats, performance, homework, feedback, upcomingClasses } = data;

  return (
    <div className="space-y-8 pb-20 lg:pb-8 relative min-h-screen mesh-bg p-4 lg:p-8 rounded-3xl">

      {/* MESSAGE MODAL */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <div>
                    <h3 className="font-bold font-heading text-lg">Message Teacher</h3>
                    <p className="text-xs text-muted-foreground">To: {replyingTo.name}</p>
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
                 <Button type="submit" className="w-full font-bold gap-2" disabled={sendingReply}>
                    {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sendingReply ? "Sending..." : "Send Message"}
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
                       <h3 className="font-bold font-heading text-lg">{childName}&apos;s Performance Report</h3>
                       <p className="text-xs text-muted-foreground">Subject-wise Analytics</p>
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
                       <span className="text-3xl font-bold font-heading text-success">
                         {performance.length > 0 ? Math.round(performance.reduce((s, p) => s + p.score, 0) / performance.length) : 0}%
                       </span>
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">
                         {(() => {
                           const avg = performance.length > 0 ? performance.reduce((s, p) => s + p.score, 0) / performance.length : 0;
                           return avg >= 85 ? "Excellent Progress" : avg >= 70 ? "Good Progress" : "Needs Improvement";
                         })()}
                       </h4>
                       <p className="text-sm text-muted-foreground mt-1">
                         {childName} is performing across {performance.length} subjects. Keep encouraging consistent study habits.
                       </p>
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
                             <div className={`text-sm font-bold ${perf.color === 'success' ? 'text-green-600' : perf.color === 'primary' ? 'text-blue-600' : 'text-amber-600'}`}>{perf.score}%</div>
                           </div>
                           <Progress value={perf.score} className="h-3" />
                         </div>
                       ))}
                    </div>
                 </div>

                 <Button className="w-full" variant="outline" onClick={() => setShowReport(false)}>Close Report</Button>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold font-heading">Overview</h1>
            <p className="text-muted-foreground mt-1">Here is how {childName.split(' ')[0]} is doing this week.</p>
         </div>
         <ChildSelector
           selectedChildId={selectedChildId}
           onSelect={(id) => {
             setSelectedChildId(id);
             setPaymentStatus("IDLE");
           }}
         />
      </div>

      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
         {[
           { label: "Attendance", value: stats.attendance, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", note: parseInt(stats.attendance) >= 85 ? "Good standing" : "Needs improvement" },
           { label: "Overall Grade", value: stats.overallGrade, icon: LineChart, color: "text-green-600", bg: "bg-green-500/10", note: `Based on ${performance.length} subjects` },
           { label: "Pending Fees", value: paymentStatus === "SUCCESS" ? "₹0" : stats.pendingFees, icon: CreditCard, color: "text-muted-foreground", bg: "bg-muted/50", note: paymentStatus === "SUCCESS" ? "All cleared" : stats.pendingFees === "₹0" ? "All clear" : "Due this month" },
           { label: "Messages", value: stats.teacherNotesCount, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-500/10", note: stats.teacherNotesCount > 0 ? "Unread messages" : "All read" },
         ].map((stat, i) => (
           <div key={i} className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
              </div>
              <div className="text-2xl font-bold font-heading mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.note}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

         {/* PERFORMANCE & HOMEWORK */}
         <div className="space-y-6">

            <div className="glass-card rounded-3xl p-6">
               <h3 className="font-bold font-heading mb-6">Recent Performance</h3>

               {performance.length > 0 ? (
                 <div className="space-y-6">
                    {performance.map((perf, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <div className="font-semibold text-sm">{perf.title}</div>
                          <div className={`text-sm font-bold ${perf.color === 'success' ? 'text-green-600' : perf.color === 'primary' ? 'text-blue-600' : 'text-amber-600'}`}>{perf.score}%</div>
                        </div>
                        <Progress value={perf.score} className="h-2 bg-white/50" />
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground text-center py-6">No performance data yet.</p>
               )}

               <Button variant="outline" className="w-full mt-6 rounded-xl text-sm h-10 bg-white/50 hover:bg-white/80 border-white/40" onClick={() => setShowReport(true)}>
                  View Detailed Report
               </Button>
            </div>

            <div className="glass-card rounded-3xl p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                 Homework Status
               </h3>

               {homework.length > 0 ? (
                 <div className="space-y-4">
                    {homework.map((hw, i) => (
                      <div key={i} className={`flex items-start gap-4 p-4 border border-white/20 rounded-2xl transition-all hover-lift ${hw.isWarning ? 'border-amber-200 bg-amber-500/10' : 'bg-white/40'}`}>
                         {hw.isWarning ? <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" /> : <FileText className="w-8 h-8 text-muted-foreground shrink-0" />}
                         <div className="flex-1">
                            <h4 className="font-bold text-sm">{hw.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{hw.subject}</p>
                         </div>
                         <div className={`text-xs font-bold px-2 py-1 rounded-md w-fit ${hw.isWarning ? 'text-amber-700 bg-amber-100' : 'text-green-700 bg-green-100'}`}>
                           {hw.status}
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground text-center py-6">No homework data yet.</p>
               )}
            </div>

            {/* Upcoming Classes */}
            {upcomingClasses && upcomingClasses.length > 0 && (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Upcoming Classes
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-4 rounded-2xl border border-white/30 bg-white/50 relative overflow-hidden group hover-lift">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-1.5 transition-all"></div>
                      <h4 className="font-bold text-sm mb-1">{cls.title}</h4>
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(cls.time).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(cls.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {cls.tutor}
                      </div>
                      {cls.meetingLink && (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Join Class →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

         </div>

         {/* FEEDBACK & FEES */}
         <div className="space-y-6">

            <div className="glass-card rounded-3xl p-6">
               <h3 className="font-bold font-heading mb-4">Teacher Feedback</h3>

               {feedback.length > 0 ? (
                 <div className="space-y-4 divide-y divide-white/20">
                    {feedback.map((fb, i) => (
                      <div key={i} className="pt-2 pb-4">
                         <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-sm">{fb.tutorName} <span className="text-muted-foreground font-normal text-xs ml-2">{fb.subject}</span></div>
                            <span className="text-xs text-muted-foreground">{new Date(fb.date).toLocaleDateString()}</span>
                         </div>
                         <p className="text-sm text-muted-foreground leading-relaxed bg-white/30 p-3 rounded-xl mt-2">
                           &quot;{fb.note}&quot;
                         </p>
                         {fb.tutorUserId ? (
                           <Button
                              variant="link"
                              className="px-0 h-auto text-primary mt-2 text-xs font-semibold"
                              onClick={() => setReplyingTo({ name: fb.tutorName, tutorUserId: fb.tutorUserId })}
                           >
                              Reply to Teacher
                           </Button>
                         ) : (
                           <p className="text-xs text-muted-foreground mt-2 italic">Go to Messages to reply</p>
                         )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground text-center py-6">No feedback yet.</p>
               )}
            </div>

            <div className="glass-card-premium rounded-3xl p-6 relative overflow-hidden transition-all duration-500">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
               <h3 className="font-bold font-heading mb-2 relative z-10">Fee Summary</h3>

               {paymentStatus === "SUCCESS" ? (
                  <div className="relative z-10 bg-white/80 p-8 rounded-2xl shadow-sm text-center mt-6 animate-in zoom-in-95 duration-300">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
                        <CheckCircle2 className="w-8 h-8 text-green-600 relative z-10" />
                     </div>
                     <h4 className="text-xl font-bold font-heading mb-1">Payment Successful</h4>
                     <p className="text-sm text-muted-foreground">Thank you! Your fee has been paid.</p>
                  </div>
               ) : (
                  <>
                     <p className="text-xs text-muted-foreground mb-6 relative z-10">Current fee status for {childName.split(' ')[0]}.</p>

                     <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm mb-4 relative z-10 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium mb-1">Outstanding Amount</div>
                          <div className="font-bold text-lg text-primary">{stats.pendingFees}</div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-md shadow-sm ${stats.pendingFees === '₹0' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'}`}>
                          {stats.pendingFees === "₹0" ? "All Clear" : "Pending"}
                        </div>
                     </div>

                     {stats.pendingFees !== "₹0" && (
                       <div className="flex gap-3 relative z-10">
                          <Button
                            onClick={handlePayment}
                            disabled={paymentStatus === "PROCESSING"}
                            className="flex-1 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                          >
                            {paymentStatus === "PROCESSING" ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</>
                            ) : "Pay Now"}
                          </Button>
                       </div>
                     )}
                  </>
               )}
            </div>

         </div>

      </div>
    </div>
  );
}
