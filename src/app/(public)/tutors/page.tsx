import Link from "next/link";
import { Search, Star, MapPin, GraduationCap, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Revalidate every minute

async function getTutors() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/tutors/public`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function TutorsPage() {
  const tutors = await getTutors();

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
             <Input placeholder="Search tutors or subjects..." className="pl-10 h-12 w-full md:w-80 rounded-full bg-white shadow-sm" />
             <Button className="rounded-full h-12 px-6">Search</Button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b">
           <Button variant="outline" className="rounded-full bg-white">All Subjects</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ Math</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ Physics</Button>
           <Button variant="outline" className="rounded-full bg-white border-dashed text-muted-foreground">+ English</Button>
           <div className="w-px h-6 bg-border mx-2 self-center"></div>
           <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">Price: Low to High</Button>
           <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">Highest Rated</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tutors.map((tutor: any) => (
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
                    {tutor.subjects.map((sub: string, i: number) => (
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
                       {tutor.hourlyRate}/hr
                    </div>
                 </div>
              </div>
              
              <div className="mt-auto border-t p-4 flex gap-3">
                 <Link href={`/tutors/${tutor.id}`} className="flex-1">
                   <Button variant="outline" className="w-full rounded-xl">View Profile</Button>
                 </Link>
                 <Button className="flex-1 rounded-xl shadow-sm">Book Trial</Button>
              </div>
            </div>
          ))}

          {tutors.length === 0 && (
             <div className="col-span-full py-20 text-center">
               <p className="text-muted-foreground text-lg">No tutors found. Check back later!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
