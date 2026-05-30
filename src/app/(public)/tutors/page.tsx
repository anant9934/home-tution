"use client";

import Link from "next/link";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Star, MapPin, GraduationCap, Clock, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

function TutorsContent() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | null>(null);

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) setActiveSubject(subjectParam);
  }, [searchParams]);

  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("http://localhost:3001/tutors/public");
        if (!res.ok) throw new Error("Failed to load tutors");
        const data = await res.json();
        
        // Ensure standard fields exist for UI logic
        const formatted = data.map((t: any) => ({
          ...t,
          rating: t.rating || 4.8,
          reviews: t.reviews || Math.floor(Math.random() * 200) + 20,
          hourlyRate: typeof t.hourlyRate === 'string' ? parseInt(t.hourlyRate.replace(/\D/g, '')) : (t.hourlyRate || 500)
        }));
        setTutors(formatted);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    loadTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    let result = [...tutors];

    // Filter by subject
    if (activeSubject) {
      result = result.filter(t => t.subjects && t.subjects.includes(activeSubject));
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) || 
        (t.subjects && t.subjects.some((s: string) => s.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }

    return result;
  }, [searchQuery, activeSubject, sortBy, tutors]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-4">Find a Tutor</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Connect with verified expert tutors for 1-on-1 sessions or group batches to master any subject.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-2 relative">
             <Search className="w-5 h-5 absolute left-3 text-muted-foreground" />
             <Input 
               placeholder="Search tutors or subjects..." 
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
             All Subjects
           </Button>
           
           {SUBJECTS.slice(0, 4).map(sub => (
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
             variant={sortBy === "price_asc" ? "secondary" : "ghost"} 
             className="rounded-full text-muted-foreground hover:text-foreground"
             onClick={() => setSortBy(sortBy === "price_asc" ? null : "price_asc")}
           >
             Price: Low to High
           </Button>
           <Button 
             variant={sortBy === "rating" ? "secondary" : "ghost"} 
             className="rounded-full text-muted-foreground hover:text-foreground"
             onClick={() => setSortBy(sortBy === "rating" ? null : "rating")}
           >
             Highest Rated
           </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 w-full rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center text-destructive">
             <AlertCircle className="w-12 h-12 mb-4" />
             <h3 className="text-xl font-bold">Failed to load tutors</h3>
             <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group cursor-pointer">
                <div className="p-6 pb-0 flex items-start justify-between">
                   <div className="flex gap-4">
                      <img src={tutor.image} alt={tutor.name} className="w-16 h-16 rounded-2xl bg-muted object-cover" />
                      <div>
                         <h3 className="font-bold text-lg font-heading group-hover:text-primary transition-colors flex items-center gap-2">
                           {tutor.name}
                           {tutor.isVerified && <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 px-1.5 py-0 border-0 h-5">Verified</Badge>}
                         </h3>
                         <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{tutor.qualification}</p>
                      </div>
                   </div>
                </div>
                
                <div className="px-6 py-4 mt-2">
                   <div className="flex flex-wrap gap-2 mb-4">
                      {tutor.subjects?.map((sub: string, i: number) => (
                         <Badge key={i} variant="outline" className="bg-primary/5 border-primary/20 text-primary">{sub}</Badge>
                      ))}
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                         <Star className="w-4 h-4 text-warning fill-warning" />
                         <span className="font-medium text-foreground">{tutor.rating}</span> ({tutor.reviews})
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                         <GraduationCap className="w-4 h-4" />
                         {tutor.experience}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                         <Clock className="w-4 h-4" />
                         Next slots tomorrow
                      </div>
                      <div className="flex items-center gap-2 font-bold text-foreground">
                         <IndianRupee className="w-4 h-4 text-muted-foreground" />
                         ₹{tutor.hourlyRate}/hr
                      </div>
                   </div>
                </div>
                
                <div className="mt-auto border-t p-4 flex gap-3">
                   <Link href={`/tutors/${tutor.id}`} className="flex-1">
                     <Button variant="outline" className="w-full rounded-xl">View Profile</Button>
                   </Link>
                   <Link href={`/tutors/${tutor.id}`} className="flex-1">
                     <Button className="w-full rounded-xl shadow-sm">Book Trial</Button>
                   </Link>
                </div>
              </div>
            ))}

            {filteredTutors.length === 0 && (
               <div className="col-span-full py-20 text-center">
                 <p className="text-muted-foreground text-lg mb-4">No tutors found matching your search.</p>
                 <Button onClick={() => { setSearchQuery(""); setActiveSubject(null); setSortBy(null); }}>Clear Filters</Button>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <TutorsContent />
    </Suspense>
  );
}
