"use client";

import { CalendarCheck, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentAttendancePage() {
  const presentDays = 42;
  const totalDays = 45;
  const percentage = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      <div>
         <h1 className="text-3xl font-bold font-heading">Attendance</h1>
         <p className="text-muted-foreground mt-1">Track your class presence and upcoming schedules.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="rounded-3xl border shadow-sm border-success/20 bg-success/5">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-success/20 text-success flex items-center justify-center">
                     <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">Attendance Rate</h3>
               </div>
               <div className="text-4xl font-bold font-heading text-success">{percentage}%</div>
               <p className="text-xs text-muted-foreground mt-2">Excellent standing</p>
            </CardContent>
         </Card>
         
         <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
               <h3 className="font-semibold text-muted-foreground mb-2">Classes Attended</h3>
               <div className="text-3xl font-bold font-heading">{presentDays} <span className="text-lg text-muted-foreground font-normal">/ {totalDays}</span></div>
               <p className="text-xs text-muted-foreground mt-2">This semester</p>
            </CardContent>
         </Card>
         
         <Card className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
               <h3 className="font-semibold text-muted-foreground mb-2">Absences</h3>
               <div className="text-3xl font-bold font-heading text-destructive">3</div>
               <p className="text-xs text-muted-foreground mt-2">2 excused, 1 unexcused</p>
            </CardContent>
         </Card>
      </div>

      {/* Recent Records List */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
         <h3 className="font-bold font-heading mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Recent Records
         </h3>
         <div className="space-y-4">
            {[
               { date: "Today", subject: "Mathematics", status: "Present", teacher: "Dr. Sarah Jenkins" },
               { date: "Yesterday", subject: "Physics", status: "Present", teacher: "Rohit Verma" },
               { date: "Monday, May 25", subject: "Chemistry", status: "Absent", type: "Excused", teacher: "Anita Desai" },
               { date: "Friday, May 22", subject: "Computer Science", status: "Present", teacher: "Arjun Mehta" },
               { date: "Thursday, May 21", subject: "Mathematics", status: "Present", teacher: "Dr. Sarah Jenkins" },
            ].map((record, i) => (
               <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.status === 'Present' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {record.status === "Present" ? <CalendarCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     </div>
                     <div>
                        <h4 className="font-bold">{record.subject}</h4>
                        <div className="text-sm text-muted-foreground mt-0.5">{record.date} • {record.teacher}</div>
                     </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                     <Badge className={record.status === 'Present' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}>{record.status}</Badge>
                     {record.type && <span className="text-xs text-muted-foreground font-semibold px-2 border rounded-full">{record.type}</span>}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
