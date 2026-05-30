"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Book, ClipboardList, PenTool, Trophy, CalendarCheck, MessageSquare, User, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/student/courses", icon: Book },
  { name: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { name: "Quizzes", href: "/student/quizzes", icon: PenTool },
  { name: "Leaderboard", href: "/student/leaderboard", icon: Trophy },
  { name: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { name: "Messages", href: "/student/messages", icon: MessageSquare },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-white shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
           <Link href="/" className="flex items-center gap-2">
             <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
               <BookOpen className="w-5 h-5" />
             </div>
             <span className="text-xl font-bold font-heading">Aura</span>
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
           {navItems.map((item) => {
             const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
             return (
               <Link 
                 key={item.name} 
                 href={item.href}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
               >
                 <item.icon className="w-5 h-5" />
                 {item.name}
               </Link>
             );
           })}
        </div>
        
        <div className="p-4 border-t">
           <div className="flex items-center gap-3">
              <Avatar>
                 <AvatarImage src="" />
                 <AvatarFallback className="bg-primary-light text-primary font-bold">RV</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">Rahul Verma</p>
                 <p className="text-xs text-muted-foreground truncate">Class 12 • Science</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         
         {/* TOPBAR */}
         <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
            <div className="flex items-center gap-4 lg:hidden">
               {/* Mobile menu trigger could go here */}
               <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                 <BookOpen className="w-5 h-5" />
               </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 text-sm">
               <span className="font-semibold">Good Morning, Rahul! 👋</span>
               <span className="text-muted-foreground">Here's your learning progress today.</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
               <div className="hidden sm:flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-full text-sm font-bold">
                 <Trophy className="w-4 h-4" /> 1,250 XP
               </div>
               
               <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-white"></span>
               </button>
            </div>
         </header>
         
         {/* PAGE CONTENT */}
         <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
         </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50 pb-safe">
         <div className="flex justify-around items-center h-16 px-2">
            {[
              { name: "Home", href: "/student/dashboard", icon: LayoutDashboard },
              { name: "Courses", href: "/student/courses", icon: Book },
              { name: "Quizzes", href: "/student/quizzes", icon: PenTool },
              { name: "Leader", href: "/student/leaderboard", icon: Trophy },
              { name: "Profile", href: "/student/profile", icon: User },
            ].map(item => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-16 gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                   <item.icon className="w-5 h-5" />
                   <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
         </div>
      </div>

    </div>
  );
}
