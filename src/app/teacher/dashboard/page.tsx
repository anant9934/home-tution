"use client";

import { useState, useEffect } from "react";
import { Users, Clock, IndianRupee, Star, Calendar, Video, CheckCircle2, XCircle, Mic, MicOff, Camera, CameraOff, MonitorUp, Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function TeacherDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals State
  const [activeMeeting, setActiveMeeting] = useState<any | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Virtual Classroom State
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);

  // New Class Form State
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassTime, setNewClassTime] = useState("");
  const [newClassStudent, setNewClassStudent] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await fetchApi("/tutors/dashboard");
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Failed to load teacher dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleAction = async (req: any, action: "approve" | "reject") => {
     try {
        const status = action === "approve" ? "CONFIRMED" : "REJECTED";
        await fetchApi(`/tutors/bookings/${req.bookingId}/status`, {
           method: "PATCH",
           body: JSON.stringify({ status })
        });
        
        if (action === "approve") {
           toast.success("Demo request approved!");
           // Refresh dashboard data to reflect the new schedule
           const dashboardData = await fetchApi("/tutors/dashboard");
           setData(dashboardData);
        } else {
           toast.error("Demo request rejected.");
           setData((prev: any) => ({
             ...prev,
             actionRequired: prev.actionRequired.filter((r: any) => r.id !== req.id)
           }));
        }
     } catch (err: any) {
        toast.error(err.message || "Failed to process request");
     }
  };

  const handleScheduleClass = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
        await fetchApi("/tutors/bookings", {
           method: "POST",
           body: JSON.stringify({
              title: newClassSubject || "Extra Class",
              studentName: newClassStudent || "Batch A",
              time: newClassTime || "Tomorrow, 10:00 AM"
           })
        });
        
        setShowScheduleModal(false);
        setNewClassSubject("");
        setNewClassTime("");
        setNewClassStudent("");
        toast.success("Extra class scheduled successfully!");
        
        // Refresh schedule
        const dashboardData = await fetchApi("/tutors/dashboard");
        setData(dashboardData);
     } catch (err: any) {
        toast.error(err.message || "Failed to schedule class");
     }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
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
      
      {/* VIRTUAL CLASSROOM MODAL */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-in fade-in duration-200">
           {/* Header */}
           <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 text-white">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <div className="font-bold font-heading">{activeMeeting.title || activeMeeting.subject}</div>
                    <div className="text-xs text-white/60">with {activeMeeting.student || "Student"}</div>
                 </div>
                 <Badge variant="outline" className="border-red-500 text-red-500 animate-pulse ml-2 bg-red-500/10">● REC</Badge>
              </div>
              <div className="text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full">00:04:12</div>
           </div>
           
           {/* Video Grid */}
           <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 justify-center items-center">
              {/* Student Screen (Large for Teacher) */}
              <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=1200" alt="Student" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 font-medium">
                    {activeMeeting.student || "Student"}
                 </div>
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/80 p-2 rounded-lg border border-white/10">
                    <Mic className="w-4 h-4" />
                 </div>
              </div>
              
              {/* Teacher Screen (Small) */}
              <div className="relative w-48 md:w-64 aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-white/20 shadow-xl md:self-end">
                 {camOn ? (
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="You" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                       <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl">Dr</div>
                    </div>
                 )}
                 <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md border border-white/10">
                    You
                 </div>
                 {!micOn && (
                    <div className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-md text-white p-1 rounded-md">
                       <MicOff className="w-3 h-3" />
                    </div>
                 )}
              </div>
           </div>
           
           {/* Controls Bottom Bar */}
           <div className="h-24 border-t border-white/10 flex items-center justify-center gap-4">
              <Button 
                variant={micOn ? "secondary" : "destructive"} 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setMicOn(!micOn)}
              >
                 {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button 
                variant={camOn ? "secondary" : "destructive"} 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setCamOn(!camOn)}
              >
                 {camOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </Button>
              <Button variant="secondary" size="icon" className="w-12 h-12 rounded-full">
                 <MonitorUp className="w-5 h-5" />
              </Button>
              <Button variant="destructive" className="h-12 px-8 rounded-full font-bold ml-4 shadow-lg shadow-destructive/20" onClick={() => setActiveMeeting(null)}>
                 End Class
              </Button>
           </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold font-heading text-lg">Schedule Extra Class</h3>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowScheduleModal(false)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleScheduleClass} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Subject / Topic</label>
                    <Input 
                       required 
                       placeholder="e.g. Advanced Calculus Review" 
                       value={newClassSubject} 
                       onChange={e => setNewClassSubject(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Student / Batch</label>
                    <Input 
                       required 
                       placeholder="e.g. Batch B" 
                       value={newClassStudent} 
                       onChange={e => setNewClassStudent(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Time</label>
                    <Input 
                       required 
                       placeholder="e.g. Tomorrow, 5:00 PM" 
                       value={newClassTime} 
                       onChange={e => setNewClassTime(e.target.value)} 
                    />
                 </div>
                 <Button type="submit" className="w-full font-bold mt-4">Schedule Class</Button>
              </form>
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {data.tutor.name}. Here's your overview.</p>
         </div>
         <Button onClick={() => setShowScheduleModal(true)} className="rounded-full font-bold shadow-sm gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Schedule Extra Class
         </Button>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Active Students", value: data.stats.totalStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Today's Classes", value: data.stats.todaysClasses, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
           { label: "Earnings (Month)", value: data.stats.monthlyEarnings, icon: IndianRupee, color: "text-success", bg: "bg-success/10" },
           { label: "Pending Tasks", value: data.stats.pendingTasksCount, icon: Star, color: "text-primary", bg: "bg-primary/10" },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm transition-all duration-300">
             <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold font-heading mb-1">{stat.value}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: SCHEDULE */}
         <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold font-heading flex items-center gap-2">
                     <Calendar className="w-5 h-5 text-primary" /> Today's Schedule
                  </h3>
                  <Button variant="link" className="text-primary font-semibold text-sm px-0">View Calendar</Button>
               </div>
               
               <div className="space-y-4">
                  {data.schedule.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">You have no classes scheduled for today.</p>
                  ) : (
                    data.schedule.map((cls: any, i: number) => (
                       <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-2xl bg-slate-50 animate-in slide-in-from-bottom-4 fade-in duration-300" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
                          <div className="flex items-start gap-4">
                             <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0">
                                <Video className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                                <div className="font-bold">{cls.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                   {new Date(cls.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                   {cls.student ? ` • ${cls.student}` : ''}
                                </div>
                             </div>
                          </div>
                          <Button onClick={() => setActiveMeeting(cls)} className="shrink-0 rounded-xl">Start Class</Button>
                       </div>
                    ))
                  )}
               </div>
            </div>

            {/* REVENUE CHART UI */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-6">Revenue Overview</h3>
               <div className="h-64 flex items-end justify-between gap-2 border-b border-l pb-2 pl-2">
                  {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-success/20 rounded-t-md hover:bg-success/40 transition-colors relative group cursor-pointer" style={{ height: `${h}%` }}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                         ₹{(h * 100).toLocaleString()}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 text-xs text-muted-foreground px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
            
         </div>
         
         {/* RIGHT COLUMN: PENDING TASKS */}
         <div className="space-y-8">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4">Pending Actions</h3>
               
               <div className="space-y-4 overflow-hidden">
                  {data.actionRequired.map((req: any) => (
                    <div key={req.id} className="p-4 border rounded-2xl bg-white transition-all duration-300">
                       <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-sm">{req.title}</div>
                          <Badge variant="outline" className={req.type === 'Demo' ? 'bg-warning/5 text-warning border-warning/20' : 'bg-primary/5 text-primary border-primary/20'}>{req.type}</Badge>
                       </div>
                       <div className="text-xs text-muted-foreground mb-4">{req.desc}</div>
                       
                       <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAction(req, "approve")} className="flex-1 rounded-xl gap-1 bg-success hover:bg-success/90 text-white">
                             <CheckCircle2 className="w-4 h-4" /> Accept
                          </Button>
                          <Button size="sm" onClick={() => handleAction(req, "reject")} variant="outline" className="rounded-xl px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                             <XCircle className="w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
                  
                  {data.actionRequired.length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed rounded-2xl animate-in fade-in zoom-in-95 duration-500">
                        <CheckCircle2 className="w-8 h-8 text-success/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">All caught up! No pending requests.</p>
                     </div>
                  )}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
