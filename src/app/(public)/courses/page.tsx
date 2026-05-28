import Link from "next/link";
import { Search, Star, Clock, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

async function getCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/courses/public`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-4">Browse Courses</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Learn at your own pace with interactive video courses, assignments, and quizzes curated by experts.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-2 relative">
             <Search className="w-5 h-5 absolute left-3 text-muted-foreground" />
             <Input placeholder="Search courses..." className="pl-10 h-12 w-full md:w-80 rounded-full bg-white shadow-sm" />
             <Button className="rounded-full h-12 px-6">Search</Button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b">
           <Button variant="outline" className="rounded-full bg-white">All Categories</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ Math</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ Science</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ CS</Button>
           <div className="w-px h-6 bg-border mx-2 self-center"></div>
           <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">Level: Beginner</Button>
           <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">Popularity</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: any) => (
            <div key={course.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col cursor-pointer">
               <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                 <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur text-foreground hover:bg-white border-0 shadow-sm">{course.subject}</Badge>
                 </div>
               </div>
               
               <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-bold text-warning mb-2">
                     <Star className="w-4 h-4 fill-warning" /> {course.rating} <span className="text-muted-foreground font-normal">({course.students} students)</span>
                  </div>
                  
                  <h3 className="font-bold text-lg font-heading group-hover:text-primary transition-colors line-clamp-2 mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                  
                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                     <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                       <GraduationCap className="w-4 h-4" /> {course.instructor}
                     </div>
                     <div className="font-bold text-lg text-primary">{course.price}</div>
                  </div>
               </div>
            </div>
          ))}

          {courses.length === 0 && (
             <div className="col-span-full py-20 text-center">
               <p className="text-muted-foreground text-lg">No courses found. Check back later!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
