"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Users, Search, Mail, Phone, MessageSquare, TrendingUp, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TeacherStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchApi("/tutors/students");
        setStudents(data);
      } catch (err: any) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = useMemo(() =>
    students.filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

  const handleMessageStudent = async (student: any) => {
    setStartingChat(student.id);
    try {
      // student.id is the StudentProfile.id, we need the userId
      // We'll use student email to look up user - pass student profileId
      const res = await fetchApi("/messages/conversations", {
        method: "POST",
        body: JSON.stringify({ targetUserId: student.userId || student.id })
      });
      router.push("/teacher/messages");
    } catch (err: any) {
      toast.error(err.message || "Failed to start conversation");
    } finally {
      setStartingChat(null);
    }
  };

  const getXpLevel = (xp: number) => {
    if (xp >= 500) return { label: "Gold", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    if (xp >= 200) return { label: "Silver", color: "bg-slate-100 text-slate-600 border-slate-200" };
    return { label: "Bronze", color: "bg-orange-100 text-orange-600 border-orange-200" };
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive font-semibold p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> My Students
          </h1>
          <p className="text-muted-foreground mt-1">
            {students.length} enrolled student{students.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 rounded-full bg-white shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(s => {
          const level = getXpLevel(s.totalXp);
          return (
            <div key={s.id} className="bg-white border rounded-3xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 border-2 border-white shadow-sm shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {s.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base truncate">{s.name}</h3>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 ${level.color}`}>
                      <Star className="w-2.5 h-2.5 mr-1" />{level.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.class} • {s.board}</p>
                  <p className="text-xs text-muted-foreground">Joined {new Date(s.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold font-heading text-primary">{s.totalXp}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">XP Earned</div>
                </div>
                <div className="bg-success/5 rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold font-heading text-success">{s.completedLessons}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Lessons Done</div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" /> {s.email}
                </div>
                {s.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> {s.phone}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl gap-1.5 text-xs"
                  onClick={() => handleMessageStudent(s)}
                  disabled={startingChat === s.id}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {startingChat === s.id ? "Opening..." : "Message"}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-xl gap-1.5 text-xs"
                  onClick={() => router.push(`/teacher/attendance`)}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Attendance
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-3xl">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {search ? `No students match "${search}"` : "No students enrolled yet."}
          </p>
        </div>
      )}
    </div>
  );
}
