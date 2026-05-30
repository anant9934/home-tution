"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { IndianRupee, TrendingUp, Download, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherEarningsPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEarnings() {
      try {
        const data = await fetchApi("/tutors/earnings");
        setEarnings(data);
      } catch (err: any) {
        setError(err.message || "Failed to load earnings");
      } finally {
        setLoading(false);
      }
    }
    loadEarnings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl mt-8" />
      </div>
    );
  }

  if (error || !earnings) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Wallet className="w-8 h-8 text-success" /> Earnings & Payouts
          </h1>
          <p className="text-muted-foreground mt-1">Track your revenue, view payment history, and manage withdrawals.</p>
        </div>
        <Button variant="outline" className="rounded-full shadow-sm gap-2 bg-white">
          <Download className="w-4 h-4" /> Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-full -mr-16 -mt-16 transition-colors group-hover:bg-success/10"></div>
            <CardContent className="p-6 relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                     <IndianRupee className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="bg-success/5 text-success border-success/20 font-bold flex gap-1">
                     <TrendingUp className="w-3 h-3" /> +12%
                  </Badge>
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Total Earnings</div>
               <div className="text-3xl font-bold font-heading">₹{(earnings.totalEarnings || 0).toLocaleString()}</div>
            </CardContent>
         </Card>

         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-colors group-hover:bg-primary/10"></div>
            <CardContent className="p-6 relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Wallet className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold flex gap-1">
                     This Month
                  </Badge>
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Monthly Revenue</div>
               <div className="text-3xl font-bold font-heading">₹{(earnings.monthlyEarnings || 0).toLocaleString()}</div>
            </CardContent>
         </Card>

         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -mr-16 -mt-16 transition-colors"></div>
            <CardContent className="p-6 relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                     <TrendingUp className="w-5 h-5" />
                  </div>
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Current Hourly Rate</div>
               <div className="text-3xl font-bold font-heading">₹{(earnings.hourlyRate || 0)} <span className="text-base text-muted-foreground">/ hr</span></div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm mt-8">
         <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold font-heading text-lg">Transaction History</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-muted-foreground uppercase text-xs border-b">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Transaction ID</th>
                     <th className="px-6 py-4 font-semibold">Date</th>
                     <th className="px-6 py-4 font-semibold">Type</th>
                     <th className="px-6 py-4 font-semibold">Amount</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {earnings.history?.map((t: any, i: number) => (
                     <tr key={t.id || i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-xs text-muted-foreground">
                           TRX-{Math.floor(Math.random() * 1000000)}
                        </td>
                        <td className="px-6 py-4">
                           {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                           Class Payment
                        </td>
                        <td className="px-6 py-4 font-bold text-success flex items-center gap-1">
                           <ArrowDownRight className="w-3 h-3" /> ₹{t.amount}
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {t.status || 'SUCCESS'}
                           </Badge>
                        </td>
                     </tr>
                  ))}
                  {(!earnings.history || earnings.history.length === 0) && (
                     <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No recent transactions.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
