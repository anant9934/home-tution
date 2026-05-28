import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Star, PlayCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b z-50 flex items-center justify-between px-6 md:px-12">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold font-heading text-xl tracking-tight">EdTech Pro</span>
         </div>
         <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <Link href="/tutors" className="hover:text-primary transition-colors">Find Tutors</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Explore Courses</Link>
            <Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link>
         </nav>
         <div className="flex items-center gap-3">
            <Link href="/login">
               <Button variant="ghost" className="hidden md:flex font-semibold">Log In</Button>
            </Link>
            <Link href="/login">
               <Button className="rounded-full px-6 font-bold shadow-sm">Get Started</Button>
            </Link>
         </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 pt-32 pb-20">
         <div className="container mx-auto px-4 md:px-6">
            
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 relative z-10">
               <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-6 py-1.5 px-4 rounded-full font-medium">
                  🌟 The #1 Platform for Personalized Learning
               </Badge>
               <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight leading-[1.1] mb-6">
                 Master any subject with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">expert tutors.</span>
               </h1>
               <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                 Experience world-class 1-on-1 tuition, interactive video courses, and gamified learning all in one seamless platform.
               </p>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/tutors">
                     <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold shadow-xl shadow-primary/20">
                        Find a Tutor <ArrowRight className="ml-2 w-5 h-5" />
                     </Button>
                  </Link>
                  <Link href="/courses">
                     <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg font-bold bg-white">
                        <PlayCircle className="mr-2 w-5 h-5 text-primary" /> Explore Courses
                     </Button>
                  </Link>
               </div>
            </div>

            {/* DASHBOARD PREVIEW MOCKUP */}
            <div className="relative mx-auto max-w-6xl rounded-3xl overflow-hidden border border-slate-200/50 shadow-2xl bg-white p-2">
               <div className="absolute top-0 inset-x-0 h-12 bg-slate-100 flex items-center px-4 gap-2 rounded-t-2xl">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <img 
                 src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop" 
                 alt="Platform Preview" 
                 className="w-full h-auto mt-12 rounded-xl border border-slate-100 opacity-90"
               />
               
               {/* Decorative floating badges */}
               <div className="absolute -left-6 top-1/3 bg-white p-4 rounded-2xl shadow-xl border animate-bounce flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                  <div>
                     <div className="font-bold text-sm">Task Completed</div>
                     <div className="text-xs text-muted-foreground">+50 XP Earned</div>
                  </div>
               </div>
            </div>

            {/* FEATURES */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                 { icon: Users, title: "1-on-1 Mentorship", desc: "Book private sessions with top-rated educators who tailor the curriculum to your pace." },
                 { icon: PlayCircle, title: "Interactive Courses", desc: "Learn from comprehensive video modules integrated with quizzes and progress tracking." },
                 { icon: Star, title: "Gamified Learning", desc: "Earn XP, unlock achievements, and stay motivated on your educational journey." },
               ].map((feat, i) => (
                 <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                       <feat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
            
         </div>
      </main>
      
      <footer className="bg-white border-t py-12 text-center text-muted-foreground text-sm">
         <p>© 2026 EdTech Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
