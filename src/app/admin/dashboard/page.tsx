"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, DollarSign, CheckCircle2, ShieldCheck, XCircle, Plus, X, List, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals State
  const [showTransactions, setShowTransactions] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Form State
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState("");
  const [tutorsList, setTutorsList] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await fetchApi("/admin/dashboard");
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    }
    async function loadTutors() {
      try {
        const tutorsData = await fetchApi("/admin/tutors");
        // Only show verified tutors in the dropdown
        setTutorsList(tutorsData.filter((t: any) => t.isVerified));
      } catch (err: any) {
        // ignore
      }
    }
    loadDashboard();
    loadTutors();
  }, []);

  const handleApproveTutor = async (id: string, name: string) => {
     try {
        await fetchApi(`/admin/tutors/${id}/approve`, { method: "PATCH" });
        setData((prev: any) => ({
           ...prev,
           pendingTutors: prev.pendingTutors.filter((t: any) => t.id !== id),
           stats: {
              ...prev.stats,
              totalTutors: prev.stats.totalTutors + 1
           }
        }));
        toast.success(`${name} has been verified and added to the platform.`);
     } catch (err: any) {
        toast.error(err.message || "Failed to approve tutor");
     }
  };

  const handleRejectTutor = async (id: string, name: string) => {
     try {
        await fetchApi(`/admin/tutors/${id}/reject`, { method: "PATCH" });
        setData((prev: any) => ({
           ...prev,
           pendingTutors: prev.pendingTutors.filter((t: any) => t.id !== id)
        }));
        toast.error(`${name}'s application was rejected.`);
     } catch (err: any) {
        toast.error(err.message || "Failed to reject tutor");
     }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
        await fetchApi("/admin/courses", {
           method: "POST",
           body: JSON.stringify({
              title: newCourseName,
              subject: newCourseCategory,
              instructorId: newCourseInstructor
           })
        });
        setData((prev: any) => ({
           ...prev,
           stats: {
              ...prev.stats,
              totalCourses: prev.stats.totalCourses + 1
           }
        }));
        setShowAddCourse(false);
        setNewCourseName("");
        setNewCourseCategory("");
        setNewCourseInstructor("");
        toast.success("New course successfully published.");
     } catch (err: any) {
        toast.error(err.message || "Failed to create course");
     }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 relative">

      {/* ADD COURSE MODAL */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold font-heading text-lg">Add New Course</h3>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowAddCourse(false)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleAddCourse} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Course Title</label>
                    <Input 
                       required 
                       placeholder="e.g. Mastering React 19" 
                       value={newCourseName} 
                       onChange={e => setNewCourseName(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Subject Category</label>
                    <Input 
                       required 
                       placeholder="e.g. Computer Science" 
                       value={newCourseCategory}
                       onChange={e => setNewCourseCategory(e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Instructor</label>
                    <select 
                       required 
                       value={newCourseInstructor}
                       onChange={e => setNewCourseInstructor(e.target.value)}
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                       <option value="" disabled>Select an instructor...</option>
                       {tutorsList.map(t => (
                         <option key={t.id} value={t.id}>{t.user.name}</option>
                       ))}
                    </select>
                 </div>
                 <Button type="submit" className="w-full font-bold mt-4">Publish Course</Button>
              </form>
           </div>
        </div>
      )}

      {/* TRANSACTIONS MODAL */}
      {showTransactions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50 shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                       <List className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <h3 className="font-bold font-heading text-lg">Financial Transactions</h3>
                       <p className="text-xs text-muted-foreground">Showing latest records</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowTransactions(false)}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                 <div className="rounded-2xl border overflow-hidden">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 border-b">
                          <tr>
                             <th className="p-4 font-semibold text-muted-foreground">Transaction ID</th>
                             <th className="p-4 font-semibold text-muted-foreground">Student</th>
                             <th className="p-4 font-semibold text-muted-foreground">Amount</th>
                             <th className="p-4 font-semibold text-muted-foreground">Date</th>
                             <th className="p-4 font-semibold text-muted-foreground">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y">
                          {data.recentBookings.map((txn: any) => (
                             <tr key={txn.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-mono text-xs">{txn.id}</td>
                                <td className="p-4 font-medium">{txn.student}</td>
                                <td className="p-4 font-bold text-success">{txn.amount}</td>
                                <td className="p-4 text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                   <span className="text-xs font-semibold px-2 py-1 rounded-md bg-success/10 text-success">
                                     {txn.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                          {data.recentBookings.length === 0 && (
                             <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">No recent transactions found.</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}


      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-bold font-heading">Admin Overview</h1>
            <p className="text-muted-foreground mt-1">Platform metrics and pending actions.</p>
         </div>
         <Button onClick={() => setShowAddCourse(true)} className="rounded-full font-bold shadow-sm gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Add Course
         </Button>
      </div>
      
      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: "Total Revenue", value: data.stats.totalRevenue, icon: DollarSign, color: "text-success", bg: "bg-success/10" },
           { label: "Active Students", value: data.stats.totalStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
           { label: "Verified Tutors", value: data.stats.totalTutors, icon: ShieldCheck, color: "text-warning", bg: "bg-warning/10" },
           { label: "Active Courses", value: data.stats.totalCourses, icon: BookOpen, color: "text-muted-foreground", bg: "bg-muted" },
         ].map((stat, i) => (
           <Card key={i} className="rounded-2xl border shadow-sm transition-all duration-500">
             <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold font-heading mb-1 transition-all" key={stat.value}>{stat.value}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* PENDING TUTOR VERIFICATIONS */}
         <Card className="rounded-3xl shadow-sm border col-span-1">
            <CardHeader className="pb-4 border-b">
               <CardTitle className="font-heading text-lg">Pending Tutor Verifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y overflow-hidden">
                 {data.pendingTutors.map((tutor: any) => (
                   <div key={tutor.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-muted-foreground" />
                         </div>
                         <div>
                            <div className="font-bold">{tutor.name}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">Applied: {new Date(tutor.appliedAt).toLocaleDateString()}</div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <Badge variant="outline" className="bg-white">{tutor.subject}</Badge>
                         <div className="flex gap-1">
                            <Button size="icon" onClick={() => handleApproveTutor(tutor.id, tutor.name)} className="w-8 h-8 rounded-full bg-success hover:bg-success/90 text-white shadow-sm">
                               <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" onClick={() => handleRejectTutor(tutor.id, tutor.name)} variant="outline" className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                               <XCircle className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {data.pendingTutors.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground animate-in zoom-in-95 duration-500">
                       <ShieldCheck className="w-12 h-12 text-success/50 mx-auto mb-3" />
                       <p className="font-medium text-foreground">All tutors verified!</p>
                       <p className="text-sm">No pending applications at the moment.</p>
                    </div>
                 )}
               </div>
            </CardContent>
         </Card>
         
         {/* RECENT TRANSACTIONS */}
         <Card className="rounded-3xl shadow-sm border col-span-1">
            <CardHeader className="pb-4 border-b">
               <CardTitle className="font-heading text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y">
                 {data.recentBookings.map((txn: any) => (
                   <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                         <div className="font-bold">{txn.student}</div>
                         <div className="text-sm text-muted-foreground mt-0.5">Tutor: {txn.tutor}</div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-success">{txn.amount}</div>
                         <div className="text-xs font-semibold px-2 py-0.5 mt-1 rounded-md bg-success/10 text-success inline-block">
                           {txn.status}
                         </div>
                      </div>
                   </div>
                 ))}
                 {data.recentBookings.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                       <p className="text-sm">No recent transactions found.</p>
                    </div>
                 )}
               </div>
               {data.recentBookings.length > 0 && (
                 <div className="p-4 border-t text-center">
                    <Button variant="link" className="text-primary font-semibold text-sm" onClick={() => setShowTransactions(true)}>
                       View All Transactions
                    </Button>
                 </div>
               )}
            </CardContent>
         </Card>

      </div>
    </div>
  );
}
