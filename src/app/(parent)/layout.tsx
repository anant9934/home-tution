import Link from "next/link";
import { BookOpen, LayoutDashboard, CalendarCheck, CreditCard, LineChart, MessageSquare, User, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Fees", href: "/fees", icon: CreditCard },
  { name: "Performance", href: "/performance", icon: LineChart },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Profile", href: "/profile", icon: User },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
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
           {navItems.map((item) => (
             <Link 
               key={item.name} 
               href={item.href}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${item.name === 'Overview' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
             >
               <item.icon className="w-5 h-5" />
               {item.name}
             </Link>
           ))}
        </div>
        
        <div className="p-4 border-t">
           <div className="flex items-center gap-3">
              <Avatar>
                 <AvatarImage src="" />
                 <AvatarFallback className="bg-primary-light text-primary font-bold">KV</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">Kiran Verma</p>
                 <p className="text-xs text-muted-foreground truncate">Parent</p>
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
               <span className="font-semibold">Parent Portal</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
               <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm font-semibold border">
                 <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">RV</div>
                 Rahul
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
              { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { name: "Attendance", href: "/attendance", icon: CalendarCheck },
              { name: "Fees", href: "/fees", icon: CreditCard },
              { name: "Messages", href: "/messages", icon: MessageSquare },
            ].map(item => (
              <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-16 gap-1 ${item.name === 'Overview' ? 'text-primary' : 'text-muted-foreground'}`}>
                 <item.icon className="w-5 h-5" />
                 <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            ))}
         </div>
      </div>

    </div>
  );
}
