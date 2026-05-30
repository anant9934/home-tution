"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { BarChart3, TrendingUp, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi("/admin/analytics");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl mt-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" /> Platform Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Key metrics and growth indicators for the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Metric Cards - Static mockups based on real UI intent */}
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Total Users</div>
               <div className="text-3xl font-bold font-heading">1,248</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Monthly Revenue</div>
               <div className="text-3xl font-bold font-heading">₹2.4L</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Active Courses</div>
               <div className="text-3xl font-bold font-heading">86</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Avg. Class Rating</div>
               <div className="text-3xl font-bold font-heading">4.8/5</div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm min-h-[400px] flex items-center justify-center flex-col text-center">
         <BarChart3 className="w-16 h-16 text-slate-200 mb-4" />
         <h3 className="font-bold text-lg">Charts Component Loading...</h3>
         <p className="text-muted-foreground max-w-sm mt-2">Historical data array loaded ({stats.length} records). A charting library (like Recharts) will render this data here.</p>
      </div>
    </div>
  );
}
