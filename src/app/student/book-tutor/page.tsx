"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Search, Star, Clock, BookOpen, MapPin, Wifi, Home, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const PLANS = [
  { label: "Basic", hours: 4, description: "4 hrs/month" },
  { label: "Standard", hours: 8, description: "8 hrs/month" },
  { label: "Premium", hours: 12, description: "12 hrs/month" },
  { label: "Intensive", hours: 20, description: "20 hrs/month" },
];

const MODE_COLORS: Record<string, string> = {
  HOME: "bg-amber-100 text-amber-700",
  ONLINE: "bg-sky-100 text-sky-700",
  BOTH: "bg-violet-100 text-violet-700",
};

export default function BookTutorPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"ALL" | "HOME" | "ONLINE" | "BOTH">("ALL");

  useEffect(() => {
    fetchApi("/tutors/public")
      .then((data) => setTutors(Array.isArray(data) ? data : []))
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tutors.filter((t) => {
    const name = t.user?.name?.toLowerCase() || "";
    const subjects = (t.subjects || []).join(" ").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || subjects.includes(search.toLowerCase());
    const matchMode = modeFilter === "ALL" || t.teachingMode === modeFilter || t.teachingMode === "BOTH";
    return matchSearch && matchMode;
  });

  return (
    <div className="space-y-8 pb-20 lg:pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" /> Find Your Tutor
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse verified tutors, pick a monthly plan, and get started today.
        </p>
      </div>

      {/* Plans Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PLANS.map((plan) => (
          <div key={plan.label} className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{plan.label}</div>
            <div className="text-lg font-bold">{plan.hours} hrs</div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject..."
            className="pl-9 rounded-full bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "HOME", "ONLINE", "BOTH"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                modeFilter === mode
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
              }`}
            >
              {mode === "ALL" ? "All Modes" : mode === "HOME" ? "🏠 Home" : mode === "ONLINE" ? "💻 Online" : "🌐 Both"}
            </button>
          ))}
        </div>
      </div>

      {/* Tutor Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary/30" />
          <p className="font-medium text-foreground">No tutors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onBook={() => router.push(`/student/book-tutor/${tutor.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TutorCard({ tutor, onBook }: { tutor: any; onBook: () => void }) {
  const minRate = tutor.hourlyRate || 0;

  return (
    <div className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Card Header */}
      <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
            {tutor.user?.name?.charAt(0) || "T"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
              {tutor.user?.name || "Tutor"}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-700">{tutor.rating?.toFixed(1) || "New"}</span>
              {tutor.totalReviews > 0 && (
                <span className="text-xs text-muted-foreground">({tutor.totalReviews})</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 space-y-3">
        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5">
          {(tutor.subjects || []).slice(0, 3).map((s: string) => (
            <Badge key={s} variant="secondary" className="text-xs rounded-full">{s}</Badge>
          ))}
          {(tutor.subjects || []).length > 3 && (
            <Badge variant="outline" className="text-xs rounded-full">+{tutor.subjects.length - 3}</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{tutor.experienceYears || 0} yrs exp</span>
          </div>
          <div className="flex items-center gap-1.5">
            {tutor.teachingMode === "HOME" ? (
              <Home className="w-3.5 h-3.5 text-amber-500" />
            ) : tutor.teachingMode === "ONLINE" ? (
              <Wifi className="w-3.5 h-3.5 text-sky-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-violet-500" />
            )}
            <span>{tutor.teachingMode || "BOTH"}</span>
          </div>
        </div>

        {tutor.bio && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tutor.bio}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xs text-muted-foreground">from</span>
            <div className="text-lg font-bold text-primary">
              ₹{minRate}<span className="text-xs font-normal text-muted-foreground">/hr</span>
            </div>
          </div>
          <button
            onClick={onBook}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
