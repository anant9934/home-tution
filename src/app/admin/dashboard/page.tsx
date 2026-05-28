import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, DollarSign, TrendingUp, CheckCircle2, XCircle, BookOpen, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold font-heading mb-2">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground mb-6">We couldn't load your admin dashboard data.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const { stats, pendingTutors, recentBookings } = data;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Admin Overview</h1>
            <p className="text-muted-foreground mt-1">Platform metrics and pending approvals.</p>
         </div>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Platform Users", value: stats.totalStudents + stats.totalTutors, icon: Users, color: "text-primary", bg: "bg-primary/10", trend: "+12%" },
           { label: "Active Courses", value: stats.totalCourses, icon: GraduationCap, color: "text-success", bg: "bg-success/10", trend: "+4%" },
           { label: "Total Revenue", value: stats.totalRevenue, icon: DollarSign, color: "text-warning", bg: "bg-warning/10", trend: "+24%" },
           { label: "Platform Health", value: "99.9%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", trend: "Stable" },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm">
             <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold font-heading">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: ACTIVITY & APPROVALS */}
         <div className="xl:col-span-2 space-y-8">
            
            <Card className="rounded-2xl shadow-sm border">
               <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <CardTitle className="text-lg font-bold">Pending Tutor Approvals</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary h-8">View All</Button>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y">
                    {pendingTutors.map((tutor: any) => (
                      <div key={tutor.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                               {tutor.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-sm">{tutor.name}</div>
                               <div className="text-xs text-muted-foreground">{tutor.subject} • Applied {new Date(tutor.appliedAt).toLocaleDateString()}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <Badge variant={tutor.docStatus === 'VERIFIED' ? 'default' : 'secondary'} className={tutor.docStatus === 'VERIFIED' ? 'bg-success hover:bg-success' : ''}>
                               {tutor.docStatus}
                            </Badge>
                            <div className="flex gap-2">
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success/10"><CheckCircle2 className="w-4 h-4" /></Button>
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><XCircle className="w-4 h-4" /></Button>
                            </div>
                         </div>
                      </div>
                    ))}
                    {pendingTutors.length === 0 && (
                      <div className="p-8 text-center text-sm text-muted-foreground">No pending approvals at the moment.</div>
                    )}
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border">
               <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <CardTitle className="text-lg font-bold">Recent Bookings / Transactions</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                          <tr>
                             <th className="px-6 py-3 font-semibold">Transaction ID</th>
                             <th className="px-6 py-3 font-semibold">Student</th>
                             <th className="px-6 py-3 font-semibold">Tutor</th>
                             <th className="px-6 py-3 font-semibold">Amount</th>
                             <th className="px-6 py-3 font-semibold">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y">
                          {recentBookings.map((trx: any) => (
                            <tr key={trx.id} className="hover:bg-muted/20">
                               <td className="px-6 py-4 font-mono text-xs">{trx.id.split('-')[0].toUpperCase()}</td>
                               <td className="px-6 py-4 font-medium">{trx.student}</td>
                               <td className="px-6 py-4 text-muted-foreground">{trx.tutor}</td>
                               <td className="px-6 py-4 font-bold">{trx.amount}</td>
                               <td className="px-6 py-4">
                                  <Badge variant="outline" className={trx.status === 'COMPLETED' ? 'border-success text-success bg-success/5' : 'border-warning text-warning bg-warning/5'}>
                                    {trx.status}
                                  </Badge>
                               </td>
                            </tr>
                          ))}
                          {recentBookings.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No recent transactions.</td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                  </div>
               </CardContent>
            </Card>
            
         </div>
         
         {/* RIGHT COLUMN: QUICK ACTIONS */}
         <div className="space-y-6">
            
            <Card className="rounded-2xl shadow-sm border bg-gradient-to-b from-primary/5 to-transparent border-primary/10">
               <CardHeader>
                  <CardTitle className="text-lg font-bold">System Health</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Server Uptime</span>
                      <span className="text-success font-bold">99.9%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-success w-[99%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Storage Capacity</span>
                      <span className="text-warning font-bold">78%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-warning w-[78%]"></div>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border">
               <CardHeader>
                  <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl">
                     <BookOpen className="w-4 h-4 text-primary" /> Manage Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl">
                     <Users className="w-4 h-4 text-primary" /> Broadcast Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl">
                     <IndianRupee className="w-4 h-4 text-primary" /> Payout Settings
                  </Button>
               </CardContent>
            </Card>
            
         </div>

      </div>
    </div>
  );
}
