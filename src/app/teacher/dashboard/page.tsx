"use client";

import { useState } from "react";
import { Users, Clock, IndianRupee, Star, Calendar, Video, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_TEACHER_DASHBOARD } from "@/lib/mock-data";

export default function TeacherDashboardPage() {
  const data = MOCK_TEACHER_DASHBOARD;
  
  // Interactive state for pending demo requests
  const [demoRequests, setDemoRequests] = useState(data.pendingDemoRequests);
  
  const handleAction = (id: number, action: "approve" | "reject") => {
     setDemoRequests(demoRequests.filter(req => req.id !== id));
     // We could show a toast here in a real app
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {data.teacherName}. Here's your overview.</p>
         </div>
         <Button className="rounded-full font-bold shadow-sm">+ Schedule Extra Class</Button>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Active Students", value: data.stats.activeStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Hours Taught", value: data.stats.hoursTaughtThisMonth, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
           { label: "Earnings (Month)", value: data.stats.earningsThisMonth, icon: IndianRupee, color: "text-success", bg: "bg-success/10" },
           { label: "Overall Rating", value: data.stats.rating, icon: Star, color: "text-primary", bg: "bg-primary/10" },
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
                  {data.upcomingSchedule.map((cls) => (
                     <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-2xl bg-slate-50">
                        <div className="flex items-start gap-4">
                           <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center shrink-0">
                              <Video className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                              <div className="font-bold">{cls.subject}</div>
                              <div className="text-sm text-muted-foreground mt-1">{cls.time} • {cls.student}</div>
                           </div>
                        </div>
                        <Button className="shrink-0 rounded-xl">Start Class</Button>
                     </div>
                  ))}
               </div>
            </div>

            {/* MOCK REVENUE CHART UI */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-6">Revenue Overview</h3>
               <div className="h-64 flex items-end justify-between gap-2 border-b border-l pb-2 pl-2">
                  {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-success/20 rounded-t-md hover:bg-success/40 transition-colors relative group" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₹{(h * 1000).toLocaleString()}</div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
            
         </div>
         
         {/* RIGHT COLUMN: PENDING DEMOS & REVIEWS */}
         <div className="space-y-8">
            
            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4">Pending Demo Requests</h3>
               
               <div className="space-y-4">
                  {demoRequests.map((req) => (
                    <div key={req.id} className="p-4 border rounded-2xl">
                       <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-sm">{req.student}</div>
                          <Badge variant="outline" className="bg-warning/5 text-warning border-warning/20">{req.subject}</Badge>
                       </div>
                       <div className="text-xs text-muted-foreground mb-4">Requested: {req.requestedTime}</div>
                       
                       <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAction(req.id, "approve")} className="flex-1 rounded-xl gap-1 bg-success hover:bg-success/90 text-white">
                             <CheckCircle2 className="w-4 h-4" /> Accept
                          </Button>
                          <Button size="sm" onClick={() => handleAction(req.id, "reject")} variant="outline" className="rounded-xl px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                             <XCircle className="w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
                  
                  {demoRequests.length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed rounded-2xl">
                        <CheckCircle2 className="w-8 h-8 text-success/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">All caught up! No pending requests.</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-6">
               <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" /> Recent Reviews
               </h3>
               <div className="space-y-4 divide-y">
                  {data.recentReviews.map((rev, i) => (
                     <div key={i} className="pt-3 first:pt-0">
                        <div className="flex justify-between items-center mb-1">
                           <div className="font-bold text-sm">{rev.student}</div>
                           <div className="flex">
                              {[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < rev.rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />)}
                           </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">"{rev.comment}"</p>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
