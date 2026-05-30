"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { PenTool, Plus, Calendar, Clock, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const data = await fetchApi("/tutors/quizzes");
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <PenTool className="w-8 h-8 text-primary" /> Quizzes & Tests
          </h1>
          <p className="text-muted-foreground mt-1">Create multiple-choice quizzes, assess performance automatically.</p>
        </div>
        <Button className="rounded-full shadow-sm gap-2">
          <Plus className="w-4 h-4" /> Create New Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {quizzes.map(q => (
            <div key={q.id} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
               {/* Decorative background accent */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="space-y-1">
                     <Badge variant="secondary" className="bg-slate-100 text-xs mb-2 block w-fit">{q.course.title}</Badge>
                     <h3 className="font-bold text-lg font-heading leading-tight">{q.title}</h3>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 my-6 relative z-10">
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</div>
                     <div className="text-sm font-semibold">{q.startTime ? new Date(q.startTime).toLocaleDateString() : 'Draft'}</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</div>
                     <div className="text-sm font-semibold">{q.duration} mins</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5" /> Marks</div>
                     <div className="text-sm font-semibold">{q.totalMarks} Total</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Questions</div>
                     <div className="text-sm font-semibold">{q.questions?.length || 0} Qs</div>
                  </div>
               </div>
               
               <div className="mt-auto pt-4 border-t flex items-center justify-between relative z-10">
                  <div className="text-sm font-semibold text-primary">{q.attempts?.length || 0} Attempts</div>
                  <Button variant="outline" size="sm" className="rounded-xl font-bold">View Results</Button>
               </div>
            </div>
         ))}
         
         {quizzes.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
               <PenTool className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <h3 className="text-lg font-bold">No Quizzes Yet</h3>
               <p className="text-muted-foreground max-w-sm mx-auto mb-6">You haven't created any quizzes for your students. Create one to test their knowledge!</p>
               <Button className="rounded-full shadow-sm gap-2">
                 <Plus className="w-4 h-4" /> Create New Quiz
               </Button>
            </div>
         )}
      </div>
    </div>
  );
}
