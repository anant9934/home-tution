"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, CalendarCheck, CreditCard, LineChart, MessageSquare, User, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationsPopover } from "@/components/NotificationsPopover";

const navItems = [
  { name: "Overview", href: "/parent/dashboard", icon: LayoutDashboard },
  { name: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
  { name: "Fees", href: "/parent/fees", icon: CreditCard },
  { name: "Performance", href: "/parent/performance", icon: LineChart },
  { name: "Messages", href: "/parent/messages", icon: MessageSquare },
  { name: "Profile", href: "/parent/profile", icon: User },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout, getInitials, getGreeting } = useAuth("PARENT");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl animate-pulse">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = getInitials();
  const firstName = user.name?.split(" ")[0] || "Parent";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-white shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
           <Link href="/" className="flex items-center gap-2">
             <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
               <BookOpen className="w-5 h-5" />
             </div>
             <span className="text-xl font-bold font-heading">Aura Parent</span>
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
           <div className="flex items-center gap-3 mb-3">
              <Avatar>
                 <AvatarImage src={user.avatarUrl || ""} />
                 <AvatarFallback className="bg-primary-light text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">{user.name}</p>
                 <p className="text-xs text-muted-foreground truncate">Parent</p>
              </div>
           </div>
           <button 
             onClick={logout}
             className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full px-3 py-2 rounded-xl hover:bg-destructive/5"
           >
             <LogOut className="w-4 h-4" />
             Sign out
           </button>
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
               <span className="font-semibold">{getGreeting()}, {firstName}! 👋</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
               <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm font-semibold border">
                 <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">{initials}</div>
                 {firstName}
               </div>

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
         <div className="flex justify-around items-center h-16 px-2">
            {[
              { name: "Overview", href: "/parent/dashboard", icon: LayoutDashboard },
              { name: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
              { name: "Fees", href: "/parent/fees", icon: CreditCard },
              { name: "Messages", href: "/parent/messages", icon: MessageSquare },
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
