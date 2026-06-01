"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChildSelector } from "@/components/ChildSelector";
import { fetchApi } from "@/lib/api";

interface AttendanceData {
  childName: string;
  summary: { total: number; present: number; absent: number; late: number; percentage: number };
  records: { id: string; date: string; status: string; tutor: string; subject: string }[];
}

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const query = selectedChildId ? `?childId=${selectedChildId}` : "";
    fetchApi(`/parents/attendance${query}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedChildId]);

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load attendance</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const { childName, summary, records } = data;
  const percentageColor = summary.percentage >= 85 ? "text-green-600" : summary.percentage >= 70 ? "text-amber-600" : "text-red-600";

  // Group records by month
  const groupedByMonth: Record<string, typeof records> = {};
  records.forEach((r) => {
    const monthKey = new Date(r.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
    groupedByMonth[monthKey].push(r);
  });

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Attendance</h1>
          <p className="text-muted-foreground mt-1">{childName}&apos;s class attendance record.</p>
        </div>
        <ChildSelector selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className={`text-3xl font-bold font-heading ${percentageColor}`}>{summary.percentage}%</div>
            <p className="text-sm text-muted-foreground mt-1">Overall</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold font-heading text-green-600">{summary.present}</span>
            </div>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold font-heading text-red-500">{summary.absent}</span>
            </div>
            <p className="text-sm text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold font-heading text-amber-500">{summary.late}</span>
            </div>
            <p className="text-sm text-muted-foreground">Late</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress Bar */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary" /> Attendance Overview
        </h3>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(summary.present / Math.max(summary.total, 1)) * 100}%` }} />
          <div className="absolute top-0 bottom-0 bg-amber-400 rounded-full transition-all duration-500" style={{ left: `${(summary.present / Math.max(summary.total, 1)) * 100}%`, width: `${(summary.late / Math.max(summary.total, 1)) * 100}%` }} />
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full" /> Present ({summary.present})</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full" /> Late ({summary.late})</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-200 rounded-full" /> Absent ({summary.absent})</span>
        </div>
      </div>

      {/* Records by Month */}
      {records.length === 0 ? (
        <div className="bg-white rounded-3xl border shadow-sm p-12 text-center">
          <CalendarCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold font-heading text-lg mb-2">No Attendance Records</h3>
          <p className="text-muted-foreground text-sm">Attendance records will appear here once classes begin.</p>
        </div>
      ) : (
        Object.entries(groupedByMonth).map(([month, monthRecords]) => (
          <div key={month} className="bg-white rounded-3xl border shadow-sm p-6">
            <h3 className="font-bold font-heading mb-4">{month}</h3>
            <div className="space-y-3">
              {monthRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl border hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      record.status === "PRESENT" ? "bg-green-50" : record.status === "LATE" ? "bg-amber-50" : "bg-red-50"
                    }`}>
                      {record.status === "PRESENT" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : record.status === "LATE" ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {new Date(record.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                      <p className="text-xs text-muted-foreground">{record.subject} • {record.tutor}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    record.status === "PRESENT" ? "border-green-200 text-green-700 bg-green-50" :
                    record.status === "LATE" ? "border-amber-200 text-amber-700 bg-amber-50" :
                    "border-red-200 text-red-700 bg-red-50"
                  }`}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
