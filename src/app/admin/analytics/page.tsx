"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { BarChart3, TrendingUp, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, dashboardData] = await Promise.all([
          fetchApi("/admin/analytics"),
          fetchApi("/admin/dashboard")
        ]);
        setStats(statsData);
        setDashboardStats(dashboardData.stats);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
               <div className="text-sm font-semibold text-muted-foreground mb-1">Total Students</div>
               <div className="text-3xl font-bold font-heading">{dashboardStats?.totalStudents || 0}</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Total Revenue</div>
               <div className="text-3xl font-bold font-heading">{dashboardStats?.totalRevenue || "₹0"}</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Active Courses</div>
               <div className="text-3xl font-bold font-heading">{dashboardStats?.totalCourses || 0}</div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
               <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
               </div>
               <div className="text-sm font-semibold text-muted-foreground mb-1">Verified Tutors</div>
               <div className="text-3xl font-bold font-heading">{dashboardStats?.totalTutors || 0}</div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col">
         <h3 className="font-bold text-lg mb-6">Revenue Trend (Last 30 Days)</h3>
         {stats.length > 0 ? (
           <div className="flex-1 flex items-end gap-2 h-[300px] pt-10">
             {stats.reverse().map((stat, i) => {
                const maxRev = Math.max(...stats.map(s => s.revenue), 100);
                const heightPercent = Math.max((stat.revenue / maxRev) * 100, 5); // min 5% height for visibility
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary/20 rounded-t-md relative hover:bg-primary transition-colors cursor-pointer" style={{ height: `${heightPercent}%` }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none z-10 whitespace-nowrap">
                         ₹{stat.revenue}
                       </div>
                    </div>
                  </div>
                );
             })}
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
             <BarChart3 className="w-16 h-16 text-slate-200 mb-4" />
             <p>No historical data available to chart.</p>
           </div>
         )}
      </div>
    </div>
  );
}
