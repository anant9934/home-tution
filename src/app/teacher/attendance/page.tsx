"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { CalendarCheck, Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TeacherAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [classes, setClasses]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  
  // Modal State
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [markData, setMarkData]           = useState({ bookingId: "", status: "PRESENT" });

  useEffect(() => {
    Promise.all([fetchApi("/tutors/attendance"), fetchApi("/tutors/classes")])
      .then(([att, cls]) => {
        setAttendance(Array.isArray(att) ? att : []);
        setClasses(Array.isArray(cls) ? cls : []);
      })
      .catch(err => toast.error(err.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markData.bookingId) return toast.error("Select a class");
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/attendance", {
        method: "POST",
        body: JSON.stringify(markData),
      });
      // Fetch fresh attendance to get relations
      const fresh = await fetchApi("/tutors/attendance");
      setAttendance(Array.isArray(fresh) ? fresh : []);
      setShowMarkModal(false);
      setMarkData({ bookingId: "", status: "PRESENT" });
      toast.success("Attendance marked!");
    } catch (err: any) {
      toast.error(err.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 pb-20">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-[400px] rounded-3xl" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-primary" /> Attendance Log
          </h1>
          <p className="text-muted-foreground mt-1">View past attendance and mark presence for your classes.</p>
        </div>
        <button
          onClick={() => setShowMarkModal(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/90 text-sm"
        >
          Mark Attendance
        </button>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold font-heading">Recent Records</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search records..." className="w-full bg-white border rounded-full pl-9 pr-4 py-1.5 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class Date</th>
                <th className="px-6 py-4">Marked At</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {attendance.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold">{a.student?.user?.name || "Student"}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {a.session?.booking?.scheduledAt ? new Date(a.session.booking.scheduledAt).toLocaleDateString("en-IN") : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      a.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-200' :
                      a.status === 'LATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }>
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-in zoom-in-95">
            <h2 className="text-xl font-bold font-heading mb-5">✅ Mark Attendance</h2>
            <form onSubmit={handleMark} className="space-y-5">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Select Class / Student</label>
                <select
                  required
                  value={markData.bookingId}
                  onChange={e => setMarkData({ ...markData, bookingId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select a confirmed class...</option>
                  {classes.filter(c => c.status === "CONFIRMED").map(c => (
                    <option key={c.id} value={c.id}>
                      {c.student} - {new Date(c.scheduledAt).toLocaleDateString("en-IN")}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">Only CONFIRMED classes appear here.</p>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Status</label>
                <div className="flex gap-2">
                  {['PRESENT', 'ABSENT', 'LATE'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setMarkData({ ...markData, status: s })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                        markData.status === s
                          ? s === 'PRESENT' ? 'bg-green-100 border-green-500 text-green-700'
                          : s === 'ABSENT' ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-amber-100 border-amber-500 text-amber-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMarkModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
