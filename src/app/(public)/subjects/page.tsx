import Link from "next/link";
import { BookOpen, User, Star, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function SubjectsPage() {
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
            <Link href="/subjects" className="text-primary transition-colors">Subjects</Link>
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
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-4xl font-bold font-heading mb-4">Explore Subjects</h1>
        <p className="text-muted-foreground text-lg mb-12">Find expert tutors across various academic disciplines.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((subject) => (
            <div key={subject} className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all group cursor-pointer">
              <h3 className="text-2xl font-bold font-heading group-hover:text-primary transition-colors">{subject}</h3>
              <p className="text-muted-foreground mt-2">Master {subject.toLowerCase()} with our top-rated instructors.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-medium text-primary">
                <span>View Tutors</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
