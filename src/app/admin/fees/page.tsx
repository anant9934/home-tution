"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { IndianRupee, Search, Download, ArrowUpRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const totalCollected = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees.filter(f => f.status !== 'PAID').reduce((sum, f) => sum + f.amount, 0);

  const handleExportCsv = () => {
    if (fees.length === 0) return;
    const header = "Invoice ID,Student,Amount,Due Date,Status\n";
    const rows = fees.map(f => `${f.id},"${f.student?.user?.name || ''}",${f.amount},${new Date(f.dueDate).toLocaleDateString()},${f.status}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fees-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function loadFees() {
      try {
        const data = await fetchApi("/admin/fees");
        setFees(data);
      } catch (err: any) {
        setError(err.message || "Failed to load fee records");
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-success" /> Fee Management
          </h1>
          <p className="text-muted-foreground mt-1">Track student payments, pending dues, and ledger history.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-full shadow-sm gap-2">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button variant="default" onClick={handleExportCsv} className="rounded-full shadow-sm gap-2 bg-slate-900 hover:bg-slate-800">
             <Download className="w-4 h-4" /> Export CSV
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
         <div className="bg-white border rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Collected</p>
            <p className="text-2xl font-bold font-heading text-success flex items-center"><IndianRupee className="w-5 h-5" /> {totalCollected.toLocaleString()}</p>
         </div>
         <div className="bg-white border rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Pending</p>
            <p className="text-2xl font-bold font-heading text-warning flex items-center"><IndianRupee className="w-5 h-5" /> {totalPending.toLocaleString()}</p>
         </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Invoice ID</th>
                     <th className="px-6 py-4 font-semibold">Student</th>
                     <th className="px-6 py-4 font-semibold">Amount Due</th>
                     <th className="px-6 py-4 font-semibold">Due Date</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {fees.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {f.id.split('-')[0].toUpperCase()}
                       </td>
                       <td className="px-6 py-4">
                          <div className="font-bold">{f.student?.user?.name}</div>
                          <div className="text-xs text-muted-foreground">{f.student?.user?.email}</div>
                       </td>
                       <td className="px-6 py-4 font-bold text-base flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          {f.amount.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 font-medium text-muted-foreground">
                          {new Date(f.dueDate).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={
                              f.status === 'PAID' ? 'bg-success/10 text-success border-success/20' : 
                              f.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                              'bg-destructive/10 text-destructive border-destructive/20'
                            }
                          >
                             {f.status}
                          </Badge>
                       </td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No fee records found in the system.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
