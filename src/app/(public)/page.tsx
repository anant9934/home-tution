import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, BookOpen, User, Star, ArrowRight, PlayCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-heading">Aura</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-muted-foreground">
            <Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link>
            <Link href="/tutors" className="hover:text-primary transition-colors">Tutors</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-block text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className={buttonVariants({ className: "rounded-full px-6" })}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary-light/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                    #1 Premium Learning Platform
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading tracking-tight text-foreground">
                    Unlock Your <br className="hidden lg:block"/>
                    <span className="text-primary">True Potential.</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-medium">
                    Connect with world-class tutors, engage with interactive courses, and accelerate your learning journey from screen to real time.
                  </p>
                </div>

                {/* SEARCH BAR WIDGET */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-border/50 max-w-xl flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="What do you want to learn?" 
                      className="pl-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base"
                    />
                  </div>
                  <div className="w-px bg-border hidden sm:block" />
                  <div className="flex-1 relative hidden sm:block">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Online or Home" 
                      className="pl-9 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base"
                    />
                  </div>
                  <Button className="rounded-xl px-8 h-12 text-base font-semibold shrink-0 shadow-md">
                    Search Tutors
                  </Button>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>10k+ Verified Tutors</span>
                  </div>
                </div>
              </div>
              
              <div className="mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none relative">
                {/* Visual Element replacing generic illustration */}
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary-light to-white"></div>
                   
                   {/* Abstract Dashboard/Video Preview */}
                   <div className="relative w-4/5 h-3/5 bg-white rounded-xl shadow-lg border p-4 flex flex-col gap-4 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                      <div className="flex gap-2 items-center border-b pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Dr. Sarah Jenkins</div>
                          <div className="text-xs text-muted-foreground">Mathematics • Expert</div>
                        </div>
                      </div>
                      <div className="flex-1 bg-muted rounded-lg flex items-center justify-center">
                         <PlayCircle className="w-12 h-12 text-primary/40" />
                      </div>
                   </div>

                   {/* Floating cards */}
                   <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                      <div className="bg-success/10 p-3 rounded-full">
                        <Star className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Top 1%</div>
                        <div className="text-xs text-muted-foreground">Tutor Quality</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED TUTORS (Placeholder for layout) */}
        <section className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-heading">Meet Our Top Tutors</h2>
                <p className="text-muted-foreground">Learn from the best educators in the country.</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex gap-2 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="group rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-[4/3] bg-muted relative">
                    {/* Placeholder image */}
                    <div className="absolute inset-0 bg-primary-light/50 flex items-center justify-center text-primary/30">
                       <User className="w-16 h-16" />
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Prof. Albert D.</h3>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Physics • IIT JEE</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium">Online</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium">₹800/hr</span>
                    </div>
                    <Button className="w-full rounded-xl" variant="outline">Book Demo</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full border-t bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>© 2026 Aura EdTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
