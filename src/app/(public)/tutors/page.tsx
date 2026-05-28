import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, Star, User, ChevronDown } from "lucide-react";

export default function TutorsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER BAR */}
      <div className="bg-primary-light/30 border-b">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Find Your Perfect Tutor</h1>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-white p-2 rounded-xl shadow-sm border">
             <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Subject, e.g. Mathematics" className="pl-9 border-0 focus-visible:ring-0 shadow-none bg-transparent" />
             </div>
             <div className="w-px bg-border hidden sm:block" />
             <div className="flex-1 relative hidden sm:block">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Location or Online" className="pl-9 border-0 focus-visible:ring-0 shadow-none bg-transparent" />
             </div>
             <Button className="rounded-lg px-6 shrink-0">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* MOBILE FILTER TRIGGER */}
          <div className="lg:hidden flex justify-between items-center mb-4">
             <p className="text-sm text-muted-foreground">Showing 1,204 tutors</p>
             <Button variant="outline" size="sm" className="gap-2">
               <Filter className="w-4 h-4" /> Filters
             </Button>
          </div>

          {/* LEFT FILTER SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Teaching Mode</h3>
              <div className="space-y-2">
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> Online</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> Home Tuition</label>
              </div>
            </div>
            
            <div className="w-full h-px bg-border" />

            <div>
              <h3 className="font-semibold mb-3">Academic Board</h3>
              <div className="space-y-2">
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> CBSE</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> ICSE</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> State Board</label>
                 <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> IB / IGCSE</label>
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h3 className="font-semibold mb-3">Budget (per hour)</h3>
              <div className="flex items-center gap-2">
                 <Input placeholder="Min" type="number" className="h-9" />
                 <span className="text-muted-foreground">-</span>
                 <Input placeholder="Max" type="number" className="h-9" />
              </div>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                 {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" /> 
                      <div className="flex text-warning">
                        {Array.from({length: rating}).map((_, i) => <Star key={i} className="w-3 h-3 fill-warning" />)}
                      </div>
                      <span className="text-muted-foreground">& Up</span>
                    </label>
                 ))}
              </div>
            </div>
          </aside>

          {/* RIGHT TUTOR GRID */}
          <main className="flex-1">
             <div className="hidden lg:flex justify-between items-center mb-6">
               <p className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">1,204</span> verified tutors</p>
               <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground">Sort by:</span>
                 <Button variant="outline" size="sm" className="gap-2 font-normal">
                    Recommended <ChevronDown className="w-4 h-4" />
                 </Button>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="group rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full">
                    <div className="flex gap-4 items-start mb-4">
                       <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="w-8 h-8 text-primary/40" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Dr. Sarah J.</h3>
                             <Badge variant="secondary" className="bg-success/10 text-success text-[10px] px-1 py-0 h-4">Verified</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Ph.D. in Mathematics</p>
                          <div className="flex items-center gap-1 text-sm font-medium mt-1">
                             <Star className="w-4 h-4 text-warning fill-warning" />
                             <span>4.9</span>
                             <span className="text-muted-foreground font-normal">(120 reviews)</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-3 mb-6 flex-1">
                       <div className="flex gap-2">
                         <Badge variant="outline" className="font-normal text-xs">Mathematics</Badge>
                         <Badge variant="outline" className="font-normal text-xs">Physics</Badge>
                       </div>
                       <div className="text-sm text-muted-foreground line-clamp-2">
                          Passionate about making math easy and fun. Over 10 years of experience teaching CBSE & ICSE.
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t mt-auto">
                       <div>
                          <div className="text-xs text-muted-foreground">Starting from</div>
                          <div className="font-bold">₹500 <span className="text-sm font-normal text-muted-foreground">/ hr</span></div>
                       </div>
                       <Button className="rounded-xl">Book Demo</Button>
                    </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 flex justify-center">
                <Button variant="outline" className="rounded-full px-8">Load More Tutors</Button>
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}
