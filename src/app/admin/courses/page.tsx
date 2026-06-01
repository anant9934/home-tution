"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { BookOpen, Search, EyeOff, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const data = await fetchApi("/admin/courses");
      setCourses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await fetchApi(`/admin/courses/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: newStatus })
      });
      setCourses(prev => prev.map(c => c.id === id ? { ...c, isPublished: newStatus } : c));
      toast.success(`Course ${newStatus ? 'published' : 'unpublished'} successfully.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update course status.");
    }
  };

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

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" /> Course Catalog
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage the {courses.length} courses published by tutors.</p>
        </div>
        <div className="relative w-full sm:w-72">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <Input 
             placeholder="Search titles or subjects..." 
             className="pl-9 rounded-full bg-white shadow-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-muted-foreground uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Course Title</th>
                     <th className="px-6 py-4 font-semibold">Category</th>
                     <th className="px-6 py-4 font-semibold">Content</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-bold text-base max-w-[300px] truncate">{c.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">Created {new Date(c.createdAt).toLocaleDateString()}</div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-slate-100">{c.subject}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">{c.class} • {c.board}</div>
                       </td>
                       <td className="px-6 py-4 font-medium flex items-center gap-1.5 h-full pt-6">
                          <LayoutGrid className="w-4 h-4 text-muted-foreground" /> {c.chapters?.length || 0} Modules
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="outline" className={c.isPublished ? 'bg-success/10 text-success border-success/20' : 'bg-slate-100 text-slate-500 border-slate-200'}>
                             {c.isPublished ? 'Live' : 'Draft'}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Button 
                             onClick={() => handleTogglePublish(c.id, c.isPublished)}
                             variant="ghost" 
                             size="sm" 
                             className={`font-semibold gap-1.5 ${c.isPublished ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : 'text-success hover:text-success hover:bg-success/10'}`}
                          >
                             <EyeOff className="w-4 h-4" /> {c.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>
                       </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No courses found matching your search.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
