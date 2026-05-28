import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCog, IndianRupee, BookOpen, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">Real-time metrics and administration controls.</p>
         </div>
         <Button className="hidden sm:flex rounded-xl shadow-sm">
           Generate Report
         </Button>
      </div>
      
      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Students", value: "12,450", trend: "+12%", up: true, icon: Users },
           { label: "Active Tutors", value: "1,204", trend: "+5%", up: true, icon: UserCog },
           { label: "Monthly Revenue", value: "₹45.2L", trend: "+18%", up: true, icon: IndianRupee },
           { label: "Pending Issues", value: "24", trend: "-2%", up: false, icon: AlertCircle },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-muted`}>
                     <stat.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-success' : 'text-destructive'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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
                    {[
                      { name: "Arvind Kumar", subject: "Physics", docStatus: "Verified", applied: "2 hours ago" },
                      { name: "Priya Singh", subject: "Chemistry", docStatus: "Pending ID", applied: "5 hours ago" },
                      { name: "John D.", subject: "English", docStatus: "Verified", applied: "1 day ago" },
                    ].map((tutor, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                               {tutor.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-sm">{tutor.name}</div>
                               <div className="text-xs text-muted-foreground">{tutor.subject} • Applied {tutor.applied}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <Badge variant={tutor.docStatus === 'Verified' ? 'default' : 'secondary'} className={tutor.docStatus === 'Verified' ? 'bg-success hover:bg-success' : ''}>
                               {tutor.docStatus}
                            </Badge>
                            <div className="flex gap-2">
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success/10"><CheckCircle2 className="w-4 h-4" /></Button>
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><XCircle className="w-4 h-4" /></Button>
                            </div>
                         </div>
                      </div>
                    ))}
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
                          {[
                            { id: "TRX-8921", student: "Rahul V.", tutor: "Dr. Sarah J.", amount: "₹800", status: "Success" },
                            { id: "TRX-8922", student: "Anjali S.", tutor: "Prof. Arvind", amount: "₹1,200", status: "Pending" },
                            { id: "TRX-8923", student: "Karan K.", tutor: "Sneha M.", amount: "₹500", status: "Success" },
                          ].map((trx, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                               <td className="px-6 py-4 font-mono text-xs">{trx.id}</td>
                               <td className="px-6 py-4 font-medium">{trx.student}</td>
                               <td className="px-6 py-4 text-muted-foreground">{trx.tutor}</td>
                               <td className="px-6 py-4 font-bold">{trx.amount}</td>
                               <td className="px-6 py-4">
                                  <Badge variant="outline" className={trx.status === 'Success' ? 'border-success text-success bg-success/5' : 'border-warning text-warning bg-warning/5'}>
                                    {trx.status}
                                  </Badge>
                               </td>
                            </tr>
                          ))}
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
