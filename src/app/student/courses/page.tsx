"use client";

import Link from "next/link";
import { BookOpen, PlayCircle, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_STUDENT_DASHBOARD } from "@/lib/mock-data";

export default function StudentCoursesPage() {
  const data = MOCK_STUDENT_DASHBOARD;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 lg:pb-8">
      <div>
         <h1 className="text-3xl font-bold font-heading">My Courses</h1>
         <p className="text-muted-foreground mt-1">Pick up where you left off or start something new.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {data.enrolledCourses.map((course) => (
           <div key={course.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <BookOpen className="w-24 h-24" />
              </div>
              <h3 className="font-bold text-lg font-heading mb-1 line-clamp-2 relative z-10">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 relative z-10">by {course.instructor}</p>
              
              <div className="flex gap-4 mb-6 text-xs font-semibold text-muted-foreground relative z-10">
                 <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2h 15m left</div>
                 <div className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> 4.9</div>
              </div>

              <div className="mb-6 mt-auto relative z-10">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-bold text-muted-foreground line-clamp-1 flex-1 pr-4">Next: {course.nextLesson}</span>
                   <span className="text-xs font-bold">{course.progress}%</span>
                 </div>
                 <Progress value={course.progress} className="h-2" />
              </div>
              
              <Link href={`/student/courses/${course.id}/learn`} className="relative z-10">
                 <Button className="w-full rounded-xl shadow-sm gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                   <PlayCircle className="w-4 h-4" /> {course.progress > 0 ? "Resume Learning" : "Start Course"}
                 </Button>
              </Link>
           </div>
         ))}
      </div>
    </div>
  );
}
