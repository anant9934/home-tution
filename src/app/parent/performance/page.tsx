"use client";

import { useState, useEffect } from "react";
import { LineChart, Trophy, Award, AlertCircle, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChildSelector } from "@/components/ChildSelector";
import { fetchApi } from "@/lib/api";

interface PerformanceData {
  childName: string;
  totalXP: number;
  badges: { name: string; icon: string; earnedAt: string }[];
  subjectPerformance: { subject: string; percentage: number; quizzesTaken: number; color: string }[];
  quizHistory: { id: string; quizTitle: string; subject: string; score: number; totalMarks: number; percentage: number; date: string; timeTaken: number | null }[];
  assignmentHistory: { id: string; title: string; subject: string; marks: number | null; maxMarks: number; percentage: number | null; feedback: string | null; date: string }[];
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const query = selectedChildId ? `?childId=${selectedChildId}` : "";
    fetchApi(`/parents/performance${query}`)
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
        <h2 className="text-xl font-bold mb-2">Failed to load performance</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const avgPerformance = data.subjectPerformance.length > 0
    ? Math.round(data.subjectPerformance.reduce((s, p) => s + p.percentage, 0) / data.subjectPerformance.length)
    : 0;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Performance</h1>
          <p className="text-muted-foreground mt-1">{data.childName}&apos;s academic performance overview.</p>
        </div>
        <ChildSelector selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className={`text-3xl font-bold font-heading ${avgPerformance >= 75 ? "text-green-600" : avgPerformance >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {avgPerformance}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">Overall Average</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold font-heading text-amber-600">{data.totalXP}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold font-heading">{data.badges.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold font-heading">{data.subjectPerformance.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="font-bold font-heading mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Subject-wise Performance
        </h3>
        {data.subjectPerformance.length > 0 ? (
          <div className="space-y-6">
            {data.subjectPerformance.map((sp, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="font-semibold text-sm">{sp.subject}</span>
                    <span className="text-xs text-muted-foreground ml-2">({sp.quizzesTaken} quizzes)</span>
                  </div>
                  <span className={`text-sm font-bold ${sp.color === 'success' ? 'text-green-600' : sp.color === 'primary' ? 'text-blue-600' : 'text-amber-600'}`}>
                    {sp.percentage}%
                  </span>
                </div>
                <Progress value={sp.percentage} className="h-3" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">No quiz data yet.</p>
        )}
      </div>

      {/* Badges */}
      {data.badges.length > 0 && (
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Badges Earned
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.badges.map((badge, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl border bg-amber-50/50 border-amber-100 text-center">
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className="text-sm font-semibold">{badge.name}</span>
                <span className="text-[10px] text-muted-foreground mt-1">{new Date(badge.earnedAt).toLocaleDateString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz & Assignment History */}
      <Tabs defaultValue="quizzes" className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="quizzes" className="rounded-xl">Quiz History</TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-xl">Assignments</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="quizzes" className="p-6 pt-4">
          {data.quizHistory.length > 0 ? (
            <div className="space-y-3">
              {data.quizHistory.map((quiz) => (
                <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-sm">{quiz.quizTitle}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {quiz.subject} • {new Date(quiz.date).toLocaleDateString("en-IN")}
                      {quiz.timeTaken && ` • ${Math.round(quiz.timeTaken / 60)} min`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{quiz.score}/{quiz.totalMarks}</span>
                    <Badge variant="outline" className={`text-xs ${
                      quiz.percentage >= 80 ? "border-green-200 text-green-700 bg-green-50" :
                      quiz.percentage >= 60 ? "border-amber-200 text-amber-700 bg-amber-50" :
                      "border-red-200 text-red-700 bg-red-50"
                    }`}>
                      {quiz.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No quiz attempts yet.</p>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="p-6 pt-4">
          {data.assignmentHistory.length > 0 ? (
            <div className="space-y-3">
              {data.assignmentHistory.map((a) => (
                <div key={a.id} className="p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm">{a.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {a.subject} • {new Date(a.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.marks != null && (
                        <>
                          <span className="text-sm font-semibold">{a.marks}/{a.maxMarks}</span>
                          <Badge variant="outline" className={`text-xs ${
                            (a.percentage || 0) >= 80 ? "border-green-200 text-green-700 bg-green-50" :
                            (a.percentage || 0) >= 60 ? "border-amber-200 text-amber-700 bg-amber-50" :
                            "border-red-200 text-red-700 bg-red-50"
                          }`}>
                            {a.percentage}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  {a.feedback && (
                    <p className="text-xs text-muted-foreground mt-2 bg-slate-50 rounded-lg p-2 italic">&quot;{a.feedback}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No assignments submitted yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
