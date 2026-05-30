"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Users, UserCog, Book, CreditCard, LineChart, Settings, HelpCircle, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/NotificationsPopover";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Support Hub", href: "/admin/support", icon: HelpCircle },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Tutors", href: "/admin/tutors", icon: UserCog },
  { name: "Courses", href: "/admin/courses", icon: Book },
  { name: "Bookings & Fees", href: "/admin/fees", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-sidebar shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
           <Link href="/" className="flex items-center gap-2">
             <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
               <BookOpen className="w-5 h-5" />
             </div>
             <span className="text-xl font-bold font-heading">Aura Admin</span>
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
           {navItems.map((item) => {
             const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
             return (
               <Link 
                 key={item.name} 
                 href={item.href}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
               >
                 <item.icon className="w-5 h-5" />
                 {item.name}
               </Link>
             );
           })}
        </div>
        
        <div className="p-4 border-t bg-muted/50">
           <div className="flex items-center gap-3">
              <Avatar>
                 <AvatarImage src="" />
                 <AvatarFallback className="bg-primary text-primary-foreground font-bold">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">System Admin</p>
                 <p className="text-[10px] text-muted-foreground truncate">Super User</p>
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
               <span className="font-semibold text-muted-foreground">Admin Control Center</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
               <NotificationsPopover />
            </div>
         </header>
         
         {/* PAGE CONTENT */}
         <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-zinc-50/50">
            {children}
         </main>
      </div>

    </div>
  );
}
