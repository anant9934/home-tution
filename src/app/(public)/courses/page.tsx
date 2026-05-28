import Link from "next/link";
import { BookOpen, PlayCircle, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CoursesPage() {
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
            <Link href="/courses" className="text-primary transition-colors">Courses</Link>
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
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-4xl font-bold font-heading mb-4">Interactive Courses</h1>
        <p className="text-muted-foreground text-lg mb-12">Learn at your own pace with our premium video courses.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group rounded-2xl border bg-card hover:shadow-md transition-all cursor-pointer overflow-hidden">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                 <PlayCircle className="w-12 h-12 text-primary/40 group-hover:text-primary/70 transition-colors" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                 <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <span className="text-xs font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-md">12 Lessons</span>
                 </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Complete Physics Crash Course</h3>
                <p className="text-muted-foreground mt-2 text-sm">Cover all essential topics in mechanics and thermodynamics.</p>
                <div className="mt-4 flex items-center justify-between text-sm font-medium text-primary">
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
