"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Book, Calendar, MapPin, Plus, Clock, CheckCircle2, XCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

export default function TeacherClassesPage() {
  const [classes, setClasses]   = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    scheduledAt: "",
    duration: 60,
    location: "",
    notes: "",
  });

  useEffect(() => {
    Promise.all([
      fetchApi("/tutors/classes"),
      fetchApi("/tutors/students"),
    ])
      .then(([cls, stu]) => {
        setClasses(Array.isArray(cls) ? cls : []);
        setStudents(Array.isArray(stu) ? stu : []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) return toast.error("Please select a student");
    setSubmitting(true);
    try {
      const res = await fetchApi("/tutors/bookings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setClasses(prev => [
        {
          id: res.id,
          title: "1-on-1 Tuition",
          student: res.student?.user?.name || "Student",
          scheduledAt: form.scheduledAt,
          duration: form.duration,
          status: "CONFIRMED",
          location: form.location,
        },
        ...prev,
      ]);
      setShowModal(false);
      setForm({ studentId: "", subject: "", scheduledAt: "", duration: 60, location: "", notes: "" });
      toast.success("Class scheduled successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule class");
    } finally {
      setSubmitting(false);
    }
  };

  const upcoming = classes.filter(c => new Date(c.scheduledAt) >= new Date() || c.status === "PENDING" || c.status === "CONFIRMED");
  const past     = classes.filter(c => new Date(c.scheduledAt) < new Date() && c.status !== "CONFIRMED" && c.status !== "PENDING");

  if (loading) return (
    <div className="space-y-4 pb-20">
      <Skeleton className="h-10 w-56" />
      {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" /> My Classes
          </h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your home tuition sessions.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-primary/90 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Schedule Class
        </button>
      </div>

      {/* Upcoming */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-3xl p-10 text-center text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-primary/30" />
            <p className="font-semibold">No upcoming sessions</p>
            <p className="text-sm mt-1">Click "Schedule Class" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(c => (
              <div key={c.id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {(c.student || "S").charAt(0)}
                  </div>
                  <Badge className={`text-xs border ${STATUS_STYLE[c.status] || "bg-slate-100"}`}>{c.status}</Badge>
                </div>
                <h3 className="font-bold text-base">{c.student || "Student"}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(c.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  <span>• {c.duration} mins</span>
                </div>
                {c.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {c.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-slate-500">
            <Clock className="w-5 h-5" /> Past Sessions
          </h2>
          <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {past.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold">{c.student}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(c.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{c.duration} mins</td>
                    <td className="px-6 py-4">
                      <Badge className={`text-xs border ${STATUS_STYLE[c.status] || "bg-slate-100"}`}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 animate-in zoom-in-95">
            <h2 className="text-xl font-bold font-heading mb-5">📅 Schedule New Class</h2>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Student *</label>
                <select
                  required
                  value={form.studentId}
                  onChange={e => setForm({ ...form, studentId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.class || "N/A"})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Subject *</label>
                  <input
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1.5">Duration (mins) *</label>
                  <input
                    type="number"
                    required
                    min={30}
                    step={30}
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1.5">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={form.scheduledAt}
                  onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                  Location / Address <span className="text-muted-foreground font-normal">(for home tuition)</span>
                </label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Student's home, Sector 12, Noida"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1.5">Notes (optional)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Topics to cover, bring textbook, etc."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</> : "Schedule Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
