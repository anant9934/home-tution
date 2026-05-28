import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
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
            <Link href="/about" className="text-primary transition-colors">About</Link>
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
      
      <main className="container mx-auto px-4 md:px-6 py-12 lg:py-24 max-w-4xl">
        <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
           <h1 className="text-5xl font-bold font-heading text-center">About Aura</h1>
           <p className="text-xl text-muted-foreground text-center leading-relaxed">
             We are on a mission to democratize premium education by connecting ambitious students with world-class tutors through a seamless, interactive platform.
           </p>
           
           <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-4">
               <h2 className="text-2xl font-bold font-heading">Our Vision</h2>
               <p className="text-muted-foreground leading-relaxed">
                 To become the global standard for personalized learning, where every student has the tools and guidance they need to unlock their true potential.
               </p>
             </div>
             <div className="space-y-4">
               <h2 className="text-2xl font-bold font-heading">Our Approach</h2>
               <p className="text-muted-foreground leading-relaxed">
                 We combine expert human instruction with cutting-edge gamification and analytics to create an engaging, effective learning environment that works.
               </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
