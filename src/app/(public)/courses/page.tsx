"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Search, Star, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popularity" | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("http://localhost:3001/courses/public");
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        
        // Ensure standard fields exist for UI logic even if missing in backend
        const formatted = data.map((c: any) => ({
          ...c,
          subject: c.subject || 'General',
          level: c.class || 'Beginner',
          rating: c.rating || 4.8,
          students: c.students || Math.floor(Math.random() * 500) + 50,
          price: c.price || 999,
          instructor: c.creator?.name || "Expert Instructor",
          image: c.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        }));
        setCourses(formatted);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Filter by subject
    if (activeSubject) {
      result = result.filter(c => c.subject === activeSubject);
    }

    // Filter by level
    if (activeLevel) {
      // Assuming 'class' in backend corresponds to level filtering in this mock-ui
      result = result.filter(c => c.level === activeLevel || c.class === activeLevel);
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "popularity") {
      result.sort((a, b) => b.students - a.students);
    }

    return result;
  }, [searchQuery, activeSubject, activeLevel, sortBy, courses]);

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
             <Input 
               placeholder="Search courses..." 
               className="pl-10 h-12 w-full md:w-80 rounded-full bg-white shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <Button className="rounded-full h-12 px-6">Search</Button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b">
           <Button 
             variant={activeSubject === null ? "default" : "outline"} 
             className="rounded-full bg-white hover:bg-muted"
             onClick={() => setActiveSubject(null)}
           >
             All Categories
           </Button>
           
           {SUBJECTS.slice(0, 3).map(sub => (
             <Button 
               key={sub}
               variant={activeSubject === sub ? "default" : "outline"} 
               className="rounded-full bg-white border-dashed text-muted-foreground"
               onClick={() => setActiveSubject(sub)}
             >
               + {sub}
             </Button>
           ))}
           
           <div className="w-px h-6 bg-border mx-2 self-center"></div>
           
           <Button 
             variant={activeLevel === "Beginner" ? "secondary" : "ghost"} 
             className="rounded-full text-muted-foreground hover:text-foreground"
             onClick={() => setActiveLevel(activeLevel === "Beginner" ? null : "Beginner")}
           >
             Level: Beginner
           </Button>
           <Button 
             variant={sortBy === "popularity" ? "secondary" : "ghost"} 
             className="rounded-full text-muted-foreground hover:text-foreground"
             onClick={() => setSortBy(sortBy === "popularity" ? null : "popularity")}
           >
             Popularity
           </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center text-destructive">
             <AlertCircle className="w-12 h-12 mb-4" />
             <h3 className="text-xl font-bold">Failed to load courses</h3>
             <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
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
                       <div className="font-bold text-lg text-primary">₹{course.price}</div>
                    </div>
                 </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
               <div className="col-span-full py-20 text-center">
                 <p className="text-muted-foreground text-lg mb-4">No courses found matching your criteria.</p>
                 <Button onClick={() => { setSearchQuery(""); setActiveSubject(null); setActiveLevel(null); setSortBy(null); }}>Clear Filters</Button>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
