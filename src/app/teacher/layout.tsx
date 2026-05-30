"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, LayoutDashboard, Users, Book, ClipboardList, PenTool, CalendarCheck, MessageSquare, IndianRupee, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { fetchApi } from "@/lib/api";

const navItems = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/teacher/students", icon: Users },
  { name: "Classes", href: "/teacher/classes", icon: Book },
  { name: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
  { name: "Quizzes", href: "/teacher/quizzes", icon: PenTool },
  { name: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
  { name: "Messages", href: "/teacher/messages", icon: MessageSquare },
  { name: "Earnings", href: "/teacher/earnings", icon: IndianRupee },
  { name: "Profile", href: "/teacher/profile", icon: User },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name: string; subjects?: string[] } | null>(null);

  useEffect(() => {
    fetchApi("/tutors/profile")
      .then(d => setProfile({ name: d?.user?.name || "Teacher", subjects: d?.subjects }))
      .catch(() => {});
  }, []);

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
                 <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} />
                 <AvatarFallback className="bg-primary/10 text-primary font-bold">
                   {profile?.name?.substring(0, 2).toUpperCase() || "TP"}
                 </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">{profile?.name || "Teacher"}</p>
                 <p className="text-xs text-muted-foreground truncate">
                   {Array.isArray(profile?.subjects) ? profile.subjects[0] : profile?.subjects || "Tutor"}
                 </p>
              </div>
           </div>
        </div>
      </aside>


      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         
         {/* TOPBAR */}
         <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
            <div className="flex items-center gap-4 lg:hidden">
               <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                 <BookOpen className="w-5 h-5" />
               </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 text-sm">
               <span className="font-semibold">Teacher Workspace</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
               <NotificationsPopover />
            </div>
         </header>
         
         {/* PAGE CONTENT */}
         <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
         </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50 pb-safe">
         <div className="flex overflow-x-auto items-center h-16 px-2 gap-1 no-scrollbar">
            {navItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center min-w-[4rem] gap-0.5 py-1 px-2 rounded-xl transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
                   <item.icon className="w-5 h-5" />
                   <span className="text-[9px] font-semibold whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
         </div>
      </div>

    </div>
  );
}
