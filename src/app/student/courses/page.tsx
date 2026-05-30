"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlayCircle, Star, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchApi("/students/courses");
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-20 lg:pb-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load courses</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20 lg:pb-8 text-center pt-20">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">No Courses Enrolled</h2>
        <p className="text-muted-foreground max-w-md mx-auto">You are not enrolled in any courses for your class and board yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 lg:pb-8">
      <div>
         <h1 className="text-3xl font-bold font-heading">My Courses</h1>
         <p className="text-muted-foreground mt-1">Pick up where you left off or start something new.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {courses.map((course) => (
           <div key={course.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
              <div className="p-6 pb-0 flex-1">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen className="w-24 h-24" />
                 </div>
                 <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="font-bold text-lg font-heading line-clamp-2">{course.title}</h3>
                 </div>
                 <p className="text-sm text-muted-foreground mb-4 relative z-10">by {course.instructor}</p>
                 
                 <div className="flex gap-4 mb-6 text-xs font-semibold text-muted-foreground relative z-10">
                    <div className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.subject}</div>
                    <div className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> 4.9</div>
                 </div>

                 <div className="mb-6 relative z-10">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-muted-foreground">Overall Progress</span>
                      <span className="text-xs font-bold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                 </div>
              </div>
              
              {/* Syllabus Accordion */}
              <div className="border-t bg-slate-50 relative z-10">
                 <button 
                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                    className="w-full p-4 flex items-center justify-between text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                 >
                    View Syllabus
                    {expandedCourse === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </button>
                 
                 {expandedCourse === course.id && (
                    <div className="p-4 pt-0 space-y-3 max-h-48 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200">
                       {course.chapters.length === 0 ? (
                         <p className="text-xs text-muted-foreground text-center py-2">No chapters available</p>
                       ) : (
                         course.chapters.map((ch: any, idx: number) => (
                           <div key={idx}>
                              <h4 className="text-xs font-bold mb-1">Ch {idx + 1}: {ch.title}</h4>
                              <ul className="space-y-1">
                                 {ch.lessons.map((lesson: string, lIdx: number) => (
                                    <li key={lIdx} className="text-xs text-muted-foreground flex items-center gap-2 before:content-['•'] before:text-primary pl-1">
                                       {lesson}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                         ))
                       )}
                    </div>
                 )}
              </div>
              
              <div className="p-4 border-t bg-white relative z-10">
                 <Button className="w-full rounded-xl shadow-sm gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" onClick={() => alert("Course viewer coming soon!")}>
                   <PlayCircle className="w-4 h-4" /> {course.progress > 0 ? "Resume Learning" : "Start Course"}
                 </Button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
