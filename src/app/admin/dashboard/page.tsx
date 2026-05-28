"use client";

import { useState } from "react";
import { Users, BookOpen, GraduationCap, DollarSign, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_ADMIN_DASHBOARD } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const data = MOCK_ADMIN_DASHBOARD;
  
  // Interactive state for pending tutors
  const [pendingTutors, setPendingTutors] = useState(data.pendingTutors);

  const handleApproveTutor = (id: string) => {
     setPendingTutors(pendingTutors.filter(t => t.id !== id));
  };

  const handleRejectTutor = (id: string) => {
     setPendingTutors(pendingTutors.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Admin Overview</h1>
            <p className="text-muted-foreground mt-1">Platform metrics and pending actions.</p>
         </div>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Revenue", value: data.stats.totalRevenue, icon: DollarSign, color: "text-success", bg: "bg-success/10" },
           { label: "Active Students", value: data.stats.activeStudents.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Verified Tutors", value: data.stats.totalTutors, icon: ShieldCheck, color: "text-warning", bg: "bg-warning/10" },
           { label: "Active Courses", value: data.stats.activeCourses, icon: BookOpen, color: "text-muted-foreground", bg: "bg-muted" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* PENDING TUTOR VERIFICATIONS */}
         <Card className="rounded-3xl shadow-sm border col-span-1">
            <CardHeader className="pb-4 border-b">
               <CardTitle className="font-heading text-lg">Pending Tutor Verifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y">
                 {pendingTutors.map((tutor) => (
                   <div key={tutor.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-muted-foreground" />
                         </div>
                         <div>
                            <div className="font-bold">{tutor.name}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">Applied: {tutor.appliedDate}</div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <Badge variant="outline" className="bg-white">{tutor.subject}</Badge>
                         <div className="flex gap-1">
                            <Button size="icon" onClick={() => handleApproveTutor(tutor.id)} className="w-8 h-8 rounded-full bg-success hover:bg-success/90 text-white shadow-sm">
                               <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" onClick={() => handleRejectTutor(tutor.id)} variant="outline" className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                               <XCircle className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {pendingTutors.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                       <ShieldCheck className="w-12 h-12 text-success/30 mx-auto mb-3" />
                       <p className="font-medium text-foreground">All tutors verified!</p>
                       <p className="text-sm">No pending applications at the moment.</p>
                    </div>
                 )}
               </div>
            </CardContent>
         </Card>
         
         {/* RECENT TRANSACTIONS */}
         <Card className="rounded-3xl shadow-sm border col-span-1">
            <CardHeader className="pb-4 border-b">
               <CardTitle className="font-heading text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y">
                 {data.recentTransactions.map((txn) => (
                   <div key={txn.id} className="p-6 flex items-center justify-between">
                      <div>
                         <div className="font-bold">{txn.user}</div>
                         <div className="text-sm text-muted-foreground mt-0.5">{txn.date}</div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-success">{txn.amount}</div>
                         <div className="text-xs font-semibold px-2 py-0.5 mt-1 rounded-md bg-success/10 text-success inline-block">
                           {txn.status}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
               <div className="p-4 border-t text-center">
                  <Button variant="link" className="text-primary font-semibold text-sm">View All Transactions</Button>
               </div>
            </CardContent>
         </Card>

      </div>
    </div>
  );
}
