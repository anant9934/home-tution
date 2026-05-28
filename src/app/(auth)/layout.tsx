import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE - ILLUSTRATION / BRANDING */}
      <div className="hidden md:flex flex-col bg-primary-light/50 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02]" />
        
        <Link href="/" className="flex items-center gap-2 relative z-10 w-fit">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-heading">Aura</span>
        </Link>
        
        <div className="mt-auto relative z-10 max-w-md">
           <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
             Start your learning journey today.
           </h2>
           <p className="text-muted-foreground mb-8">
             Join thousands of students and tutors transforming education through personalized, premium learning experiences.
           </p>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
             <div className="flex text-warning">
               <Star className="w-5 h-5 fill-warning" />
               <Star className="w-5 h-5 fill-warning" />
               <Star className="w-5 h-5 fill-warning" />
               <Star className="w-5 h-5 fill-warning" />
               <Star className="w-5 h-5 fill-warning" />
             </div>
             <p className="text-sm font-medium italic text-muted-foreground">
               "Aura has completely changed the way I prepare for exams. The tutors are top-notch and the platform is incredibly easy to use."
             </p>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">S</div>
               <div className="text-sm font-semibold">Sneha K. <span className="font-normal text-muted-foreground">— Class 12</span></div>
             </div>
           </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-12 w-64 h-64 bg-success/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* RIGHT SIDE - CONTENT */}
      <div className="flex items-center justify-center p-8 bg-background">
         <div className="w-full max-w-md">
            {children}
         </div>
      </div>
    </div>
  );
}
